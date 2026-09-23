import React, { useState, useEffect } from 'react';
import { 
  AppUser, 
  getActiveConsumerUser, 
  setActiveConsumerUser,
  MOCK_NIGERIAN_USERS 
} from '@/services/userService';
import { orderService, CustomerOrder } from '@/services/orderService';
import { 
  User, 
  ChevronDown, 
  ShoppingBag, 
  Timer, 
  CheckCircle2, 
  Bell, 
  Phone, 
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function ConsumerUserSwitcher() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(getActiveConsumerUser());
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const loadCustomerOrders = async () => {
    if (!currentUser) {
      setCustomerOrders([]);
      return;
    }
    try {
      const allOrders = await orderService.getOrders();
      const userOrders = allOrders.filter(
        o => o.customerId === currentUser.id || 
             o.customerPhone === currentUser.phone || 
             o.customerName === currentUser.name
      );
      setCustomerOrders(userOrders);
    } catch (e) {}
  };

  useEffect(() => {
    loadCustomerOrders();
    const handleUserChanged = (e: any) => {
      setCurrentUser(e.detail || null);
    };
    window.addEventListener('orient_consumer_user_changed', handleUserChanged);
    const interval = setInterval(loadCustomerOrders, 3000);
    return () => {
      window.removeEventListener('orient_consumer_user_changed', handleUserChanged);
      clearInterval(interval);
    };
  }, [currentUser?.id]);

  const handleSelectUser = (user: AppUser | null) => {
    setCurrentUser(user);
    setActiveConsumerUser(user);
    loadCustomerOrders();
  };

  const activeOrders = customerOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              id="btn-consumer-user-switcher"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/40 bg-muted/40 hover:bg-muted text-foreground transition-colors text-xs font-medium cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-[10px]">
                {currentUser ? currentUser.avatar : <User className="w-3 h-3 text-orange-500" />}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-semibold block leading-none">
                  {currentUser ? currentUser.name : 'Select Profile'}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {currentUser ? currentUser.phone : '5 Profiles Available'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72 bg-card border-border/60">
            <DropdownMenuLabel className="text-xs font-semibold text-foreground">
              Select Active Account
            </DropdownMenuLabel>
            <p className="px-2 pb-2 text-[11px] text-muted-foreground">
              Choose one of the 5 user profiles to activate across all divisions.
            </p>
            <DropdownMenuSeparator />

            {MOCK_NIGERIAN_USERS.map((user) => {
              const isSelected = currentUser?.id === user.id;
              return (
                <DropdownMenuItem
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`flex items-center gap-3 p-2.5 cursor-pointer rounded-lg ${
                    isSelected ? 'bg-muted text-foreground font-semibold' : ''
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    isSelected ? 'bg-foreground text-background' : 'bg-muted text-foreground'
                  }`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs truncate block font-medium">{user.name}</span>
                    <span className="text-[10px] text-muted-foreground block">{user.phone}</span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {currentUser && (
          <Button
            id="btn-open-customer-tracker"
            size="sm"
            variant="outline"
            onClick={() => setIsTrackerOpen(true)}
            className="relative h-8 px-2.5 text-xs font-medium border-border/40 text-foreground hover:bg-muted gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="hidden md:inline">My Orders</span>
            {activeOrders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                {activeOrders.length}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Consumer Live Order Tracker Dialog */}
      <Dialog open={isTrackerOpen} onOpenChange={setIsTrackerOpen}>
        <DialogContent className="sm:max-w-lg border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <ShoppingBag className="w-5 h-5 text-foreground" />
              Customer Orders: {currentUser?.name || 'Guest'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Live consumer perspective. Watch kitchen status, timer countdowns, and alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
            <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Phone:</span>
                <span className="font-mono text-foreground">{currentUser?.phone}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Address:</span>
                <span>{currentUser?.deliveryAddress}</span>
              </div>
            </div>

            {customerOrders.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed p-4">
                <ShoppingBag className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">No orders placed yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Place an order from any division menu at ₦10 to test the consumer tracking view!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerOrders.map(order => {
                  const isAwaiting = order.status === 'awaiting_chef';
                  const isPreparing = order.status === 'preparing' || order.status === 'ten_min_warning';
                  const isReady = order.status === 'ready';
                  const isWarning = order.status === 'ten_min_warning';

                  let remainingText = '';
                  if (order.timerEndsAt) {
                    const ms = Math.max(0, order.timerEndsAt - Date.now());
                    const m = Math.floor(ms / 60000);
                    const s = Math.floor((ms % 60000) / 1000);
                    remainingText = `${m}m ${s < 10 ? '0' : ''}${s}s remaining`;
                  }

                  return (
                    <div 
                      key={order.id}
                      className={`p-4 rounded-xl border space-y-3 transition-all ${
                        isReady ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20' :
                        isWarning ? 'border-red-500 bg-red-50/30 dark:bg-red-950/20 animate-pulse' :
                        isPreparing ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/20' :
                        'border-border bg-card'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-bold text-xs">Order #{order.id}</span>
                          <span className="text-[10px] text-muted-foreground block">
                            {new Date(order.createdAt).toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Status Badge: Green for positive/ready, Red for warning/attention, Orange for base */}
                        <Badge 
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isReady ? 'bg-emerald-600 text-white' :
                            isWarning ? 'bg-red-600 text-white' :
                            isPreparing ? 'bg-orange-500 text-white' :
                            'bg-orange-400 text-white'
                          }`}
                        >
                          {isReady ? '🎉 Ready for Pickup!' :
                           isWarning ? '⚠️ 10-Min Warning Alert!' :
                           isPreparing ? '👨‍🍳 Preparing in Kitchen' :
                           '⏳ Waiting for Chef Confirmation'}
                        </Badge>
                      </div>

                      {/* 10-Minute Warning Banner (Red accent for call to attention) */}
                      {isWarning && (
                        <div className="bg-red-600 text-white p-2.5 rounded-lg text-xs flex items-center gap-2 shadow-xs">
                          <Bell className="w-4 h-4 shrink-0 animate-bounce" />
                          <div>
                            <span className="font-bold block">10-Minute Warning: Your Order is Almost Ready!</span>
                            <span className="text-[11px] opacity-90">Please head to the pickup counter shortly.</span>
                          </div>
                        </div>
                      )}

                      {/* Timer Display */}
                      {isPreparing && (
                        <div className="bg-orange-500/10 border border-orange-500/30 p-2.5 rounded-lg flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 font-semibold text-orange-700 dark:text-orange-300">
                            <Timer className="w-3.5 h-3.5 animate-spin text-orange-500" /> Kitchen Preparation Timer:
                          </span>
                          <span className="font-mono font-bold text-orange-900 dark:text-orange-100 text-sm">
                            {remainingText || `${order.prepDurationMinutes}m`}
                          </span>
                        </div>
                      )}

                      {/* Ready Message (Green accent for positive outcome) */}
                      {isReady && (
                        <div className="bg-emerald-600 text-white p-2.5 rounded-lg text-xs flex items-center gap-2 shadow-xs">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span className="font-bold">Order complete! Hand over your order number at the counter.</span>
                        </div>
                      )}

                      {/* Ordered Items List */}
                      <div className="bg-muted/40 p-2.5 rounded-lg text-xs space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center">
                            <span>{it.quantity}x {it.name}</span>
                            <span className="font-mono text-muted-foreground">₦{it.price * it.quantity}</span>
                          </div>
                        ))}
                        <div className="border-t pt-1.5 mt-1 flex justify-between font-bold text-foreground">
                          <span>Total Amount</span>
                          <span className="font-mono text-emerald-600">₦{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
