import { useEffect } from 'react';
import { orderService, CustomerOrder } from '../services/orderService';
import { useNotifications } from '../context/NotificationContext';

export function useOrderTimerManager() {
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Local set to prevent duplicate alert fires within the same session
    // before the database has time to sync
    const firedAlerts = new Set<string>();

    // 1. Subscribe to custom notification events from orderService
    const handleCustomNotif = (e: any) => {
      const notif = e.detail;
      if (notif) {
        addNotification({
          title: notif.title,
          message: notif.message,
          type: notif.type === 'ten_min_warning' || notif.type === 'five_min_warning' ? 'warning' :
                notif.type === 'order_ready' ? 'success' :
                notif.type === 'order_confirmed' ? 'success' : 'info'
        });
      }
    };

    window.addEventListener('orient_new_notification', handleCustomNotif);

    // 2. Periodic timer check — fires every 3 seconds to monitor active kitchen orders
    const interval = setInterval(async () => {
      try {
        const orders = await orderService.getOrders();
        const now = Date.now();

        for (const order of orders) {
          if (order.status === 'preparing' || order.status === 'ten_min_warning') {
            if (!order.timerEndsAt) continue;
            const remainingMs = order.timerEndsAt - now;

            // AUTO: 10-minute warning
            const tenMinKey = `${order.id}-10m`;
            if (remainingMs <= 10 * 60 * 1000 && remainingMs > 5 * 60 * 1000 && !order.tenMinAlertSent && !firedAlerts.has(tenMinKey)) {
              firedAlerts.add(tenMinKey);
              console.log(`[TimerManager] AUTO: 10 minutes remaining for order ${order.id}`);
              await orderService.sendTenMinuteWarning(order.id);
            }

            // AUTO: 5-minute warning
            const fiveMinKey = `${order.id}-5m`;
            if (remainingMs <= 5 * 60 * 1000 && remainingMs > 0 && !order.fiveMinAlertSent && !firedAlerts.has(fiveMinKey)) {
              firedAlerts.add(fiveMinKey);
              console.log(`[TimerManager] AUTO: 5 minutes remaining for order ${order.id}`);
              await orderService.sendFiveMinuteWarning(order.id);
            }

            // AUTO: Timer expired — mark order ready
            const readyKey = `${order.id}-ready`;
            if (remainingMs <= 0 && !firedAlerts.has(readyKey)) {
              firedAlerts.add(readyKey);
              console.log(`[TimerManager] AUTO: Timer ended for order ${order.id}. Marking as ready!`);
              await orderService.markOrderReady(order.id);
            }
          }
        }
      } catch (err) {
        // Suppress timer check errors silently
      }
    }, 3000);

    return () => {
      window.removeEventListener('orient_new_notification', handleCustomNotif);
      clearInterval(interval);
    };
  }, [addNotification]);
}
