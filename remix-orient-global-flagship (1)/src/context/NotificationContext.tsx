import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  requestDevicePermission: () => Promise<boolean>;
  devicePermissionStatus: NotificationPermission | 'unsupported';
  isNotificationsEnabled: boolean;
  toggleNotifications: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [devicePermissionStatus, setDevicePermissionStatus] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('orient_notifications_enabled');
        if (saved !== null) return saved !== 'false';
      }
    } catch (e) {}
    return true;
  });
  // Track notification IDs we have already shown a device alert for (prevents duplicate popups on refresh)
  const seenNotifIds = useRef<Set<string>>(new Set());
  // Track when this session started so we don't re-alert old notifications
  const sessionStartMs = useRef<number>(Date.now());

  // Auto-request device notification permission on first load
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        setDevicePermissionStatus(perm);
      });
    }
  }, []);

  // Subscribe to Firestore notifications collection — fires on every device that is open
  useEffect(() => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            const data = change.doc.data();
            const id = change.doc.id;
            const createdAtMs = data.createdAt instanceof Timestamp
              ? data.createdAt.toMillis()
              : typeof data.createdAt === 'string'
                ? new Date(data.createdAt).getTime()
                : Date.now();

            // Only show device notification for new docs (arrived after session start)
            if (!seenNotifIds.current.has(id) && createdAtMs > sessionStartMs.current - 5000) {
              seenNotifIds.current.add(id);
              fireDeviceNotification(data.title || 'Orient Global', data.message || '');
            }
          }
        });
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore notification listener error:', e);
    }
  }, []);

  const fireDeviceNotification = (title: string, body: string) => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (!isNotificationsEnabled) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (e) {
        console.warn('Device notification error:', e);
      }
    }
  };

  const requestDevicePermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setDevicePermissionStatus('unsupported');
      return false;
    }
    try {
      const perm = await Notification.requestPermission();
      setDevicePermissionStatus(perm);
      if (perm === 'granted') {
        try {
          new Notification('Orient Global Notifications Enabled 🔔', {
            body: 'You will now receive order updates & kitchen countdown alerts on this device.',
            icon: '/favicon.ico',
          });
        } catch (err) {
          console.warn('Notification error:', err);
        }
        return true;
      }
    } catch (e) {
      console.warn('Permission error:', e);
    }
    return false;
  };

  const toggleNotifications = async (): Promise<boolean> => {
    if (isNotificationsEnabled) {
      setIsNotificationsEnabled(false);
      try {
        localStorage.setItem('orient_notifications_enabled', 'false');
      } catch (e) {}
      return false;
    } else {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted') {
        await requestDevicePermission();
      }
      setIsNotificationsEnabled(true);
      try {
        localStorage.setItem('orient_notifications_enabled', 'true');
      } catch (e) {}
      return true;
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Also trigger device notification for in-app addNotification calls
    fireDeviceNotification(notification.title || 'Orient Global', notification.message);

    setTimeout(() => removeNotification(newNotification.id), 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      requestDevicePermission,
      devicePermissionStatus,
      isNotificationsEnabled,
      toggleNotifications
    }}>
      {children}
      {/* Toast overlay */}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl shadow-xl border pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300 ${
              n.type === 'success' ? 'bg-emerald-950 border-emerald-700 text-emerald-100' :
              n.type === 'error' ? 'bg-red-950 border-red-700 text-red-100' :
              n.type === 'warning' ? 'bg-amber-950 border-amber-700 text-amber-100' :
              'bg-card border-border text-foreground'
            }`}
          >
            <h4 className="font-bold text-sm">{n.title}</h4>
            <p className="text-xs mt-0.5 opacity-80">{n.message}</p>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
