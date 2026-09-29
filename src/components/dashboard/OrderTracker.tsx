import React, { useState } from 'react';
import { CustomerOrder, getDisplayStatus, isDeliveryOrder, orderService } from '../../services/orderService';

interface OrderTrackerProps {
  orders: CustomerOrder[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const selectedDisplayStatus = selectedOrder ? getDisplayStatus(selectedOrder.status) : 'Pending';
  const isDelivery = selectedOrder ? isDeliveryOrder(selectedOrder) : false;

  const handleSupport = () => {
    alert('Connecting you to support...');
  };

  const handleConfirmReceived = async (orderId: string) => {
    setIsConfirming(true);
    try {
      await orderService.customerConfirmReceived(orderId);
      alert('Order marked as received! The chef has been notified.');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('orient_orders_changed'));
      }
    } catch (e: any) {
      alert(e.message || 'Failed to confirm receipt.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-border shadow-sm">
        <span className="material-icons text-5xl text-muted-foreground mb-4 opacity-50">
          local_shipping
        </span>
        <h2 className="text-xl font-bold text-foreground mb-2">Track Your Order</h2>
        <p className="text-muted-foreground text-sm">When you place an order, track it here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-4">
        <div className="sticky top-24">
          <h2 className="text-2xl font-bold text-foreground mb-3">Track Your Order</h2>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {orders.map((order) => {
              const statusName = getDisplayStatus(order.status);
              const orderIsDelivery = isDeliveryOrder(order);

              let progressPercent = '25%';
              if (orderIsDelivery) {
                if (statusName === 'Pending') progressPercent = '20%';
                else if (statusName === 'Cooking') progressPercent = '40%';
                else if (statusName === 'Ready') progressPercent = '60%';
                else if (statusName === 'In Transit') progressPercent = '80%';
                else if (statusName === 'Completed') progressPercent = '100%';
              } else {
                if (statusName === 'Pending') progressPercent = '25%';
                else if (statusName === 'Cooking') progressPercent = '50%';
                else if (statusName === 'Ready') progressPercent = '75%';
                else if (statusName === 'Completed') progressPercent = '100%';
              }

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`bg-card p-5 rounded-xl border cursor-pointer transition-colors ${
                    selectedOrderId === order.id
                      ? 'border-primary shadow-md'
                      : 'border-border shadow-sm hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-border ">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Order ID</span>
                      {orderIsDelivery && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          Delivery
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-base">{order.id}</span>
                  </div>
                  <div className="mb-5">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        statusName === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        statusName === 'Cooking' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        statusName === 'Ready' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        statusName === 'In Transit' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {statusName}
                      </span>
                    </div>
                    <div className="w-full bg-background h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        style={{ width: progressPercent }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          statusName === 'Pending' ? 'bg-amber-500' :
                          statusName === 'Cooking' ? 'bg-orange-500' :
                          statusName === 'Ready' ? 'bg-purple-500' :
                          statusName === 'In Transit' ? 'bg-blue-500' :
                          'bg-emerald-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSupport();
                    }}
                    className="w-full bg-background hover:bg-background dark:hover:bg-foreground text-background text-foreground font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center text-sm"
                  >
                    <span className="material-icons text-xs mr-2">support_agent</span> Contact Support
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
        {selectedOrder && (
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-full">
            <div className="mb-4 pb-3 border-b border-border/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground block">Currently Tracking</span>
                <h3 className="text-lg font-bold text-foreground">Order #{selectedOrder.id}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  isDelivery ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-muted text-muted-foreground'
                }`}>
                  {isDelivery ? '🚚 Home Delivery' : selectedOrder.orderType === 'dine-in' ? '🍽️ Dine-In' : '🛍️ Counter Pickup'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  selectedDisplayStatus === 'Pending' ? 'bg-amber-500/10 text-amber-600' :
                  selectedDisplayStatus === 'Cooking' ? 'bg-orange-500/10 text-orange-600' :
                  selectedDisplayStatus === 'Ready' ? 'bg-purple-500/10 text-purple-600' :
                  selectedDisplayStatus === 'In Transit' ? 'bg-blue-500/10 text-blue-600' :
                  'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {selectedDisplayStatus}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-background "></div>

              {/* 1. Order Placed */}
              <TimelineItem
                icon="receipt_long"
                title="Order Placed (Pending)"
                time={new Date(selectedOrder.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                text="Your order has been successfully sent to the kitchen."
                completed={true}
                active={selectedDisplayStatus === 'Pending'}
              />

              {/* 2. Chef Confirmed / Cooking */}
              <TimelineItem
                icon="skillet"
                title="Chef Confirmed (Cooking)"
                text={
                  selectedOrder.chefConfirmedAt
                    ? `Your order has been confirmed by the chef and is cooking (${selectedOrder.prepDurationMinutes || 15}m prep time).`
                    : 'Waiting for chef to confirm and start cooking.'
                }
                completed={
                  selectedDisplayStatus === 'Cooking' ||
                  selectedDisplayStatus === 'Ready' ||
                  selectedDisplayStatus === 'In Transit' ||
                  selectedDisplayStatus === 'Completed'
                }
                active={selectedDisplayStatus === 'Cooking'}
              />

              {/* 3. Order Ready */}
              <TimelineItem
                icon="check_circle"
                title={isDelivery ? "Meal Ready in Kitchen" : "Order is Ready"}
                text={
                  isDelivery
                    ? "Your meal has been prepared and is packaged for dispatch."
                    : selectedOrder.orderType === 'dine-in'
                    ? "Your food is ready and served at your table!"
                    : "Your order is ready for counter pickup!"
                }
                completed={
                  selectedDisplayStatus === 'Ready' ||
                  selectedDisplayStatus === 'In Transit' ||
                  selectedDisplayStatus === 'Completed'
                }
                active={selectedDisplayStatus === 'Ready'}
              />

              {/* 4. In Transit (Delivery Takeaway ONLY) */}
              {isDelivery && (
                <TimelineItem
                  icon="two_wheeler"
                  title="In Transit (Out for Delivery)"
                  text={
                    selectedDisplayStatus === 'In Transit'
                      ? "Our courier is on the way to your delivery address!"
                      : selectedDisplayStatus === 'Completed'
                      ? "Delivered successfully."
                      : "Will be dispatched once the kitchen marks the meal ready."
                  }
                  completed={
                    selectedDisplayStatus === 'Completed' || Boolean(selectedOrder.customerReceivedAt)
                  }
                  active={selectedDisplayStatus === 'In Transit'}
                >
                  {/* Delivery confirmation button for customer */}
                  {selectedDisplayStatus === 'In Transit' && (
                    <div className="mt-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                      <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                        {selectedOrder.customerReceivedAt
                          ? 'You confirmed receipt of this delivery. Thank you!'
                          : 'Has your delivery arrived? Please tap "Received" below so the kitchen can finalize the order:'}
                      </p>

                      {!selectedOrder.customerReceivedAt ? (
                        <button
                          disabled={isConfirming}
                          onClick={() => handleConfirmReceived(selectedOrder.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <span className="material-icons text-sm">done_all</span>
                          {isConfirming ? 'Confirming...' : 'Received'}
                        </button>
                      ) : (
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 py-1.5 px-3 rounded-lg w-fit">
                          <span className="material-icons text-sm">verified</span>
                          Received confirmed at {new Date(selectedOrder.customerReceivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </div>
                  )}
                </TimelineItem>
              )}

              {/* 5. Completed / Finished */}
              <TimelineItem
                icon="home"
                title="Finish and Payment Confirmed (Completed)"
                text={
                  selectedDisplayStatus === 'Completed'
                    ? 'Thank you for patronizing us. This order is finished.'
                    : isDelivery
                    ? 'Awaiting customer "Received" confirmation and chef payment finalization.'
                    : 'Awaiting final order completion and payment confirmation.'
                }
                completed={selectedDisplayStatus === 'Completed'}
                active={selectedDisplayStatus === 'Completed'}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TimelineItem = ({
  icon,
  title,
  time,
  text,
  subText,
  active,
  completed,
  children,
}: any) => (
  <div
    className={`relative flex items-start mb-10 ${
      !active && !completed ? 'opacity-50' : ''
    }`}
  >
    <div
      className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-4 ${
        completed
          ? 'bg-primary border-transparent'
          : active
          ? 'bg-card border-primary shadow-md'
          : 'bg-background border-transparent'
      }`}
    >
      <span
        className={`material-icons text-base ${
          completed
            ? 'text-background'
            : active
            ? 'text-primary'
            : 'text-muted-foreground'
        } ${active && !completed ? 'animate-pulse' : ''}`}
      >
        {icon}
      </span>
    </div>
    <div className="ml-5 pt-0.5 flex-1">
      <h4
        className={`text-base font-bold ${active ? 'text-primary' : 'text-foreground '}`}
      >
        {title}
      </h4>
      {text && <p className="text-muted-foreground text-xs mt-0.5">{text}</p>}
      {subText && (
        <span className="text-[10px] font-semibold text-primary mt-1.5 block">
          {subText}
        </span>
      )}
      {time && (
        <span className="text-[10px] text-muted-foreground mt-1.5 block">
          {time}
        </span>
      )}
      {children}
    </div>
  </div>
);
