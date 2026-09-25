import { db } from '../firebase';
import { 
  collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, Timestamp, writeBatch, increment 
} from 'firebase/firestore';
import { cmsApi } from './cmsApi';
import { getActiveConsumerUser } from './userService';

export interface OrderItem {
  id: string; // Product SKU ID e.g. PRD-B-001
  name: string;
  quantity: number;
  price: number; // Always 10 Naira
  division?: string;
  category?: string;
  image?: string;
}

export type OrderStatus = 'awaiting_chef' | 'confirmed' | 'preparing' | 'ten_min_warning' | 'five_min_warning' | 'ready' | 'completed' | 'cancelled';

export interface CustomerOrder {
  id: string;
  division?: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  tableNumber?: string;
  shippingAddress?: string;
  notes?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  prepDurationMinutes: number; // e.g. 25
  timerEndsAt?: number | null; // epoch ms timestamp
  chefConfirmedAt?: string | null;
  tenMinAlertSent: boolean;
  fiveMinAlertSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  orderId?: string;
  type: 'order_placed' | 'order_confirmed' | 'ten_min_warning' | 'five_min_warning' | 'order_ready' | 'order_cancelled' | 'info';
  recipient: 'user' | 'cms' | 'all';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Safe local storage abstraction
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
  }
};

// In-memory cache for fast local access
let ordersCache: CustomerOrder[] = [];
let notificationsCache: AppNotification[] = [];

// Helper sound playback for alerts
export function playAlertSound(type: 'placed' | 'confirmed' | 'warning' | 'ready' = 'placed') {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'placed') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    } else if (type === 'confirmed') {
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
    } else if (type === 'warning') {
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
    } else {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.3); // D6
    }
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

export const orderService = {
  /**
   * 1. Place Order (User Initiated)
   * - Sets unit price to 10 Naira per item
   * - Status = 'awaiting_chef'
   * - Does NOT decrement stock!
   * - Sends notification to User
   * - Sends notification to CMS
   */
  placeOrder: async (input: {
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    tableNumber?: string;
    shippingAddress?: string;
    notes?: string;
    division?: string;
    items: Array<{ id: string; name: string; quantity: number; division?: string; category?: string; image?: string; price?: number }>;
    prepDurationMinutes?: number;
    totalAmount?: number;
    status?: OrderStatus;
  }): Promise<CustomerOrder> => {
    const activeUser = getActiveConsumerUser();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const targetDivision = input.division || input.items[0]?.division || 'dining';

    // Enforce 10 Naira price on every item
    const sanitizedItems: OrderItem[] = input.items.map(item => ({
      id: item.id,
      name: item.name,
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: 10, // Strictly 10 Naira as requested
      division: item.division || targetDivision,
      category: item.category || 'General',
      image: item.image || ''
    }));

    const totalAmount = sanitizedItems.reduce((acc, item) => acc + (item.quantity * 10), 0);

    const newOrder: CustomerOrder = {
      id: orderId,
      division: targetDivision,
      customerId: input.customerId?.trim() || activeUser?.id || 'usr_guest',
      customerName: input.customerName?.trim() || activeUser?.name || 'Guest User',
      customerEmail: input.customerEmail?.trim() || activeUser?.email || 'guest@orient.app',
      customerPhone: input.customerPhone?.trim() || activeUser?.phone || '+234 800 000 0000',
      tableNumber: input.tableNumber?.trim() || 'Takeout / Pickup',
      shippingAddress: input.shippingAddress?.trim() || activeUser?.deliveryAddress || 'Standard Delivery Address',
      notes: input.notes?.trim() || '',
      items: sanitizedItems,
      totalAmount,
      status: 'awaiting_chef',
      prepDurationMinutes: input.prepDurationMinutes || 11,
      timerEndsAt: null,
      chefConfirmedAt: null,
      tenMinAlertSent: false,
      fiveMinAlertSent: false,
      createdAt: nowIso,
      updatedAt: nowIso
    };

    // Save to Firestore 'orders' collection
    try {
      await setDoc(doc(db, 'orders', orderId), {
        ...newOrder,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.warn("Could not write order directly to Firestore, saving to local state:", err);
    }

    // Save to local cache
    ordersCache = [newOrder, ...ordersCache.filter(o => o.id !== orderId)];
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
      safeStorage.setItem('orient_last_user_order', JSON.stringify(newOrder));
    } catch (e) {}

    // Dispatch Notification 1: User receives confirmation
    const userNotif: AppNotification = {
      id: `NOTIF-U-${Date.now()}`,
      orderId,
      type: 'order_placed',
      recipient: 'user',
      title: 'Order Placed Successfully! 🛒',
      message: `Your order #${orderId} (${sanitizedItems.length} items, ₦${totalAmount.toLocaleString()}) has been sent to the kitchen. Waiting for chef confirmation.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    // Dispatch Notification 2: CMS receives alert
    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'order_placed',
      recipient: 'cms',
      title: '🔔 New Order Incoming (Awaiting Chef)',
      message: `Order #${orderId} from ${newOrder.customerName} (${newOrder.tableNumber}) needs chef confirmation. Total: ₦${totalAmount.toLocaleString()}`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    playAlertSound('placed');
    return newOrder;
  },

  /**
   * 2. Chef Confirms and Starts Order
   * - Status = 'preparing'
   * - Starts fixed timer (e.g. 25 minutes or custom)
   * - AUTO-DECREMENTS STOCK for each item
   * - Sends notification to User
   * - Sends notification to CMS
   */
  confirmAndStartOrder: async (orderId: string, prepMinutes?: number): Promise<CustomerOrder> => {
    const order = await orderService.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const prepDuration = prepMinutes || order.prepDurationMinutes || 11;
    const nowMs = Date.now();
    const timerEndsAt = nowMs + (prepDuration * 60 * 1000);
    const nowIso = new Date().toISOString();

    // 1. AUTO-DECREMENT STOCK for each item in the order
    console.log(`[OrderService] Decrementing stock for order ${orderId}...`);
    try {
      const batch = writeBatch(db);
      for (const item of order.items) {
        if (item.id) {
          const productRef = doc(db, 'products', item.id);
          batch.update(productRef, {
            stock: increment(-item.quantity),
            updatedAt: Timestamp.now()
          });
        }
      }
      await batch.commit();
      console.log(`[OrderService] Successfully decremented stock in Firestore!`);
    } catch (e) {
      console.warn(`[OrderService] Batch decrement error, applying local updates:`, e);
    }

    // Also decrement in local products cache immediately
    try {
      const cached = safeStorage.getItem('orient_products_cache');
      if (cached) {
        const products = JSON.parse(cached);
        for (const item of order.items) {
          const p = products.find((prod: any) => prod.id === item.id);
          if (p) {
            p.stock = Math.max(0, (p.stock || 0) - item.quantity);
          }
        }
        safeStorage.setItem('orient_products_cache', JSON.stringify(products));
      }
    } catch (e) {}

    // 2. Update Order with 'preparing', timerEndsAt, chefConfirmedAt
    const updatedOrder: CustomerOrder = {
      ...order,
      status: 'preparing',
      prepDurationMinutes: prepDuration,
      timerEndsAt,
      chefConfirmedAt: nowIso,
      tenMinAlertSent: false,
      fiveMinAlertSent: false,
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'preparing',
        prepDurationMinutes: prepDuration,
        timerEndsAt,
        chefConfirmedAt: nowIso,
        tenMinAlertSent: false,
        fiveMinAlertSent: false,
        updatedAt: Timestamp.now()
      });
    } catch (e) {
      console.warn("Could not update order in Firestore, updating local cache:", e);
    }

    // Update local orders cache
    ordersCache = ordersCache.map(o => o.id === orderId ? updatedOrder : o);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
      safeStorage.setItem('orient_last_user_order', JSON.stringify(updatedOrder));
    } catch (e) {}

    // Dispatch Notifications
    const userNotif: AppNotification = {
      id: `NOTIF-U-${Date.now()}`,
      orderId,
      type: 'order_confirmed',
      recipient: 'user',
      title: '👨‍🍳 Chef Started Your Order!',
      message: `The kitchen has confirmed Order #${orderId} and started preparation. Estimated time: ${prepDuration} minutes.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'order_confirmed',
      recipient: 'cms',
      title: 'Preparation Started',
      message: `Chef confirmed Order #${orderId}. ${prepDuration}m timer started. Stock decremented automatically.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    playAlertSound('confirmed');
    return updatedOrder;
  },

  /**
   * 3. Trigger 10-Minute Warning Alert
   * - Dispatches notification to User: "10 minutes before the end of waiting time, please get ready!"
   */
  sendTenMinuteWarning: async (orderId: string): Promise<void> => {
    const order = await orderService.getOrderById(orderId);
    if (!order || order.tenMinAlertSent) return;

    const nowIso = new Date().toISOString();
    const updatedOrder: CustomerOrder = {
      ...order,
      status: 'ten_min_warning',
      tenMinAlertSent: true,
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'ten_min_warning',
        tenMinAlertSent: true,
        updatedAt: Timestamp.now()
      });
    } catch (e) {}

    ordersCache = ordersCache.map(o => o.id === orderId ? updatedOrder : o);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
      safeStorage.setItem('orient_last_user_order', JSON.stringify(updatedOrder));
    } catch (e) {}

    const userNotif: AppNotification = {
      id: `NOTIF-U-${Date.now()}`,
      orderId,
      type: 'ten_min_warning',
      recipient: 'user',
      title: '⏱️ 10 Minutes Remaining — Get Ready!',
      message: `Your Order #${orderId} is almost done! There are only 10 minutes left before it's ready. Please get ready.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'ten_min_warning',
      recipient: 'cms',
      title: '10-Min Customer Alert Dispatched',
      message: `10-minute warning sent to customer for Order #${orderId}.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    playAlertSound('warning');
  },

  /**
   * 3b. Trigger 5-Minute Warning Alert (auto-fired by timer manager)
   */
  sendFiveMinuteWarning: async (orderId: string): Promise<void> => {
    const order = await orderService.getOrderById(orderId);
    if (!order || order.fiveMinAlertSent) return;

    const nowIso = new Date().toISOString();
    const updatedOrder: CustomerOrder = {
      ...order,
      fiveMinAlertSent: true,
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        fiveMinAlertSent: true,
        updatedAt: Timestamp.now()
      });
    } catch (e) {}

    ordersCache = ordersCache.map(o => o.id === orderId ? updatedOrder : o);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
    } catch (e) {}

    const userNotif: AppNotification = {
      id: `NOTIF-U-${Date.now()}`,
      orderId,
      type: 'five_min_warning',
      recipient: 'user',
      title: '⚡ 5 Minutes — Come Collect Your Order!',
      message: `Your Order #${orderId} is almost ready! Only 5 minutes remaining. Please make your way to collect it — it's best served hot!`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'five_min_warning',
      recipient: 'cms',
      title: '5-Min Customer Alert Dispatched',
      message: `5-minute warning sent to customer for Order #${orderId}.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    playAlertSound('warning');
  },

  /**
   * 4. Mark Order as Ready / Completed
   */
  markOrderReady: async (orderId: string): Promise<CustomerOrder> => {
    const order = await orderService.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const nowIso = new Date().toISOString();
    const updatedOrder: CustomerOrder = {
      ...order,
      status: 'ready',
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'ready',
        updatedAt: Timestamp.now()
      });
    } catch (e) {}

    ordersCache = ordersCache.map(o => o.id === orderId ? updatedOrder : o);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
      safeStorage.setItem('orient_last_user_order', JSON.stringify(updatedOrder));
    } catch (e) {}

    const userNotif: AppNotification = {
      id: `NOTIF-U-${Date.now()}`,
      orderId,
      type: 'order_ready',
      recipient: 'user',
      title: '🎉 Your Order is Ready!',
      message: `Order #${orderId} is fresh, hot, and ready for you! Enjoy your meal.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    playAlertSound('ready');
    return updatedOrder;
  },

  /**
   * Update Order Status (e.g. mark completed or cancelled)
   */
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<CustomerOrder> => {
    const order = await orderService.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const nowIso = new Date().toISOString();
    const updatedOrder: CustomerOrder = {
      ...order,
      status,
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (e) {}

    ordersCache = ordersCache.map(o => o.id === orderId ? updatedOrder : o);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
      safeStorage.setItem('orient_last_user_order', JSON.stringify(updatedOrder));
    } catch (e) {}

    return updatedOrder;
  },

  /**
   * Delete Order permanently
   */
  deleteOrder: async (orderId: string): Promise<void> => {
    try {
      const docRef = doc(db, 'orders', orderId);
      await deleteDoc(docRef);
    } catch (e) {
      console.warn("Could not delete order from Firestore, removing locally:", e);
    }
    ordersCache = ordersCache.filter(o => o.id !== orderId);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
    } catch (e) {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_orders_changed'));
    }
  },

  /**
   * Send Notification
   */
  sendNotification: async (notif: AppNotification): Promise<void> => {
    notificationsCache = [notif, ...notificationsCache];
    try {
      safeStorage.setItem('orient_notifications_cache', JSON.stringify(notificationsCache));
    } catch (e) {}

    try {
      await setDoc(doc(db, 'notifications', notif.id), {
        ...notif,
        createdAt: Timestamp.now()
      });
    } catch (e) {
      console.warn("Firestore notification write error, saved locally:", e);
    }

    // Trigger standard browser window custom event for reactive UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_new_notification', { detail: notif }));
    }
  },

  /**
   * Get Orders
   */
  getOrders: async (): Promise<CustomerOrder[]> => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString()
          } as CustomerOrder;
        });
        ordersCache = list;
        try {
          safeStorage.setItem('orient_orders_cache', JSON.stringify(list));
        } catch (e) {}
        return list;
      }
    } catch (err) {
      console.warn("Fetching orders from Firestore failed, using cached:", err);
    }

    // Fallback to cache
    try {
      const raw = safeStorage.getItem('orient_orders_cache');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return ordersCache;
  },

  getOrderById: async (orderId: string): Promise<CustomerOrder | null> => {
    try {
      const docRef = doc(db, 'orders', orderId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          ...data,
          id: snap.id,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
        } as CustomerOrder;
      }
    } catch (e) {}

    const found = ordersCache.find(o => o.id === orderId);
    if (found) return found;

    try {
      const raw = safeStorage.getItem('orient_orders_cache');
      if (raw) {
        const list: CustomerOrder[] = JSON.parse(raw);
        return list.find(o => o.id === orderId) || null;
      }
    } catch (e) {}
    return null;
  },

  /**
   * Realtime Listener for Orders
   */
  subscribeToOrders: (callback: (orders: CustomerOrder[]) => void) => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt || new Date().toISOString()
          } as CustomerOrder;
        });
        ordersCache = list;
        callback(list);
      }, (err) => {
        console.warn("Firestore snapshot error:", err);
        callback(ordersCache);
      });
      return unsubscribe;
    } catch (e) {
      callback(ordersCache);
      return () => {};
    }
  },

  /**
   * Get Notifications
   */
  getNotifications: async (): Promise<AppNotification[]> => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
          } as AppNotification;
        });
        notificationsCache = list;
        return list;
      }
    } catch (e) {}

    try {
      const raw = safeStorage.getItem('orient_notifications_cache');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return notificationsCache;
  },

  /**
   * Realtime Listener for Notifications
   */
  subscribeToNotifications: (callback: (notifs: AppNotification[]) => void) => {
    try {
      const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(d => {
          const data = d.data();
          return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
          } as AppNotification;
        });
        notificationsCache = list;
        callback(list);
      }, (err) => {
        callback(notificationsCache);
      });
      return unsubscribe;
    } catch (e) {
      callback(notificationsCache);
      return () => {};
    }
  }
};

