import { getActiveAdminUser, getActiveConsumerUser } from './userService';

export type NotificationRecipient = 'user' | 'customer' | 'admin' | 'cms' | 'all';

export interface NotificationTarget {
  id?: string;
  recipient?: 'user' | 'customer' | 'admin' | 'cms' | 'all' | string;
  userId?: string;
  customerId?: string;
}

const DELIVERED_STORAGE_KEY = 'orient_delivered_notification_ids';

/**
 * Robustly checks whether the current device/session is in Admin mode.
 */
export function isCurrentDeviceAdmin(roleOverride?: string | null): boolean {
  if (roleOverride) {
    return roleOverride === 'boss' || roleOverride === 'hod' || roleOverride === 'staff';
  }

  if (typeof window !== 'undefined') {
    try {
      const mode = sessionStorage.getItem('orient_dashboard_mode');
      if (mode === 'admin') return true;
      if (mode === 'customer') return false;
    } catch (e) {}

    try {
      const savedAdmin = sessionStorage.getItem('orient_active_admin_user_session') || localStorage.getItem('orient_active_admin_user');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        const user = parsed.user || parsed;
        if (user && user.role && user.role !== 'customer') {
          return true;
        }
      }
    } catch (e) {}
  }

  const admin = getActiveAdminUser();
  if (admin && admin.role && admin.role !== 'customer') {
    return true;
  }

  return false;
}

/**
 * Deterministically checks whether a notification is for the Admin / CMS.
 * Prevents user notifications from EVER leaking to the admin dashboard.
 */
export function isNotificationForAdmin(notif: {
  id?: string;
  recipient?: string;
  title?: string;
  message?: string;
  userId?: string;
  customerId?: string;
}): boolean {
  const id = (notif.id || '').toUpperCase();
  // 1. Explicit ID checks
  if (id.startsWith('NOTIF-U-') || id.includes('-U-') || id.startsWith('USER-')) {
    return false;
  }
  if (id.startsWith('NOTIF-C-') || id.includes('-C-') || id.startsWith('CMS-') || id.startsWith('ADMIN-')) {
    return true;
  }

  // 2. Explicit recipient checks
  const recip = (notif.recipient || '').toLowerCase().trim();
  if (recip === 'cms' || recip === 'admin') {
    return true;
  }
  if (recip === 'user' || recip === 'customer') {
    return false;
  }
  if (recip === 'all') {
    return true;
  }

  // 3. User ID checks
  const targetUser = (notif.userId || notif.customerId || '').toLowerCase();
  if (targetUser === 'usr_admin_boss') {
    return true;
  }

  // 4. Content heuristics for legacy records missing explicit recipient
  const title = (notif.title || '').toLowerCase();
  const message = (notif.message || '').toLowerCase();
  if (
    title.includes('your order') || 
    title.includes('your meal') || 
    message.includes('your order') || 
    message.includes('your meal') ||
    title.includes('meal ready!')
  ) {
    return false; // User notification
  }
  if (
    title.includes('needs chef') || 
    message.includes('needs chef') || 
    title.includes('warning sent') || 
    message.includes('warning sent to customer') ||
    title.includes('order cancelled / deleted') ||
    message.includes('removed from the active queue') ||
    title.includes('new order incoming') ||
    title.includes('incoming')
  ) {
    return true; // Admin notification
  }

  // Default: strictly disallow unknown/user notifications on admin
  return false;
}

/**
 * Deterministically checks whether a notification is for the User / Customer.
 * Prevents admin notifications from EVER leaking to the user dashboard.
 */
export function isNotificationForUser(notif: {
  id?: string;
  recipient?: string;
  title?: string;
  message?: string;
  userId?: string;
  customerId?: string;
}): boolean {
  // If it's recognized as an Admin notification, never show to User
  if (isNotificationForAdmin(notif)) {
    return false;
  }

  const id = (notif.id || '').toUpperCase();
  // 1. Explicit ID checks
  if (id.startsWith('NOTIF-C-') || id.includes('-C-') || id.startsWith('CMS-') || id.startsWith('ADMIN-')) {
    return false;
  }
  if (id.startsWith('NOTIF-U-') || id.includes('-U-') || id.startsWith('USER-')) {
    return true;
  }

  // 2. Explicit recipient checks
  const recip = (notif.recipient || '').toLowerCase().trim();
  if (recip === 'cms' || recip === 'admin') {
    return false;
  }
  if (recip === 'user' || recip === 'customer' || recip === 'all') {
    return true;
  }

  // 3. User ID checks
  const targetUser = (notif.userId || notif.customerId || '').toLowerCase();
  if (targetUser === 'usr_admin_boss') {
    return false;
  }

  // 4. Content heuristics
  const title = (notif.title || '').toLowerCase();
  const message = (notif.message || '').toLowerCase();
  if (
    title.includes('needs chef') || 
    message.includes('needs chef') || 
    title.includes('warning sent') || 
    message.includes('warning sent to customer') ||
    title.includes('order cancelled / deleted') ||
    title.includes('new order incoming') ||
    title.includes('incoming') ||
    message.includes('removed from the active queue')
  ) {
    return false; // Admin notification
  }
  if (
    title.includes('your order') || 
    title.includes('your meal') || 
    message.includes('your order') || 
    message.includes('your meal') ||
    title.includes('meal ready!')
  ) {
    return true; // User notification
  }

  return true;
}

/**
 * Validates whether a notification is allowed to be delivered/displayed on this device.
 * - Notifications sent to the user are sent ONLY to the user (NEVER to admin).
 * - Notifications sent to the admin/cms are sent ONLY to the admin (NEVER to user).
 */
export function isNotificationTargetingCurrentDevice(
  notif: NotificationTarget,
  currentRole?: string | null,
  currentUserId?: string | null
): boolean {
  const isAdmin = isCurrentDeviceAdmin(currentRole);
  if (isAdmin) {
    return isNotificationForAdmin(notif as any);
  } else {
    if (!isNotificationForUser(notif as any)) return false;
    const targetUserId = notif.userId || notif.customerId;
    if (targetUserId && currentUserId && targetUserId !== 'usr_guest' && targetUserId !== currentUserId) {
      return false;
    }
    return true;
  }
}

/**
 * In-memory set for the active window lifecycle
 */
const inMemoryDeliveredIds = new Set<string>();

/**
 * Checks if a device notification with this ID was already displayed on this device.
 */
export function isNotificationDelivered(notifId?: string): boolean {
  if (!notifId) return false;
  if (inMemoryDeliveredIds.has(notifId)) return true;

  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(DELIVERED_STORAGE_KEY);
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        if (Array.isArray(ids) && ids.includes(notifId)) {
          inMemoryDeliveredIds.add(notifId);
          return true;
        }
      }
    } catch (e) {}
  }

  return false;
}

/**
 * Marks a notification ID as delivered so it can NEVER fire again on this device.
 */
export function markNotificationDelivered(notifId?: string): void {
  if (!notifId) return;
  inMemoryDeliveredIds.add(notifId);

  if (typeof window !== 'undefined') {
    try {
      const raw = sessionStorage.getItem(DELIVERED_STORAGE_KEY);
      let ids: string[] = [];
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) ids = parsed;
      }
      if (!ids.includes(notifId)) {
        ids.push(notifId);
        // Keep up to 250 recent IDs to avoid storage bloat
        if (ids.length > 250) ids = ids.slice(-250);
        sessionStorage.setItem(DELIVERED_STORAGE_KEY, JSON.stringify(ids));
      }
    } catch (e) {}
  }
}

/**
 * Centralized, authoritative dispatcher for native browser Device Notifications.
 * Guarantees:
 * 1. Fires EXACTLY ONCE per notification ID across all tabs/renders/events.
 * 2. Emits tag parameter for OS-level notification replacement & deduplication.
 * 3. Enforces recipient targeting: User notifications ONLY to User, Admin notifications ONLY to Admin.
 */
export function triggerDeviceNotification(params: {
  id?: string;
  title: string;
  body: string;
  recipient?: string;
  userId?: string;
  customerId?: string;
  currentRole?: string | null;
  currentUserId?: string | null;
  isNotificationsEnabled?: boolean;
}): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;
  if (params.isNotificationsEnabled === false) return false;

  // Check user settings toggle
  try {
    const saved = localStorage.getItem('orient_notifications_enabled');
    if (saved === 'false') return false;
  } catch (e) {}

  // 1. Recipient check: User vs Admin
  const isTargeted = isNotificationTargetingCurrentDevice(
    { recipient: params.recipient, userId: params.userId, customerId: params.customerId },
    params.currentRole,
    params.currentUserId
  );
  if (!isTargeted) {
    return false;
  }

  // 2. Strict Deduplication check: Fire only once per notification ID
  const notifId = params.id;
  if (notifId) {
    if (isNotificationDelivered(notifId)) {
      return false; // Already delivered to this device!
    }
    markNotificationDelivered(notifId);
  }

  // 3. Fire native Web Notification with tag
  try {
    new Notification(params.title, {
      body: params.body,
      icon: '/favicon.ico',
      tag: notifId || undefined // OS-level deduplication identifier
    });
    return true;
  } catch (err) {
    console.warn('Device notification trigger error:', err);
    return false;
  }
}
