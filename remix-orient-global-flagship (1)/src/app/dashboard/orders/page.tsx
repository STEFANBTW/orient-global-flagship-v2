'use client';

import React, { useState, useEffect } from 'react';
import { useRoles } from '@/context/role-context';
import { 
  ChefHat, Clock, AlertTriangle, CheckCircle2, Play, 
  ShoppingBag, Search, Filter, RefreshCw, Bell, Plus, 
  Store, Pizza, Gamepad2, Droplets, Wine, Sparkles, User, MapPin, Trash2, Trophy
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { orderService, CustomerOrder, AppNotification } from '@/services/orderService';
import { useNotifications } from '@/context/NotificationContext';
import { QuickOrderModal } from '@/components/QuickOrderModal';

export default function OrdersDashboardPage() {
  const { addNotification } = useNotifications();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'awaiting_chef' | 'preparing' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Real-time ticking clock for preparation timers
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Subscribe to real-time orders + notifications from Firestore
  useEffect(() => {
    const unsubOrders = orderService.subscribeToOrders((list) => {
      setOrders(list);
    });
    const unsubNotifs = orderService.subscribeToNotifications((list) => {
      setNotifications(list);
    });
    return () => {
      unsubOrders();
      unsubNotifs();
    };
  }, []);

  // Chef Confirm & Start — 11 MINUTES
  const handleChefConfirm = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await orderService.confirmAndStartOrder(orderId, 11);
      addNotification({
        title: '👨🍳 Order Confirmed & Started!',
        message: `Order #${orderId} is now preparing (11 min timer). Stock auto-decremented!`,
        type: 'success'
      });
    } catch (e: any) {
      addNotification({ title: 'Confirmation Error', message: e.message || 'Failed to start order.', type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  // Mark Ready (chef can finish early)
  const handleMarkReady = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await orderService.markOrderReady(orderId);
      addNotification({ title: '✅ Order Ready!', message: `Order #${orderId} marked ready for pickup.`, type: 'success' });
    } catch (e: any) {
      addNotification({ title: 'Error', message: e.message, type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  // Conclude/Complete Order
  const handleFinishOrder = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      await orderService.updateOrderStatus(orderId, 'completed');
      addNotification({
        title: '🏆 Order Completed!',
        message: `Order #${orderId} concluded and moved to Completed.`,
        type: 'success'
      });
    } catch (e: any) {
      addNotification({ title: 'Error', message: e.message, type: 'error' });
    } finally {
      setIsProcessing(null);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Delete order #${orderId} permanently?`)) {
      setIsProcessing(orderId);
      try {
        await orderService.deleteOrder(orderId);
        addNotification({ title: 'Order Deleted', message: `Order #${orderId} deleted.`, type: 'info' });
      } catch (e: any) {
        addNotification({ title: 'Error', message: e.message, type: 'error' });
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const getRemainingTimeFormatted = (endsAt?: number | null) => {
    if (!endsAt) return null;
    const diff = endsAt - now;
    if (diff <= 0) return '00:00';
    const mins = Math.floor(diff / (60 * 1000));
    const secs = Math.floor((diff % (60 * 1000)) / 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Active orders = everything except completed
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const filteredOrders = (selectedFilter === 'completed' ? completedOrders : activeOrders).filter(o => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'completed') return true;
    if (selectedFilter === 'awaiting_chef') return o.status === 'awaiting_chef';
    if (selectedFilter === 'preparing') return o.status === 'preparing' || o.status === 'ten_min_warning' || o.status === 'five_min_warning';
    if (selectedFilter === 'ready') return o.status === 'ready';
    return true;
  }).filter(o => {
    if (!searchQuery.trim()) return true;
    return (
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const awaitingChefCount = activeOrders.filter(o => o.status === 'awaiting_chef').length;
  const preparingCount = activeOrders.filter(o => o.status === 'preparing' || o.status === 'ten_min_warning' || o.status === 'five_min_warning').length;
  const readyCount = activeOrders.filter(o => o.status === 'ready').length;
  const completedCount = completedOrders.length;

  const getStatusBadge = (order: CustomerOrder) => {
    if (order.status === 'awaiting_chef') return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 text-[16px] font-bold gap-1">
        <Clock className="w-3 h-3" /> Pending
      </Badge>
    );
    if (order.status === 'preparing') return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30 text-[16px] font-bold gap-1">
        <ChefHat className="w-3 h-3" /> Preparing
      </Badge>
    );
    if (order.status === 'ten_min_warning') return (
      <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/40 text-[16px] font-bold gap-1 animate-pulse">
        <AlertTriangle className="w-3 h-3" /> 10-Min Alert
      </Badge>
    );
    if (order.status === 'five_min_warning') return (
      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/40 text-[16px] font-bold gap-1 animate-pulse">
        <AlertTriangle className="w-3 h-3" /> 5-Min Alert
      </Badge>
    );
    if (order.status === 'ready') return (
      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[16px] font-bold gap-1">
        <CheckCircle2 className="w-3 h-3" /> Ready for Pickup
      </Badge>
    );
    if (order.status === 'completed') return (
      <Badge variant="outline" className="bg-slate-500/10 text-slate-400 border-slate-500/30 text-[16px] font-bold gap-1">
        <Trophy className="w-3 h-3" /> Completed
      </Badge>
    );
    return null;
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold uppercase tracking-widest text-emerald-500 font-mono">
              Live Kitchen & Order Dispatch Station • Role: BOSS
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight font-headline mt-1">
            Orders & Preparation Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time orders from storefront. Chef confirms → 11-min timer starts → auto alerts at 10min & 5min remaining.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div onClick={() => setSelectedFilter('all')} className={`p-4 rounded-xl border cursor-pointer transition-all ${ selectedFilter === 'all' ? 'bg-card border-primary ring-1 ring-primary' : 'bg-card/50 border-border/60 hover:border-border' }`}>
          <span className="text-[14px] uppercase font-mono tracking-wider text-muted-foreground block">Total Active</span>
          <span className="text-2xl font-black text-foreground">{activeOrders.length}</span>
        </div>
        <div onClick={() => setSelectedFilter('awaiting_chef')} className={`p-4 rounded-xl border cursor-pointer transition-all ${ selectedFilter === 'awaiting_chef' ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500' : 'bg-card/50 border-border/60 hover:border-border' }`}>
          <span className="text-[14px] uppercase font-mono tracking-wider text-amber-500 block">Pending</span>
          <span className="text-2xl font-black text-amber-500">{awaitingChefCount}</span>
          <span className="text-[14px] text-muted-foreground block mt-0.5">Awaiting Chef</span>
        </div>
        <div onClick={() => setSelectedFilter('preparing')} className={`p-4 rounded-xl border cursor-pointer transition-all ${ selectedFilter === 'preparing' ? 'bg-blue-500/10 border-blue-500 ring-1 ring-blue-500' : 'bg-card/50 border-border/60 hover:border-border' }`}>
          <span className="text-[14px] uppercase font-mono tracking-wider text-blue-500 block">In Kitchen</span>
          <span className="text-2xl font-black text-blue-500">{preparingCount}</span>
          <span className="text-[14px] text-muted-foreground block mt-0.5">Timer Running</span>
        </div>
        <div onClick={() => setSelectedFilter('ready')} className={`p-4 rounded-xl border cursor-pointer transition-all ${ selectedFilter === 'ready' ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500' : 'bg-card/50 border-border/60 hover:border-border' }`}>
          <span className="text-[14px] uppercase font-mono tracking-wider text-emerald-500 block">Ready</span>
          <span className="text-2xl font-black text-emerald-500">{readyCount}</span>
          <span className="text-[14px] text-muted-foreground block mt-0.5">Collect Now</span>
        </div>
        <div onClick={() => setSelectedFilter('completed')} className={`p-4 rounded-xl border cursor-pointer transition-all ${ selectedFilter === 'completed' ? 'bg-slate-500/10 border-slate-400 ring-1 ring-slate-400' : 'bg-card/50 border-border/60 hover:border-border' }`}>
          <span className="text-[14px] uppercase font-mono tracking-wider text-slate-400 block">Completed</span>
          <span className="text-2xl font-black text-slate-400">{completedCount}</span>
          <span className="text-[14px] text-muted-foreground block mt-0.5">Done & Served</span>
        </div>
      </div>

      {/* Filter + Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60 p-3 rounded-xl border border-border/60">
        <div className="relative flex items-center flex-1 max-w-md">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none z-10 shrink-0" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, item..."
            className="pl-9 h-9 text-xs bg-[#f8fafc] dark:bg-[#1a1a1a] border-none w-full"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Active' },
            { id: 'awaiting_chef', label: `Pending (${awaitingChefCount})` },
            { id: 'preparing', label: `In Kitchen (${preparingCount})` },
            { id: 'ready', label: `Ready (${readyCount})` },
            { id: 'completed', label: `Completed (${completedCount})` }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === f.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/30 text-muted-foreground hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card/80 border border-border/60 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40 text-[16px] uppercase font-mono tracking-wider">
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Customer & Destination</TableHead>
              <TableHead>Items (₦10/ea)</TableHead>
              <TableHead className="w-[110px]">Total</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="w-[150px]">Kitchen Timer</TableHead>
              <TableHead className="text-right w-[220px]">Chef Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center text-muted-foreground">
                  <div className="space-y-2">
                    <ShoppingBag className="w-8 h-8 mx-auto text-muted-foreground/40" />
                    <p className="text-sm font-medium">
                      {selectedFilter === 'completed' ? 'No completed orders yet.' : 'No orders found matching this filter.'}
                    </p>
                    {selectedFilter !== 'completed' && (
                      <Button onClick={() => setIsQuickOrderOpen(true)} size="sm" variant="outline" className="text-xs">
                        Place a Test Order (₦10)
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map(order => {
                const remainingFormatted = getRemainingTimeFormatted(order.timerEndsAt);
                const remainingMs = order.timerEndsAt ? order.timerEndsAt - now : Infinity;
                const isUnder5Mins = remainingMs <= 5 * 60 * 1000 && remainingMs > 0;
                const isUnder10Mins = remainingMs <= 10 * 60 * 1000 && remainingMs > 0;
                const isCompleted = order.status === 'completed';

                return (
                  <TableRow key={order.id} className={`hover:bg-muted/20 border-border/40 ${isCompleted ? 'opacity-60' : ''}`}>
                    <TableCell className="font-mono text-xs font-bold text-foreground">
                      #{order.id}
                      <span className="text-[14px] text-muted-foreground block font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="font-bold text-foreground block">{order.customerName}</span>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[16px] mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span>{order.tableNumber || order.shippingAddress}</span>
                        </div>
                        {order.notes && (
                          <span className="text-[14px] text-amber-500/90 italic block mt-0.5">"{order.notes}"</span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs">
                            <span className="font-semibold text-foreground">{it.name}</span>
                            <span className="font-mono text-primary text-[16px] font-bold">x{it.quantity}</span>
                            <span className="text-[14px] text-muted-foreground">(₦10)</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="font-mono font-extrabold text-xs text-foreground">
                      ₦{order.totalAmount.toLocaleString()}
                    </TableCell>

                    <TableCell>{getStatusBadge(order)}</TableCell>

                    <TableCell>
                      {order.timerEndsAt && order.status !== 'ready' && order.status !== 'completed' ? (
                        <div className="space-y-0.5">
                          <div className={`font-mono text-xs font-extrabold ${
                            isUnder5Mins ? 'text-red-400 animate-pulse' :
                            isUnder10Mins ? 'text-amber-400 animate-pulse' : 'text-primary'
                          }`}>
                            {remainingFormatted}
                          </div>
                          <span className="text-[14px] text-muted-foreground block">
                            {order.fiveMinAlertSent ? '✓ 5m alert sent' : order.tenMinAlertSent ? '✓ 10m alert sent' : 'Auto-alerts pending'}
                          </span>
                        </div>
                      ) : order.status === 'ready' || order.status === 'completed' ? (
                        <span className="text-[16px] font-bold text-emerald-500">Done</span>
                      ) : (
                        <span className="text-[16px] text-muted-foreground italic">Not started</span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'awaiting_chef' && (
                          <Button
                            size="sm"
                            disabled={isProcessing === order.id}
                            onClick={() => handleChefConfirm(order.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 rounded-lg shadow-sm gap-1"
                          >
                            <ChefHat className="w-3.5 h-3.5" /> Confirm & Start
                          </Button>
                        )}

                        {(order.status === 'preparing' || order.status === 'ten_min_warning' || order.status === 'five_min_warning') && (
                          <Button
                            size="sm"
                            disabled={isProcessing === order.id}
                            onClick={() => handleMarkReady(order.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 rounded-lg shadow-sm gap-1"
                            title="Mark ready early — chef finished before timer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready
                          </Button>
                        )}

                        {order.status === 'ready' && (
                          <Button
                            size="sm"
                            disabled={isProcessing === order.id}
                            onClick={() => handleFinishOrder(order.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs h-8 rounded-lg shadow-sm gap-1"
                          >
                            <Trophy className="w-3.5 h-3.5" /> Conclude Order
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isProcessing === order.id}
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-8 w-8 p-0 rounded-lg"
                          title="Delete order permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Notifications Stream */}
      <div className="bg-card/70 border border-border/60 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-foreground">
              Notifications Stream (All Channels)
            </h3>
          </div>
          <Badge variant="outline" className="text-[14px] font-mono text-muted-foreground">
            {notifications.length} Total
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground col-span-3">No notifications yet. Orders placed from the storefront will appear here.</p>
          ) : notifications.slice(0, 9).map(n => (
            <div key={n.id} className="p-3 rounded-lg border border-border/40 bg-background/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground truncate max-w-[180px]">{n.title}</span>
                <span className="text-[13px] text-muted-foreground font-mono shrink-0">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[16px] text-muted-foreground line-clamp-2">{n.message}</p>
              <span className={`text-[13px] font-mono px-1.5 py-0.5 rounded ${
                n.recipient === 'user' ? 'bg-blue-500/10 text-blue-400' :
                n.recipient === 'cms' ? 'bg-amber-500/10 text-amber-400' : 'bg-muted text-muted-foreground'
              }`}>{n.recipient}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Order Modal */}
      <QuickOrderModal isOpen={isQuickOrderOpen} onClose={() => setIsQuickOrderOpen(false)} />
    </div>
  );
}
