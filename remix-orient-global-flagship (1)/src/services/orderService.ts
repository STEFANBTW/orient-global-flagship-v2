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

export type OrderStatus =
  | 'pending'
  | 'awaiting_chef'
  | 'cooking'
  | 'preparing'
  | 'confirmed'
  | 'ten_min_warning'
  | 'five_min_warning'
  | 'ready'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export function getDisplayStatus(status: OrderStatus | string): 'Pending' | 'Cooking' | 'Ready' | 'In Transit' | 'Completed' | 'Cancelled' {
  const s = (status || '').toLowerCase().replace(/-/g, '_').replace(/ /g, '_');
  if (s === 'pending' || s === 'awaiting_chef') return 'Pending';
  if (s === 'cooking' || s === 'preparing' || s === 'confirmed' || s === 'ten_min_warning' || s === 'five_min_warning') return 'Cooking';
  if (s === 'ready') return 'Ready';
  if (s === 'in_transit' || s === 'transit') return 'In Transit';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  return 'Pending';
}

export function isDeliveryOrder(order: CustomerOrder): boolean {
  if (order.deliveryMethod === 'delivery') return true;
  if (order.deliveryMethod === 'pickup') return false;
  if (order.orderType === 'dine-in') return false;
  const addr = (order.shippingAddress || '').toLowerCase();
  const isSpecialPickup = addr.includes('pick-up') || addr.includes('in-store') || addr.includes('dine-in');
  const isTable = (order.tableNumber || '').toLowerCase().includes('table');
  return !isSpecialPickup && !isTable && addr.length > 5;
}

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
  orderType?: 'dine-in' | 'takeaway';
  deliveryMethod?: 'delivery' | 'pickup';
  customerReceivedAt?: string | null;
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
  type: 'order_placed' | 'order_confirmed' | 'ten_min_warning' | 'five_min_warning' | 'order_ready' | 'order_in_transit' | 'order_received' | 'order_cancelled' | 'info';
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
    orderType?: 'dine-in' | 'takeaway';
    deliveryMethod?: 'delivery' | 'pickup';
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

    const derivedOrderType = input.orderType || (input.tableNumber && input.tableNumber.toLowerCase().includes('table') ? 'dine-in' : 'takeaway');
    const derivedDeliveryMethod = input.deliveryMethod || (
      derivedOrderType === 'takeaway' && input.shippingAddress && !input.shippingAddress.toLowerCase().includes('pick-up') && !input.shippingAddress.toLowerCase().includes('in-store')
        ? 'delivery'
        : 'pickup'
    );

    const newOrder: CustomerOrder = {
      id: orderId,
      division: targetDivision,
      customerId: input.customerId?.trim() || activeUser?.id || 'usr_guest',
      customerName: input.customerName?.trim() || activeUser?.name || 'Guest User',
      customerEmail: input.customerEmail?.trim() || activeUser?.email || 'guest@orient.app',
      customerPhone: input.customerPhone?.trim() || activeUser?.phone || '+234 800 000 0000',
      tableNumber: input.tableNumber?.trim() || (derivedOrderType === 'dine-in' ? 'Dine-In' : (derivedDeliveryMethod === 'delivery' ? 'Home Delivery' : 'Takeout / Pickup')),
      shippingAddress: input.shippingAddress?.trim() || activeUser?.deliveryAddress || (derivedDeliveryMethod === 'delivery' ? 'Standard Delivery Address' : 'Pick-up at counter'),
      notes: input.notes?.trim() || '',
      orderType: derivedOrderType,
      deliveryMethod: derivedDeliveryMethod,
      customerReceivedAt: null,
      items: sanitizedItems,
      totalAmount,
      status: input.status || 'pending',
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
      title: 'Order Sent to Kitchen 🍳',
      message: 'Your order has been successfully sent to the kitchen.',
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
      title: '🔔 New Order Incoming (Pending)',
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

    // 2. Update Order with 'cooking', timerEndsAt, chefConfirmedAt
    const updatedOrder: CustomerOrder = {
      ...order,
      status: 'cooking',
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
        status: 'cooking',
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
      title: '👨‍🍳 Order Confirmed by Chef',
      message: `Your order has been confirmed by the chef and will be ready in ${prepDuration} minutes.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'order_confirmed',
      recipient: 'cms',
      title: 'Cooking Started',
      message: `Chef confirmed Order #${orderId} and started cooking (${prepDuration}m).`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    playAlertSound('confirmed');
    return updatedOrder;
  },

  /**
   * 3. Trigger 10-Minute Warning Alert
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
      title: '⏱️ 10 Minutes Remaining',
      message: 'Your meal will be ready in 10 minutes.',
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'ten_min_warning',
      recipient: 'cms',
      title: '10m Warning Sent',
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
      title: '⚡ 5 Minutes Remaining',
      message: 'Your meal will be ready in 5 minutes.',
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'five_min_warning',
      recipient: 'cms',
      title: '5m Warning Sent',
      message: `5-minute warning sent to customer for Order #${orderId}.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    playAlertSound('warning');
  },

  /**
   * 4. Mark Order as Ready
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
      title: '🎉 Meal Ready!',
      message: 'Your meal is ready.',
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'order_ready',
      recipient: 'cms',
      title: 'Order Ready',
      message: `Order #${orderId} marked ready.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

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

    if (status === 'completed') {
      const userNotif: AppNotification = {
        id: `NOTIF-U-${Date.now()}`,
        orderId,
        type: 'info',
        recipient: 'user',
        title: 'Order Completed ✅',
        message: 'Thank you for patronizing us. This order is finished.',
        read: false,
        createdAt: nowIso
      };
      await orderService.sendNotification(userNotif);

      const cmsNotif: AppNotification = {
        id: `NOTIF-C-${Date.now()}`,
        orderId,
        type: 'info',
        recipient: 'cms',
        title: 'Order Completed',
        message: `Order #${orderId} is finished and payment confirmed.`,
        read: false,
        createdAt: nowIso
      };
      await orderService.sendNotification(cmsNotif);
      playAlertSound('ready');
    }

    return updatedOrder;
  },

  /**
   * 4b. Chef: Mark Order In Transit (Delivery Takeaway ONLY)
   */
  markOrderInTransit: async (orderId: string): Promise<CustomerOrder> => {
    const order = await orderService.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const nowIso = new Date().toISOString();
    const updatedOrder: CustomerOrder = {
      ...order,
      status: 'in_transit',
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'in_transit',
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
      type: 'order_in_transit',
      recipient: 'user',
      title: '🚚 Order In Transit',
      message: 'Your order is on the way! Please tap "Received" when your food arrives.',
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'order_in_transit',
      recipient: 'cms',
      title: '🚚 Order In Transit',
      message: `Order #${orderId} is dispatched and in transit to customer.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_orders_changed'));
    }
    playAlertSound('warning');
    return updatedOrder;
  },

  /**
   * 4c. Customer: Confirm Received (Delivery Takeaway)
   * Unlocks chef's ability to Finish and Confirm Payment
   */
  customerConfirmReceived: async (orderId: string): Promise<CustomerOrder> => {
    const order = await orderService.getOrderById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const nowIso = new Date().toISOString();
    const updatedOrder: CustomerOrder = {
      ...order,
      customerReceivedAt: nowIso,
      updatedAt: nowIso
    };

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        customerReceivedAt: nowIso,
        updatedAt: Timestamp.now()
      });
    } catch (e) {}

    ordersCache = ordersCache.map(o => o.id === orderId ? updatedOrder : o);
    try {
      safeStorage.setItem('orient_orders_cache', JSON.stringify(ordersCache));
      safeStorage.setItem('orient_last_user_order', JSON.stringify(updatedOrder));
    } catch (e) {}

    const cmsNotif: AppNotification = {
      id: `NOTIF-C-${Date.now()}`,
      orderId,
      type: 'order_received',
      recipient: 'cms',
      title: '📦 Order Received by Customer',
      message: `Customer confirmed receipt of Order #${orderId}. You can now finish and confirm payment.`,
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(cmsNotif);

    const userNotif: AppNotification = {
      id: `NOTIF-U-${Date.now()}`,
      orderId,
      type: 'order_received',
      recipient: 'user',
      title: 'Receipt Confirmed 👍',
      message: 'You marked Order #' + orderId + ' as received. Thank you!',
      read: false,
      createdAt: nowIso
    };
    await orderService.sendNotification(userNotif);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_orders_changed'));
    }
    playAlertSound('confirmed');
    return updatedOrder;
  },

  /**
   * Chef: Finish and Payment Confirmed
   */
  finishAndConfirmPayment: async (orderId: string): Promise<CustomerOrder> => {
    const order = await orderService.getOrderById(orderId);
    if (order && isDeliveryOrder(order) && !order.customerReceivedAt) {
      throw new Error(`Cannot finish order #${orderId}: Waiting for customer to click 'Received'.`);
    }
    return orderService.updateOrderStatus(orderId, 'completed');
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

