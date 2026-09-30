import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { 
  triggerDeviceNotification, 
  isNotificationTargetingCurrentDevice,
  isCurrentDeviceAdmin 
} from '../services/notificationService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  recipient?: 'user' | 'cms' | 'admin' | 'all' | string;
  userId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'> & { id?: string }) => void;
  removeNotification: (id: string) => void;
  requestDevicePermission: () => Promise<boolean>;
  devicePermissionStatus: NotificationPermission | 'unsupported';
  isNotificationsEnabled: boolean;
  toggleNotifications: () => Promise<boolean>;
  fireDeviceNotification: (title: string, body: string, id?: string, recipient?: string, userId?: string) => boolean;
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

  // Track when this session started so we don't re-alert old notifications
  const sessionStartMs = useRef<number>(Date.now());

  // Auto-request device notification permission on first load if not decided
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        setDevicePermissionStatus(perm);
      });
    }
  }, []);

  const fireDeviceNotification = (
    title: string, 
    body: string, 
    id?: string, 
    recipient?: string, 
    userId?: string
  ): boolean => {
    return triggerDeviceNotification({
      id,
      title,
      body,
      recipient,
      userId,
      isNotificationsEnabled
    });
  };

  // Subscribe to Firestore notifications collection — fires once per unique doc,
  // strictly filtered by recipient targeting (User vs Admin) and globally deduplicated by ID.
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

            // Only consider recent docs (arrived within last 15 seconds or during this active session)
            if (createdAtMs > sessionStartMs.current - 15000) {
              fireDeviceNotification(
                data.title || 'Orient Global',
                data.message || '',
                id,
                data.recipient,
                data.userId || data.customerId
              );
            }
          }
        });
      });
      return () => unsub();
    } catch (e) {
      console.warn('Firestore notification listener error:', e);
    }
  }, [isNotificationsEnabled]);

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
          new Notification('Orient Global Notifications Enabled', {
            body: 'You will now receive order updates & kitchen alerts on this device.',
            icon: '/favicon.ico',
            tag: 'permission-granted'
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

  // Add an in-app visual toast banner (does NOT trigger duplicate device popups)
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'> & { id?: string }) => {
    // Check recipient targeting for in-app toast
    if (notification.recipient && !isNotificationTargetingCurrentDevice({ recipient: notification.recipient, userId: notification.userId })) {
      return;
    }

    const notifId = notification.id || `TOAST-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newNotification: Notification = {
      ...notification,
      id: notifId,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [...prev, newNotification]);

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
      toggleNotifications,
      fireDeviceNotification
    }}>
      {children}
      {/* In-app Toast overlay */}
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
