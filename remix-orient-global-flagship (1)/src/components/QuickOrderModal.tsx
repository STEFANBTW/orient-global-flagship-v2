'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, X, CheckCircle2, Clock, ChefHat, AlertTriangle, 
  Sparkles, ArrowRight, User, Phone, MapPin, Plus, Minus, Trash2,
  Utensils, Store, Wine, Droplets, Gamepad2, Play
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { INITIAL_PRODUCTS_CATALOG, ProductItem } from '@/data/productsCatalog';
import { orderService, CustomerOrder } from '@/services/orderService';
import { useNotifications } from '@/context/NotificationContext';
import { cmsApi } from '@/services/cmsApi';
import { getActiveConsumerUser } from '@/services/userService';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: ProductItem | null;
  onOrderPlaced?: () => void;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({ isOpen, onClose, preselectedProduct, onOrderPlaced }) => {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'create' | 'tracking'>('create');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS_CATALOG);
  const [cart, setCart] = useState<Array<{ product: ProductItem; quantity: number }>>([]);
  
  // Customer info from active mock user
  const activeUser = getActiveConsumerUser();
  const [customerName, setCustomerName] = useState(activeUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(activeUser?.phone || '');
  const [tableNumber, setTableNumber] = useState('VIP Table 4');
  const [notes, setNotes] = useState('Please serve hot with extra cutlery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Active Order Tracker state
  const [activeOrder, setActiveOrder] = useState<CustomerOrder | null>(null);
  const [remainingTimeText, setRemainingTimeText] = useState<string>('');

  // Fetch current products (ensures latest stock and prices)
  useEffect(() => {
    cmsApi.getProducts().then(res => {
      if (res?.products?.length) {
        setProducts(res.products);
      }
    });

    // Check last user order from storage
    try {
      const last = localStorage.getItem('orient_last_user_order');
      if (last) {
        const parsed = JSON.parse(last);
        setActiveOrder(parsed);
      }
    } catch (e) {}
  }, [isOpen]);

  // Prepopulate with preselected item if opened from a specific product card
  useEffect(() => {
    if (preselectedProduct && isOpen) {
      setCart([{ product: preselectedProduct, quantity: 1 }]);
      setActiveTab('create');
    }
  }, [preselectedProduct, isOpen]);

  // Realtime subscription to the active order
  useEffect(() => {
    if (!activeOrder) return;
    const unsub = orderService.subscribeToOrders((orders) => {
      const updated = orders.find(o => o.id === activeOrder.id);
      if (updated) {
        setActiveOrder(updated);
      }
    });
    return () => unsub();
  }, [activeOrder?.id]);

  // Live timer tick for active order
  useEffect(() => {
    if (!activeOrder?.timerEndsAt || activeOrder.status === 'ready' || activeOrder.status === 'completed') {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = activeOrder.timerEndsAt! - now;
      if (diff <= 0) {
        setRemainingTimeText('00:00 (Ready!)');
      } else {
        const minutes = Math.floor(diff / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setRemainingTimeText(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder?.timerEndsAt, activeOrder?.status]);

  const addToCart = (product: ProductItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.product.id === productId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      }).filter(Boolean) as Array<{ product: ProductItem; quantity: number }>;
    });
  };

  const totalItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);
  const grandTotalNaira = totalItemsCount * 10; // Fixed ₦10 per item

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      addNotification({
        title: "Cart Empty",
        message: "Please add at least one item to place an order.",
        type: "warning"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const activeUsr = getActiveConsumerUser();
      const order = await orderService.placeOrder({
        customerId: activeUsr?.id,
        customerName: customerName || activeUsr?.name || 'Guest User',
        customerPhone: customerPhone || activeUsr?.phone || '+234 800 000 0000',
        customerEmail: activeUsr?.email,
        tableNumber,
        shippingAddress: activeUsr?.deliveryAddress || 'Standard Delivery Address',
        notes,
        items: cart.map(i => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          division: i.product.division,
          category: i.product.category,
          image: i.product.image
        })),
        prepDurationMinutes: 25 // 25-minute kitchen timer standard
      });

      setActiveOrder(order);
      setActiveTab('tracking');
      setCart([]);
      onOrderPlaced?.();
      addNotification({
        title: "Order Placed! (₦10/item)",
        message: `Order #${order.id} sent to the chef! Awaiting confirmation.`,
        type: "success"
      });
    } catch (e: any) {
      addNotification({
        title: "Order Placement Error",
        message: e.message || "Failed to place order.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shortcut for testing: Chef starts order directly
  const handleTestChefStart = async () => {
    if (!activeOrder) return;
    try {
      const updated = await orderService.confirmAndStartOrder(activeOrder.id, 25);
      setActiveOrder(updated);
      addNotification({
        title: "Chef Confirmed Order!",
        message: "Stock decremented and 25-min kitchen countdown has started.",
        type: "success"
      });
    } catch (e: any) {
      addNotification({
        title: "Chef Confirm Failed",
        message: e.message,
        type: "error"
      });
    }
  };

  // Shortcut for testing: Fast-forward to 10-minute warning
  const handleTestTrigger10Min = async () => {
    if (!activeOrder) return;
    await orderService.sendTenMinuteWarning(activeOrder.id);
  };

  const filteredCatalog = selectedDivision === 'all' 
    ? products 
    : products.filter(p => p.division === selectedDivision);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-card/95 backdrop-blur-xl border border-border/80 shadow-2xl rounded-2xl flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary/20 via-background to-secondary/20 p-5 border-b border-border/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
              <Badge variant="outline" className="text-[10px] font-mono tracking-widest text-primary border-primary/30 uppercase px-2 py-0.5">
                Universal Order Service • ₦10 Flat Price
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-bold font-headline mt-1 tracking-tight">
              {activeTab === 'create' ? 'Place Order & Kitchen Dispatch' : 'Live Order & Kitchen Tracker'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Every item is ₦10. Orders wait for chef confirmation before stock decrements.
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'create' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('create')}
              className="text-xs font-semibold h-8 rounded-lg"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> New Order
            </Button>
            {activeOrder && (
              <Button
                variant={activeTab === 'tracking' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('tracking')}
                className="text-xs font-semibold h-8 rounded-lg"
              >
                <Clock className="w-3.5 h-3.5 mr-1" /> Track #{activeOrder.id.slice(-6)}
              </Button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'create' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Product Picker (7 cols) */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
                    Select Items to Order (₦10 each)
                  </h3>
                  <Badge variant="secondary" className="text-xs font-bold text-primary">
                    {filteredCatalog.length} Options
                  </Badge>
                </div>

                {/* Division Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['all', 'bakery', 'market', 'dining', 'games', 'water', 'lounge'].map(div => (
                    <button
                      key={div}
                      onClick={() => setSelectedDivision(div)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all whitespace-nowrap ${
                        selectedDivision === div
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {div}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {filteredCatalog.slice(0, 30).map(product => (
                    <div 
                      key={product.id}
                      className="group flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-background/50 hover:border-primary/50 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover bg-muted flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-extrabold text-primary">₦10</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Stock: {product.stock}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => addToCart(product)}
                        className="h-7 px-2.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-primary-foreground"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Customer Details & Order Summary (5 cols) */}
              <div className="md:col-span-5 bg-muted/20 p-4 rounded-xl border border-border/60 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-muted-foreground">
                    Customer & Destination
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">Name</Label>
                      <Input 
                        value={customerName} 
                        onChange={e => setCustomerName(e.target.value)} 
                        placeholder="Customer name"
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Phone</Label>
                        <Input 
                          value={customerPhone} 
                          onChange={e => setCustomerPhone(e.target.value)} 
                          placeholder="Phone number"
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold text-muted-foreground">Table / Address</Label>
                        <Input 
                          value={tableNumber} 
                          onChange={e => setTableNumber(e.target.value)} 
                          placeholder="Table 4 / Lagos"
                          className="h-8 text-xs bg-background"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">Special Instructions</Label>
                      <Input 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="e.g. extra spicy, served hot"
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="border-t border-border/50 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground">Order Items ({totalItemsCount})</span>
                      <span className="text-xs font-extrabold text-primary">₦{grandTotalNaira}</span>
                    </div>

                    {cart.length === 0 ? (
                      <div className="p-4 text-center border border-dashed border-border/60 rounded-lg text-xs text-muted-foreground">
                        Click [+] on any item on the left to add to order (₦10 each).
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {cart.map(({ product, quantity }) => (
                          <div key={product.id} className="flex items-center justify-between text-xs bg-background p-1.5 rounded-lg border border-border/40">
                            <span className="truncate max-w-[130px] font-medium">{product.name}</span>
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => updateQuantity(product.id, -1)} className="p-0.5 hover:bg-muted rounded">
                                <Minus className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <span className="font-bold text-xs w-4 text-center">{quantity}</span>
                              <button onClick={() => updateQuantity(product.id, 1)} className="p-0.5 hover:bg-muted rounded">
                                <Plus className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <span className="font-bold text-primary ml-1">₦{quantity * 10}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-muted-foreground">Total (₦10/item)</span>
                    <span className="text-xl font-black text-foreground">₦{grandTotalNaira.toLocaleString()}</span>
                  </div>

                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full h-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl"
                  >
                    {isSubmitting ? 'Placing Order...' : `Place Order (₦${grandTotalNaira})`}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground">
                    *Stock will NOT decrement until the chef confirms and starts.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Active Order Tracker Tab */
            <div className="space-y-6">
              {activeOrder ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className={`p-5 rounded-2xl border ${
                    activeOrder.status === 'awaiting_chef'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : activeOrder.status === 'preparing'
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                      : activeOrder.status === 'ten_min_warning'
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 animate-pulse'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider">
                            Order #{activeOrder.id}
                          </span>
                          <Badge variant="outline" className="capitalize font-bold text-xs">
                            {activeOrder.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-extrabold text-foreground mt-1">
                          {activeOrder.status === 'awaiting_chef' && '⏳ Waiting for Chef Confirmation'}
                          {activeOrder.status === 'preparing' && '👨‍🍳 Kitchen is Preparing Your Meal'}
                          {activeOrder.status === 'ten_min_warning' && '⏱️ 10 Minutes Remaining — Get Ready!'}
                          {activeOrder.status === 'ready' && '🎉 Order Ready for Pickup / Table Service!'}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activeOrder.status === 'awaiting_chef' && 'Order safely recorded in Firestore backend. Stock will deduct once chef taps "Start".'}
                          {activeOrder.status === 'preparing' && 'Chef confirmed. Fixed 25-min timer is running.'}
                          {activeOrder.status === 'ten_min_warning' && 'Kitchen countdown has crossed 10 minutes remaining. Prep is finishing up!'}
                          {activeOrder.status === 'ready' && 'Freshly made and ready to enjoy.'}
                        </p>
                      </div>

                      {/* Live Timer Display */}
                      {activeOrder.timerEndsAt && activeOrder.status !== 'ready' && (
                        <div className="bg-background/80 p-3 rounded-xl border border-border/80 text-center min-w-[130px]">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                            Time Left
                          </span>
                          <span className="text-2xl font-black font-mono tracking-tight text-primary">
                            {remainingTimeText || 'Calculating...'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 4-Step Visual Progress Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[
                      { step: '1', title: 'Placed', active: true, done: true },
                      { step: '2', title: 'Chef Review', active: activeOrder.status === 'awaiting_chef', done: activeOrder.status !== 'awaiting_chef' },
                      { step: '3', title: 'Cooking', active: activeOrder.status === 'preparing' || activeOrder.status === 'ten_min_warning', done: activeOrder.status === 'ready' },
                      { step: '4', title: 'Ready', active: activeOrder.status === 'ready', done: activeOrder.status === 'ready' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          item.done 
                            ? 'bg-primary text-primary-foreground' 
                            : item.active 
                            ? 'bg-amber-500 text-black animate-pulse' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {item.done ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                        </div>
                        <span className="text-[11px] font-bold text-foreground mt-1.5">{item.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Order Details & Items Card */}
                  <div className="bg-muted/30 p-4 rounded-xl border border-border/60 space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-border/40 pb-2">
                      <span className="text-muted-foreground">Destination / Table: <strong className="text-foreground">{activeOrder.tableNumber}</strong></span>
                      <span className="text-muted-foreground">Customer: <strong className="text-foreground">{activeOrder.customerName}</strong></span>
                      <span className="text-muted-foreground">Total: <strong className="text-primary font-bold">₦{activeOrder.totalAmount.toLocaleString()}</strong></span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-mono">Items In This Order:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeOrder.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-background rounded-lg border border-border/40 text-xs">
                            <span className="font-semibold text-foreground">{it.name}</span>
                            <span className="font-mono text-primary font-bold">x{it.quantity} (₦{it.quantity * 10})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Testing Actions for User Verification */}
                  <div className="bg-card p-4 rounded-xl border border-primary/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-primary font-mono">
                        🛠️ Instant Verification & Chef Testing Actions:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {activeOrder.status === 'awaiting_chef' && (
                        <Button 
                          onClick={handleTestChefStart}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-lg"
                        >
                          <ChefHat className="w-4 h-4 mr-1.5" />
                          Simulate Chef: Confirm & Start Prep (Decrements Stock)
                        </Button>
                      )}

                      {(activeOrder.status === 'preparing' || activeOrder.status === 'awaiting_chef') && (
                        <Button 
                          onClick={handleTestTrigger10Min}
                          variant="outline"
                          className="border-amber-500 text-amber-500 hover:bg-amber-500/10 font-bold text-xs h-9 rounded-lg"
                        >
                          <AlertTriangle className="w-4 h-4 mr-1.5" />
                          Test 10-Minute Warning Notification Now
                        </Button>
                      )}

                      <Button 
                        onClick={() => orderService.markOrderReady(activeOrder.id)}
                        variant="secondary"
                        className="font-bold text-xs h-9 rounded-lg"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        Mark Order Ready
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <p className="text-sm">No active orders right now.</p>
                  <Button onClick={() => setActiveTab('create')} size="sm">Create an Order (₦10/item)</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default QuickOrderModal;
