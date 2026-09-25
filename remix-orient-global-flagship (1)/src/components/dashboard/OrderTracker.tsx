import React, { useState } from 'react';
import { CustomerOrder, getDisplayStatus } from '../../services/orderService';

interface OrderTrackerProps {
  orders: CustomerOrder[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    orders.length > 0 ? orders[0].id : null
  );

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];
  const selectedDisplayStatus = selectedOrder ? getDisplayStatus(selectedOrder.status) : 'Pending';

  const handleSupport = () => {
    alert('Connecting you to support...');
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
                    <span className="text-xs text-muted-foreground ">Order ID</span>
                    <span className="font-mono font-bold text-base">{order.id}</span>
                  </div>
                  <div className="mb-5">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                        statusName === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        statusName === 'Cooking' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        statusName === 'Ready' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                      }`}>
                        {statusName}
                      </span>
                    </div>
                    <div className="w-full bg-background h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          statusName === 'Pending'
                            ? 'w-1/4 bg-amber-500'
                            : statusName === 'Cooking'
                            ? 'w-2/4 bg-orange-500'
                            : statusName === 'Ready'
                            ? 'w-3/4 bg-emerald-500'
                            : 'w-full bg-primary'
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
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-background "></div>

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
                  selectedDisplayStatus === 'Completed'
                }
                active={selectedDisplayStatus === 'Cooking'}
              />
              <TimelineItem
                icon="check_circle"
                title="Order is Ready"
                text="Your meal is ready."
                completed={
                  selectedDisplayStatus === 'Ready' || selectedDisplayStatus === 'Completed'
                }
                active={selectedDisplayStatus === 'Ready'}
              />
              <TimelineItem
                icon="two_wheeler"
                title="In Transit / Counter Pickup"
                text={selectedOrder.shippingAddress && selectedOrder.shippingAddress !== 'Pick-up / Dine-in' ? 'Order dispatched for delivery.' : 'Ready for table or counter pickup.'}
                completed={selectedDisplayStatus === 'Completed'}
                active={false}
              />
              <TimelineItem
                icon="home"
                title="Finish and Payment Confirmed (Completed)"
                text={
                  selectedDisplayStatus === 'Completed'
                    ? 'Thank you for patronizing us. This order is finished.'
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
    <div className="ml-5 pt-0.5">
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
    </div>
  </div>
);
