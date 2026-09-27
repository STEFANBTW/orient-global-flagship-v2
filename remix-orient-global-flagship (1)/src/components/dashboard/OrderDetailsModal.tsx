import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Utensils,
  ShoppingBag,
  Truck,
  Phone,
  Mail,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Timer,
  ChevronRight,
  Copy,
  Check,
  Armchair,
  Package,
  CreditCard,
  ChefHat
} from 'lucide-react';
import { CustomerOrder, getDisplayStatus, isDeliveryOrder } from '@/services/orderService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderDetailsModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose
}: OrderDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const displayStatus = getDisplayStatus(order.status);
  const isDelivery = isDeliveryOrder(order);
  const isTakeaway = order.destination === 'takeaway';
  const isDineIn = order.destination === 'dine-in';

  const isPending = displayStatus === 'Pending';
  const isCooking = displayStatus === 'Cooking';
  const isReady = displayStatus === 'Ready';
  const isInTransit = displayStatus === 'In Transit';
  const isCompleted = displayStatus === 'Completed';

  const handleCopyOrderId = () => {
    const idToCopy = order.orderId || order.id;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(idToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Remaining cooking time calculation if applicable
  let remainingText = '';
  if (order.timerEndsAt) {
    const msLeft = Math.max(0, order.timerEndsAt - Date.now());
    const mins = Math.floor(msLeft / 60000);
    const secs = Math.floor((msLeft % 60000) / 1000);
    remainingText = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs sm:p-4 overflow-hidden animate-in fade-in duration-150"
      onClick={(e) => {
        // Close when clicking the desktop backdrop outside the modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 
        Responsive Container:
        - Mobile: Full screen box (fixed inset-0 w-full h-[100dvh] rounded-none)
        - Desktop: Centered modal (sm:relative sm:max-w-2xl sm:max-h-[88vh] sm:rounded-2xl)
      */}
      <div 
        className="w-full h-[100dvh] sm:h-auto sm:max-h-[88vh] sm:max-w-2xl bg-card text-card-foreground border-none sm:border border-border/60 shadow-2xl rounded-none sm:rounded-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <div className="px-5 py-4 border-b border-border/40 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
              {isDineIn ? <Utensils className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono tracking-tight text-foreground truncate">
                  #{order.orderId || order.id}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                  title="Copy Order ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Customer: <span className="font-semibold text-foreground">{order.customerName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge 
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border-none shadow-xs ${
                isCompleted ? 'bg-emerald-600 text-white' :
                isInTransit ? 'bg-blue-600 text-white' :
                isReady ? 'bg-purple-600 text-white' :
                isCooking ? 'bg-orange-600 text-white' :
                isPending ? 'bg-amber-500 text-white' :
                'bg-slate-600 text-white'
              }`}
            >
              {displayStatus}
            </Badge>

            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= SCROLLABLE CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* CARD 1: ORDER ROUTING & DESTINATION */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-3">
            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Destination & Delivery Routing
              </span>
              <Badge variant="outline" className="text-xs font-semibold capitalize bg-background border-border/40">
                {order.destination === 'dine-in' ? '🍽️ Dine-In' : '🛍️ Takeaway'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* If Dine-In */}
              {isDineIn && (
                <>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                      <Armchair className="w-3.5 h-3.5 text-muted-foreground" /> Seat / Table Number
                    </span>
                    <span className="font-bold text-foreground text-sm bg-background px-2.5 py-1 rounded-md inline-block border border-border/30">
                      {order.seatNumber || order.tableNumber || 'Table / Seat Unassigned'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Reservation Schedule
                    </span>
                    <span className="font-medium text-foreground">
                      {order.reservedDate ? (
                        <span className="font-semibold text-primary">
                          {order.reservedDate} {order.reservedTime ? `@ ${order.reservedTime}` : ''}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Immediate (No advance reservation)</span>
                      )}
                    </span>
                  </div>
                </>
              )}

              {/* If Takeaway */}
              {isTakeaway && (
                <>
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-muted-foreground" /> Delivery Method
                    </span>
                    <Badge className={`text-xs font-bold ${order.deliveryMethod === 'delivery' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {order.deliveryMethod === 'delivery' ? '🚚 Home / Office Delivery' : '🏪 Counter Pickup'}
                    </Badge>
                  </div>

                  {/* Delivery Address if delivery */}
                  {order.deliveryMethod === 'delivery' ? (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" /> Delivery Address
                      </span>
                      <p className="font-semibold text-foreground bg-background p-2.5 rounded-lg border border-border/40 text-xs">
                        {order.deliveryAddress || order.shippingAddress || 'No address specified'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Pickup Location
                      </span>
                      <p className="font-semibold text-foreground text-xs">
                        Orient Flagship Store Pickup Counter
                      </p>
                    </div>
                  )}

                  {/* Scheduled date/time if provided */}
                  {(order.reservedDate || order.reservedTime) && (
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" /> Scheduled Pickup/Delivery Time
                      </span>
                      <span className="font-semibold text-primary">
                        {order.reservedDate || 'Today'} {order.reservedTime ? `@ ${order.reservedTime}` : ''}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* CARD 2: PLACEMENT & ORDER TIMESTAMPS */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
              <Clock className="w-3.5 h-3.5 text-primary" /> Timing & Status Lifecycle
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Placed Date</span>
                <span className="font-semibold text-foreground font-mono">
                  {order.placedDate || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-CA') : 'Today')}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Placed Time</span>
                <span className="font-semibold text-foreground font-mono">
                  {order.placedTime || (order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now')}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Prep Duration</span>
                <span className="font-semibold text-foreground">
                  {order.prepDurationMinutes || 15} minutes
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Current Status</span>
                <span className="font-bold text-foreground">
                  {displayStatus}
                </span>
              </div>
            </div>

            {/* Live Progress Info Box */}
            {isCooking && (
              <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs flex items-center justify-between text-orange-800 dark:text-orange-200">
                <div className="flex items-center gap-1.5 font-medium">
                  <Timer className="w-4 h-4 text-orange-500 animate-spin" />
                  <span>Kitchen Cooking Timer:</span>
                </div>
                <span className="font-mono font-bold text-sm">
                  {remainingText || `${order.prepDurationMinutes || 15}m 00s`}
                </span>
              </div>
            )}

            {isInTransit && (
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between text-blue-800 dark:text-blue-200">
                <div className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-blue-500 animate-pulse" />
                  <span>Delivery Status:</span>
                </div>
                <span className="font-bold">
                  {order.customerReceivedAt ? '✅ Customer Confirmed Receipt' : '🚚 Courier In Transit'}
                </span>
              </div>
            )}
          </div>

          {/* CARD 3: CUSTOMER & CONTACT INFORMATION */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border-b border-border/20 pb-2">
              <User className="w-3.5 h-3.5 text-primary" /> Customer Profile
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Customer Name</span>
                <span className="font-bold text-foreground text-sm">{order.customerName}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">User ID</span>
                <span className="font-mono text-muted-foreground text-xs">{order.userId || order.customerId}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Phone Number</span>
                {order.customerPhone ? (
                  <a 
                    href={`tel:${order.customerPhone}`}
                    className="font-mono font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> {order.customerPhone}
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </div>

              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] block">Email Address</span>
                {order.customerEmail ? (
                  <a 
                    href={`mailto:${order.customerEmail}`}
                    className="font-medium text-primary hover:underline flex items-center gap-1 truncate"
                  >
                    <Mail className="w-3 h-3" /> {order.customerEmail}
                  </a>
                ) : (
                  <span className="text-muted-foreground italic">None</span>
                )}
              </div>

              {order.notes && (
                <div className="sm:col-span-2 pt-1 border-t border-border/20">
                  <span className="text-muted-foreground text-[11px] block flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-amber-500" /> Special Instructions & Kitchen Notes
                  </span>
                  <p className="mt-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-100 font-medium text-xs">
                    "{order.notes}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CARD 4: ORDER ITEMS & FINANCIALS */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-3">
            <div className="flex items-center justify-between border-b border-border/20 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-primary" /> Items Ordered ({order.items.length})
              </span>
              <span className="text-xs font-mono font-bold text-foreground">
                Total: ₦{order.totalAmount}
              </span>
            </div>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-lg bg-background border border-border/40 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-md object-cover border border-border/20 shrink-0" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.division ? <span className="capitalize">{item.division}</span> : 'Orient'} • {item.category || 'Item'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-muted-foreground text-[11px]">
                      {item.quantity} × ₦{item.price || 10}
                    </span>
                    <p className="font-mono font-bold text-foreground text-xs">
                      ₦{(item.price || 10) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="pt-2 border-t border-border/20 space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Items Subtotal</span>
                <span className="font-mono">₦{order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Service Fee & Tax</span>
                <span className="font-mono">₦0.00 (Included)</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-foreground pt-1 border-t border-border/20">
                <span>Grand Total</span>
                <span className="font-mono text-primary font-black">₦{order.totalAmount}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= FOOTER ================= */}
        {/*
          Requirements:
          - Desktop: Clean footer with Close button
          - Mobile: Full screen box with a prominent closebutton at the bottom
        */}
        <div className="p-3 sm:p-4 border-t border-border/40 bg-card/95 backdrop-blur-md flex items-center justify-end shrink-0">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto px-6 h-11 sm:h-9 text-xs sm:text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
