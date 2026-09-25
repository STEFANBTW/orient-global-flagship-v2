'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, 
  ChefHat, 
  ShoppingBag, 
  Calendar, 
  Plus, 
  RotateCcw, 
  MessageSquare, 
  Phone, 
  MapPin, 
  User, 
  ArrowRight, 
  Timer, 
  Search, 
  X,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { useRoles } from '@/context/role-context';
import { useToast } from '@/hooks/use-toast';
import { orderService, CustomerOrder, getDisplayStatus } from '@/services/orderService';
import { getActiveConsumerUser, AppUser } from '@/services/userService';
import { OrderTracker } from './OrderTracker';
import { NotificationToggleButton } from '@/components/common/NotificationToggleButton';

interface TableReservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
  tableType: string;
  specialRequests: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, notifications, markNotificationRead } = useRoles();

  const handleGoToRestaurantMenu = () => {
    // Dispatch global event to navigate App.tsx to the public Restaurant Menu page
    window.dispatchEvent(new CustomEvent('orient:navigate', { detail: 'dining' }));
    try {
      navigate('/dashboard/dining');
    } catch (e) {}
  };

  // Active User Profile - Legitimate account isolation
  const activeConsumer: AppUser = getActiveConsumerUser() || {
    id: currentUser?.id || 'usr_guest',
    name: currentUser?.name || 'Guest User',
    email: currentUser?.email || '',
    phone: '',
    role: 'customer',
    avatar: currentUser?.avatar || 'GU',
    deliveryAddress: ''
  };

  // Account State - Strictly empty for new accounts
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [reservations, setReservations] = useState<TableReservation[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'tracking' | 'reservations' | 'notifications'>('orders');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'pending' | 'cooking' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Modals
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [kitchenNote, setKitchenNote] = useState('');
  const [noteTargetOrderId, setNoteTargetOrderId] = useState<string | null>(null);

  // Reservation Form State
  const [resDate, setResDate] = useState('2026-09-28');
  const [resTime, setResTime] = useState('19:00');
  const [resParty, setResParty] = useState('2');
  const [resTableType, setResTableType] = useState('Main Dining Room');
  const [resRequests, setResRequests] = useState('');

  // Load account-isolated reservations from local storage
  const loadReservations = () => {
    try {
      if (typeof window !== 'undefined') {
        const key = `orient_reservations_${activeConsumer.id}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          setReservations(JSON.parse(saved));
        } else {
          setReservations([]); // 0 reservations for brand new account
        }
      }
    } catch (e) {
      setReservations([]);
    }
  };

  // Load account-isolated orders strictly placed by this user
  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getOrders();
      // Filter strictly for this user account (ID, Phone, or Email match)
      const userOrders = allOrders.filter(
        o => o.customerId === activeConsumer.id || 
             (o.customerPhone && activeConsumer.phone && o.customerPhone === activeConsumer.phone) ||
             (o.customerEmail && activeConsumer.email && o.customerEmail.toLowerCase() === activeConsumer.email.toLowerCase())
      );
      setOrders(userOrders); // Strictly empty [] for new accounts
    } catch (e) {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    loadReservations();

    const unsub = orderService.subscribeToOrders((list) => {
      const userOrders = list.filter(
        o => o.customerId === activeConsumer.id || 
             (o.customerPhone && activeConsumer.phone && o.customerPhone === activeConsumer.phone) ||
             (o.customerEmail && activeConsumer.email && o.customerEmail.toLowerCase() === activeConsumer.email.toLowerCase())
      );
      setOrders(userOrders);
    });

    const handleUserChanged = () => {
      loadOrders();
      loadReservations();
    };

    window.addEventListener('orient_consumer_user_changed', handleUserChanged);
    const interval = setInterval(loadOrders, 3000);

    return () => {
      unsub();
      window.removeEventListener('orient_consumer_user_changed', handleUserChanged);
      clearInterval(interval);
    };
  }, [activeConsumer.id]);

  // Derived lists
  const activeOrders = orders.filter(o => {
    const s = getDisplayStatus(o.status);
    return s !== 'Completed' && s !== 'Cancelled';
  });
  const pastOrders = orders.filter(o => {
    const s = getDisplayStatus(o.status);
    return s === 'Completed' || s === 'Cancelled';
  });

  // Filtered orders
  const displayedOrders = orders.filter(o => {
    const status = getDisplayStatus(o.status);
    const matchesFilter = 
      historyFilter === 'all' ? true :
      historyFilter === 'pending' ? status === 'Pending' :
      historyFilter === 'cooking' ? status === 'Cooking' :
      historyFilter === 'ready' ? status === 'Ready' :
      status === 'Completed';

    const matchesSearch = searchQuery === '' ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some(it => it.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.tableNumber && o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Action Handlers
  const handleCreateReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes: TableReservation = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: activeConsumer.name,
      date: resDate,
      time: resTime,
      partySize: parseInt(resParty) || 2,
      tableType: resTableType,
      specialRequests: resRequests,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    const updatedRes = [newRes, ...reservations];
    setReservations(updatedRes);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`orient_reservations_${activeConsumer.id}`, JSON.stringify(updatedRes));
      }
    } catch (e) {}

    setIsReserveModalOpen(false);
    setResRequests('');
    toast({
      title: 'Table Reserved Successfully!',
      description: `Your table for ${newRes.partySize} guests at ${newRes.time} on ${newRes.date} is confirmed.`
    });
  };

  const handleReorder = async (orderToRepeat: CustomerOrder) => {
    try {
      const newOrder = await orderService.placeOrder({
        customerId: activeConsumer.id,
        customerName: activeConsumer.name,
        customerPhone: activeConsumer.phone,
        customerEmail: activeConsumer.email,
        tableNumber: orderToRepeat.tableNumber || 'Takeout / Pickup',
        items: orderToRepeat.items.map(it => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          division: 'dining',
          price: 10
        }))
      });

      toast({
        title: 'Re-Order Placed!',
        description: `Order #${newOrder.id} sent to Orient Restaurant Kitchen.`
      });
      loadOrders();
    } catch (e) {
      toast({
        title: 'Re-Order Error',
        description: 'Could not repeat order at this moment.'
      });
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.updateOrderStatus(orderId, 'cancelled');
      toast({
        title: 'Order Cancelled',
        description: `Order #${orderId} has been cancelled.`
      });
      loadOrders();
    } catch (e) {
      toast({ title: 'Error', description: 'Could not cancel order.' });
    }
  };

  const handleSendKitchenNote = () => {
    if (!kitchenNote.trim() || !noteTargetOrderId) return;
    toast({
      title: 'Message Sent to Kitchen',
      description: `Your request regarding Order #${noteTargetOrderId} was received by the Chef.`
    });
    setKitchenNote('');
    setIsNoteModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* NOTIFICATION TOGGLE BUTTON */}
      <div className="flex justify-end">
        <NotificationToggleButton />
      </div>

      {/* ========================================================================= */}
      {/* 1. RESTAURANT QUICK ACTIONS BAR                                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Action 1: Place Order (Orange BG, White Text, No Border) */}
        <button
          onClick={handleGoToRestaurantMenu}
          className="p-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition-all text-left group cursor-pointer flex items-center justify-between h-20 text-white border-none shadow-xs"
        >
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5 text-white shrink-0" />
            <span className="text-sm font-bold text-white block">
              Place Order
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* Action 2: Reserve A Table */}
        <button
          onClick={() => setIsReserveModalOpen(true)}
          className="p-4 rounded-xl bg-[#FFFFFF] hover:bg-slate-50 dark:bg-[#232323] dark:hover:bg-[#2a2a2a] border-none shadow-xs transition-all text-left group cursor-pointer flex items-center justify-between h-20"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
            <span className="text-sm font-bold text-foreground block">
              Reserve A Table
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
        </button>

        {/* Action 3: Track Active Kitchen Order */}
        <button
          onClick={() => {
            setActiveTab('tracking');
          }}
          className="p-4 rounded-xl bg-[#FFFFFF] hover:bg-slate-50 dark:bg-[#232323] dark:hover:bg-[#2a2a2a] border-none shadow-xs transition-all text-left group cursor-pointer flex items-center justify-between h-20"
        >
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-muted-foreground shrink-0" />
            <div>
              <span className="text-sm font-bold text-foreground block">
                Track Active Kitchen Order
              </span>
              {activeOrders.length > 0 && (
                <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                  {activeOrders.length} Order Active
                </span>
              )}
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-all" />
        </button>

        {/* Action 4: Reorder (Orange BG, White Text, No Border) */}
        <button
          onClick={() => {
            if (pastOrders.length > 0) {
              handleReorder(pastOrders[0]);
            } else {
              handleGoToRestaurantMenu();
            }
          }}
          className="p-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition-all text-left group cursor-pointer flex items-center justify-between h-20 text-white border-none shadow-xs"
        >
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-white shrink-0" />
            <span className="text-sm font-bold text-white block">
              Reorder
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-all" />
        </button>

      </div>

      {/* ========================================================================= */}
      {/* 3. ACTIVE KITCHEN ORDERS (IF ANY)                                         */}
      {/* ========================================================================= */}
      {activeOrders.length > 0 && (
        <Card className="border-none shadow-xs bg-card overflow-hidden rounded-2xl">
          <CardHeader className="bg-muted/30 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-muted-foreground" />
                <CardTitle className="text-base font-bold text-foreground">
                  Active Kitchen Preparation ({activeOrders.length})
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-mono text-muted-foreground border-none bg-muted">
                Live Kitchen Sync
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4">
            {activeOrders.map(order => {
              const isAwaiting = order.status === 'awaiting_chef';
              const isPreparing = order.status === 'preparing' || order.status === 'ten_min_warning';
              const isWarning = order.status === 'ten_min_warning';
              const isReady = order.status === 'ready';

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
                  className="p-4 rounded-xl border-none bg-muted/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-foreground">Order #{order.id}</span>
                        <span className="text-xs text-muted-foreground">({order.tableNumber})</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground block mt-0.5">
                        Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <Badge variant="outline" className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border-none bg-muted">
                      {isReady ? 'Ready for Pickup' :
                       isWarning ? '10-Min Warning Alert' :
                       isPreparing ? 'Preparing in Kitchen' :
                       'Awaiting Chef Confirmation'}
                    </Badge>
                  </div>

                  {/* 10 Min Alert Banner */}
                  {isWarning && (
                    <div className="bg-muted p-3 rounded-lg text-xs flex items-center justify-between border-none">
                      <div className="flex items-center gap-2 text-foreground">
                        <Bell className="w-4 h-4 shrink-0 text-muted-foreground" />
                        <span className="font-bold">10-Minute Warning: Your order is almost ready!</span>
                      </div>
                    </div>
                  )}

                  {/* Prep Timer */}
                  {isPreparing && (
                    <div className="p-3 rounded-lg bg-background border-none flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 font-semibold text-foreground">
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        Kitchen Countdown:
                      </span>
                      <span className="font-mono font-bold text-foreground text-sm">
                        {remainingText || `${order.prepDurationMinutes} mins`}
                      </span>
                    </div>
                  )}

                  {/* Order Items List */}
                  <div className="p-3 rounded-lg bg-background/50 text-xs space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center py-0.5">
                        <span className="text-foreground font-medium">{it.quantity}x {it.name}</span>
                        <span className="font-mono text-muted-foreground">₦{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-border/20 pt-2 mt-2 flex justify-between font-bold text-foreground">
                      <span>Total</span>
                      <span className="font-mono">₦{order.totalAmount}</span>
                    </div>
                  </div>

                  {/* Actions for Active Order */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setNoteTargetOrderId(order.id);
                        setIsNoteModalOpen(true);
                      }}
                      className="text-xs h-8 gap-1.5 border-none bg-muted/40 hover:bg-muted"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                      Contact Kitchen
                    </Button>

                    {isAwaiting && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        className="text-xs h-8"
                      >
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN USER DASHBOARD CARD (ORDERS, TABLE BOOKINGS, NOTIFICATIONS)      */}
      {/* ========================================================================= */}
      <Card className="border-none shadow-xs bg-card rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-[#d4dae3] dark:border-[#3b414a]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left: Section Header */}
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-base font-bold text-foreground">
                {activeTab === 'orders' ? 'Order History' : 
                 activeTab === 'tracking' ? 'Track Order' :
                 activeTab === 'reservations' ? 'Table Bookings' : 'Notifications'}
              </CardTitle>
            </div>

            {/* Tab Switcher */}
            <div className="inline-flex items-center p-1 bg-muted/60 dark:bg-muted/40 rounded-xl text-xs font-medium self-start sm:self-auto gap-1">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'orders'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Order History ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('tracking')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'tracking'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Track Order
              </button>
              <button
                onClick={() => setActiveTab('reservations')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'reservations'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Table Bookings ({reservations.length})
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Notifications ({notifications.length})
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          
          {/* ORDERS HISTORY TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Search & Filter Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                
                {/* Search Bar */}
                <div className="relative flex items-center flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-3 text-muted-foreground pointer-events-none z-10 shrink-0" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search meal or order ID..."
                    className="h-9 pl-9 pr-3 text-xs bg-[#f8fafc] dark:bg-[#1a1a1a] text-foreground border-none w-full rounded-xl focus:ring-0 focus-visible:ring-0"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['all', 'pending', 'cooking', 'ready', 'completed'] as const).map((filterKey) => {
                    const label = filterKey === 'all' ? 'All' :
                                  filterKey === 'pending' ? 'Pending' :
                                  filterKey === 'cooking' ? 'Cooking' :
                                  filterKey === 'ready' ? 'Ready' : 'Completed';
                    const count = filterKey === 'all' 
                      ? orders.length 
                      : orders.filter(o => getDisplayStatus(o.status).toLowerCase() === filterKey).length;

                    return (
                      <button
                        key={filterKey}
                        onClick={() => setHistoryFilter(filterKey)}
                        className={`px-3 py-1 text-xs rounded-lg transition-colors font-medium capitalize ${
                          historyFilter === filterKey
                            ? 'bg-foreground text-background font-semibold'
                            : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Orders List */}
              {displayedOrders.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl p-6 border-none">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">No orders placed yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedOrders.map((order) => {
                    const isCompleted = order.status === 'completed';
                    const isCancelled = order.status === 'cancelled';

                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-xl border-none bg-muted/20 hover:bg-muted/40 transition-all flex flex-col justify-between gap-3 group"
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-[#d4dae3] dark:border-[#3b414a]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-foreground">
                                #{order.id}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {order.tableNumber || 'Dining'}
                              </span>
                            </div>

                            <Badge variant="outline" className={`text-[10px] font-bold border-none ${
                              getDisplayStatus(order.status) === 'Pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                              getDisplayStatus(order.status) === 'Cooking' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                              getDisplayStatus(order.status) === 'Ready' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                              'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                            }`}>
                              {getDisplayStatus(order.status)}
                            </Badge>
                          </div>

                          <div className="pt-2 space-y-1">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-foreground font-medium">
                                  {it.quantity}x {it.name}
                                </span>
                                <span className="font-mono text-muted-foreground">
                                  ₦{it.price * it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#d4dae3] dark:border-[#3b414a] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Total Amount</span>
                            <span className="font-mono font-bold text-sm text-foreground">
                              ₦{order.totalAmount}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs h-8 px-2.5"
                            >
                              Details
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReorder(order)}
                              className="text-xs h-8 px-2.5 gap-1 border-none bg-muted/40 hover:bg-muted"
                            >
                              <RotateCcw className="w-3 h-3 text-muted-foreground" />
                              Re-order
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TRACKING TAB */}
          {activeTab === 'tracking' && (
            <div className="space-y-4 pt-2">
              <OrderTracker orders={orders} />
            </div>
          )}

          {/* TABLE RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Your reserved dining tables at Orient Restaurant
                </span>
                <Button
                  size="sm"
                  onClick={() => setIsReserveModalOpen(true)}
                  className="text-xs gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold border-none"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  New Reservation
                </Button>
              </div>

              {reservations.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl p-6 border-none">
                  <Calendar className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">No table reservations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Book a dining table to see your reservation records here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-xl border-none bg-muted/20 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-mono font-bold text-xs text-foreground">{res.id}</span>
                          <span className="text-xs font-semibold block text-foreground mt-0.5">
                            {res.tableType}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px] border-none bg-muted">
                          {res.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-background/50 p-2.5 rounded-lg">
                        <div>
                          <span className="block text-[10px] text-muted-foreground">Date & Time</span>
                          <span className="font-semibold text-foreground">{res.date} @ {res.time}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground">Party Size</span>
                          <span className="font-semibold text-foreground">{res.partySize} Guests</span>
                        </div>
                      </div>

                      {res.specialRequests && (
                        <p className="text-[11px] text-muted-foreground italic">
                          "{res.specialRequests}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-1">
                <span className="text-xs text-muted-foreground">
                  System alerts, kitchen prep updates, and account activity
                </span>
                {notifications.some(n => !n.read) && (
                  <Badge variant="outline" className="text-xs font-mono border-none text-muted-foreground bg-muted">
                    {notifications.filter(n => !n.read).length} Unread
                  </Badge>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-2xl p-6 border-none">
                  <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">No news from the chef yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Order prep status and news from the kitchen will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-xl transition-all cursor-pointer flex items-start gap-3 border-none ${
                        !notif.read ? 'bg-orange-500/10' : 'bg-muted/20 hover:bg-muted/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 ${!notif.read ? 'bg-orange-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-foreground truncate">{(notif as any).title || notif.message}</span>
                          <span className="text-[10px] text-muted-foreground shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* DIALOG 1: RESERVE A TABLE MODAL                                          */}
      {/* ========================================================================= */}
      <Dialog open={isReserveModalOpen} onOpenChange={setIsReserveModalOpen}>
        <DialogContent className="w-full h-full sm:h-auto sm:max-w-md bg-card border-none shadow-2xl rounded-none sm:rounded-2xl p-5 sm:p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <Calendar className="w-5 h-5 text-orange-500" />
              Book a Dining Table
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reserve your spot at Orient Restaurant.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateReservation} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <Input
                  type="date"
                  value={resDate}
                  onChange={(e) => setResDate(e.target.value)}
                  className="text-xs h-9 bg-background border-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Time</label>
                <Input
                  type="time"
                  value={resTime}
                  onChange={(e) => setResTime(e.target.value)}
                  className="text-xs h-9 bg-background border-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Party Size</label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={resParty}
                  onChange={(e) => setResParty(e.target.value)}
                  className="text-xs h-9 bg-background border-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Seating Area</label>
                <select
                  value={resTableType}
                  onChange={(e) => setResTableType(e.target.value)}
                  className="w-full h-9 rounded-lg border-none bg-background text-xs px-2 text-foreground focus:outline-none"
                >
                  <option value="Main Dining Room">Main Dining Room</option>
                  <option value="VIP Dining Booth">VIP Dining Booth</option>
                  <option value="Outdoor Terrace">Outdoor Terrace</option>
                  <option value="Executive Suite">Executive Suite</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Special Requests / Notes</label>
              <textarea
                rows={3}
                value={resRequests}
                onChange={(e) => setResRequests(e.target.value)}
                placeholder="Dietary requirements, birthday notes, or table preference..."
                className="w-full p-2.5 rounded-lg border-none bg-background text-xs text-foreground focus:outline-none"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReserveModalOpen(false)}
                className="text-xs border-none bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold border-none"
              >
                Confirm Reservation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: CONTACT KITCHEN / SPECIAL NOTE                                 */}
      {/* ========================================================================= */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="w-full h-full sm:h-auto sm:max-w-md bg-card border-none shadow-2xl rounded-none sm:rounded-2xl p-5 sm:p-6 overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <MessageSquare className="w-5 h-5 text-orange-500" />
              Send Note to Kitchen (Order #{noteTargetOrderId})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Direct communication with Orient Restaurant staff for active order notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <textarea
              rows={4}
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              placeholder="e.g. Please add extra pepper sauce on the side..."
              className="w-full p-3 rounded-lg border-none bg-background text-xs text-foreground focus:outline-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNoteModalOpen(false)}
              className="text-xs border-none bg-muted/50"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSendKitchenNote}
              className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold border-none"
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 3: ORDER RECEIPT / DETAILS MODAL                                   */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="w-full h-full sm:h-auto sm:max-w-md bg-card border-none shadow-2xl rounded-none sm:rounded-2xl p-5 sm:p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-base font-bold text-foreground">
                <span>Receipt Order #{selectedOrder.id}</span>
                <Badge variant="outline" className="text-xs border-none bg-muted">
                  {selectedOrder.status}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Orient Restaurant Order Record
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-semibold text-foreground">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-mono text-foreground">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location / Table:</span>
                  <span className="text-foreground">{selectedOrder.tableNumber || 'Takeout'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-mono text-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-bold text-foreground block">Items Ordered:</span>
                <div className="p-3 rounded-lg bg-muted/20 space-y-2">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span>{it.quantity}x {it.name}</span>
                      <span className="font-mono font-bold">₦{it.price * it.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/20 pt-2 flex justify-between font-bold text-sm text-foreground">
                    <span>Total Paid</span>
                    <span className="font-mono">₦{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  handleReorder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="text-xs gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold border-none"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                Re-order Entire Receipt
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
