import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cmsApi } from '@/services/cmsApi';
import { orderService, CustomerOrder, playAlertSound } from '@/services/orderService';
import { ProductItem } from '@/data/productsCatalog';
import { ProductEditorModal } from './ProductEditorModal';

import { sheetsSync } from '@/services/sheetsSync';
import { getActiveConsumerUser } from '@/services/userService';
import { 
  ChefHat, 
  Search, 
  Plus, 
  Minus, 
  Edit3, 
  ShoppingBag, 
  Timer, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Package, 
  FileSpreadsheet, 
  Upload, 
  Download,
  Trash2,
  RefreshCw,
  Box,
  Percent,
  Globe,
  Users,
  DollarSign,
  TrendingUp,
  Utensils,
  Store,
  Gamepad2,
  Wine,
  Droplets,
  Layers,
  ExternalLink
} from 'lucide-react';

const getCategoryIcon = (catName: string) => {
  const norm = (catName || '').toLowerCase();
  if (norm.includes('bread') || norm.includes('bake') || norm.includes('pastr') || norm.includes('cake')) return ChefHat;
  if (norm.includes('starter') || norm.includes('main') || norm.includes('signat') || norm.includes('dessert')) return Utensils;
  if (norm.includes('drink') || norm.includes('beverag') || norm.includes('cocktail') || norm.includes('wine') || norm.includes('spirit')) return Wine;
  if (norm.includes('water') || norm.includes('dispenser') || norm.includes('bottle')) return Droplets;
  if (norm.includes('game') || norm.includes('vr') || norm.includes('console') || norm.includes('arcade')) return Gamepad2;
  if (norm.includes('pantry') || norm.includes('produce') || norm.includes('dairy') || norm.includes('household') || norm.includes('grocer')) return Store;
  return Layers;
};
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface DivisionConfig {
  id: 'bakery' | 'dining' | 'market' | 'games' | 'lounge' | 'water';
  name: string;
  subtitle: string;
  tagline: string;
  icon: string;
  categories: string[];
}

const DIVISION_CONFIGS: Record<string, DivisionConfig> = {
  bakery: {
    id: 'bakery',
    name: 'Bakery & Pastries',
    subtitle: 'Fresh Breads, Croissants, Artisan Cakes & Pastries',
    tagline: 'Artisan bakehouse offering daily oven-fresh breads, viennoiserie, and celebration cakes.',
    icon: '🥖',
    categories: ['All', 'Bread', 'Pastries', 'Cakes', 'Artisan Specials', 'Savory Bakes']
  },
  dining: {
    id: 'dining',
    name: 'Dining & Restaurant',
    subtitle: 'Local Heritage, Nigerian Classics & Artisanal Dining',
    tagline: 'Authentic Nigerian dining featuring grilled proteins, smoky jollof, slow-simmered soups, and natural swallows.',
    icon: '🍽️',
    categories: ['All', 'Proteins & Grills', 'The Rice Core', 'Soups & Natural Swallows', 'Yam & Pasta', 'Starters & Sides', 'Drinks & Cellar']
  },
  market: {
    id: 'market',
    name: 'Supermarket & Groceries',
    subtitle: 'Fresh Produce, Pantry Staples, Dairy & Household',
    tagline: 'Complete grocery market offering premium ingredients, staples, snacks, and chilled provisions.',
    icon: '🛒',
    categories: ['All', 'Pantry', 'Produce', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Household']
  },
  games: {
    id: 'games',
    name: 'Arcade & Gaming Arena',
    subtitle: 'Hourly Passes, VR Experiences, Consoles & Table Games',
    tagline: 'Interactive entertainment center featuring virtual reality, console arenas, arcade coins, and billiards.',
    icon: '🎮',
    categories: ['All', 'Hourly Passes', 'VR Experiences', 'Console Gaming', 'Arcade Coins', 'Table Games']
  },
  lounge: {
    id: 'lounge',
    name: 'Lounge & Cocktail Bar',
    subtitle: 'Signature Cocktails, Fine Wines, Spirits & Tapas',
    tagline: 'Relaxed evening sanctuary with handcrafted cocktails, cellar wines, and curated light fare.',
    icon: '🍸',
    categories: ['All', 'Cocktails', 'Wine & Champagne', 'Spirits', 'Small Plates']
  },
  water: {
    id: 'water',
    name: 'Pure Table Water',
    subtitle: 'Spring Water Bottles, Refill Dispensers & Bulk Packs',
    tagline: 'Multi-stage reverse osmosis water in premium portable bottles and commercial dispensers.',
    icon: '💧',
    categories: ['All', 'Bottled Water', 'Water Dispensers', 'Bulk Packs', 'Accessories']
  }
};

const METRIC_CONFIGS: Record<string, { title: string; unit: string; icon: React.ElementType }> = {
  games: { title: 'SESSIONS BOOKED TODAY', unit: 'sessions', icon: Gamepad2 },
  market: { title: 'ITEMS SOLD TODAY', unit: 'items', icon: ShoppingBag },
  water: { title: 'WATER DELIVERIES TODAY', unit: 'orders', icon: Droplets },
  lounge: { title: 'GUESTS SERVED TODAY', unit: 'guests', icon: Wine },
  bakery: { title: 'BAKES & PASTRIES SOLD', unit: 'bakes', icon: ChefHat },
  dining: { title: 'DISHES SERVED TODAY', unit: 'dishes', icon: Utensils },
};

const OPERATIONS_CONFIGS: Record<string, { title: string; subtitle: string }> = {
  games: { title: 'Arcade Queue', subtitle: 'Live gaming passes & VR station status' },
  market: { title: 'Orders', subtitle: 'Live counter dispatch & shelf pickup queue' },
  water: { title: 'Orders', subtitle: 'Live Orders, Dispenser Refills, and Delivery Schedules' },
  lounge: { title: 'Bar Orders & Lounge Tabs', subtitle: 'Live drink orders & table requests' },
  bakery: { title: 'Orders', subtitle: 'Live orders, prep timers & chef confirmations' },
  dining: { title: 'Orders', subtitle: 'Live orders, prep timers & chef confirmations' },
};

const CATALOG_CONFIGS: Record<string, { addButton: string; catalogTitle: string; stockLabel: string }> = {
  games: { addButton: 'Add Game / Pass', catalogTitle: 'Arcade & VR Catalog', stockLabel: 'Available Passes' },
  market: { addButton: 'Add Product', catalogTitle: 'Grocery Catalog', stockLabel: 'Pantry Stock On Hand' },
  water: { addButton: 'Add Water Product', catalogTitle: 'Water & Dispenser Catalog', stockLabel: 'Factory Stock' },
  lounge: { addButton: 'Add Drink / Bottle', catalogTitle: 'Lounge & Bar Catalog', stockLabel: 'Cellar Stock' },
  bakery: { addButton: 'Add Item', catalogTitle: 'Bakery Catalog', stockLabel: 'Stock On Ground' },
  dining: { addButton: 'Add Item', catalogTitle: 'Dining Catalog', stockLabel: 'Stock On Ground' },
};

export default function DivisionCatalogView({ divisionId }: { divisionId: 'bakery' | 'dining' | 'market' | 'games' | 'lounge' | 'water' }) {
  const config = DIVISION_CONFIGS[divisionId] || DIVISION_CONFIGS.bakery;
  const metricConfig = METRIC_CONFIGS[divisionId] || METRIC_CONFIGS.bakery;
  const operationsConfig = OPERATIONS_CONFIGS[divisionId] || OPERATIONS_CONFIGS.bakery;
  const catalogConfig = CATALOG_CONFIGS[divisionId] || CATALOG_CONFIGS.bakery;
  const MetricIcon = metricConfig.icon;

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Full Item Editor / Creator Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  // Quick Order Modal State
  const [orderingItem, setOrderingItem] = useState<ProductItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderCustomerName, setOrderCustomerName] = useState(getActiveConsumerUser()?.name || '');
  const [orderPhone, setOrderPhone] = useState(getActiveConsumerUser()?.phone || '');
  const [orderTable, setOrderTable] = useState('Table 1');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Excel / CSV File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Products & Orders
  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordersList] = await Promise.all([
        cmsApi.getProducts(),
        orderService.getOrders()
      ]);

      const divisionProducts = prodRes.products.filter(
        (p: any) => p.division?.toLowerCase() === divisionId.toLowerCase()
      );
      setProducts(divisionProducts);
      setOrders(ordersList);
    } catch (err) {
      console.error('Error loading division data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(async () => {
      try {
        const freshOrders = await orderService.getOrders();
        setOrders(freshOrders);
      } catch (e) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [divisionId]);

  // Sync consumer details when user changes
  useEffect(() => {
    const handleUserChanged = (e: any) => {
      if (e.detail) {
        setOrderCustomerName(e.detail.name);
        setOrderPhone(e.detail.phone);
      }
    };
    window.addEventListener('orient_consumer_user_changed', handleUserChanged);
    return () => window.removeEventListener('orient_consumer_user_changed', handleUserChanged);
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Active Orders for chef display - STRICT DIVISION ISOLATION
  const activeOrders = useMemo(() => {
    return orders.filter(o => {
      if (o.status === 'completed' || o.status === 'cancelled') return false;

      const orderDiv = (o as any).division || o.items[0]?.division;
      if (orderDiv) {
        return orderDiv.toLowerCase() === divisionId.toLowerCase();
      }

      const matchesSku = o.items.some(it => {
        const id = (it.id || '').toUpperCase();
        if (divisionId === 'dining') return id.startsWith('PRD-DIN') || id.startsWith('PRD-D') || id.includes('DINING');
        if (divisionId === 'bakery') return id.startsWith('PRD-B') || id.includes('BAKERY');
        if (divisionId === 'market') return id.startsWith('PRD-M') || id.startsWith('PRD-S') || id.includes('MARKET');
        if (divisionId === 'games') return id.startsWith('PRD-G') || id.includes('GAME');
        if (divisionId === 'lounge') return id.startsWith('PRD-L') || id.includes('LOUNGE');
        if (divisionId === 'water') return id.startsWith('PRD-W') || id.includes('WATER');
        return false;
      });

      return matchesSku;
    });
  }, [orders, divisionId]);

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      await orderService.deleteOrder(orderId);
      toast({
        title: 'Order Deleted',
        description: `Order #${orderId} has been permanently deleted.`,
      });
      loadData();
    }
  };

  // Quick stock adjuster
  const handleQuickStockChange = async (item: ProductItem, delta: number) => {
    const newStock = Math.max(0, (item.stock || 0) + delta);
    setProducts(prev => prev.map(p => p.id === item.id ? { ...p, stock: newStock } : p));
    try {
      await cmsApi.updateStock(item.id, newStock);
      toast({
        title: 'Stock Updated',
        description: `${item.name} stock changed to ${newStock} units.`,
      });
    } catch (err) {
      loadData();
    }
  };

  // Open Full Editor for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  // Open Full Editor for Edit
  const handleOpenEditModal = (item: ProductItem) => {
    setEditingProduct(item);
    setIsEditorOpen(true);
  };

  // Callback when item saved
  const handleProductSaved = (saved: ProductItem) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === saved.id);
      if (exists) {
        return prev.map(p => p.id === saved.id ? saved : p);
      } else {
        return [saved, ...prev];
      }
    });
  };

  // Callback when item deleted
  const handleProductDeleted = (deletedId: string) => {
    setProducts(prev => prev.filter(p => p.id !== deletedId));
  };

  // 1-Click Export to Excel / CSV
  const handleExportCSV = () => {
    sheetsSync.exportToCSV(products, `orient_${divisionId}_catalog.csv`);
    toast({
      title: 'Catalog Exported! 📊',
      description: `Downloaded ${products.length} ${config.name} items formatted for Excel and Google Sheets.`,
    });
  };

  // Import from Excel / CSV
  const handleImportCSVFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = sheetsSync.parseCSV(text);
        if (parsed.length === 0) {
          toast({
            title: 'No Items Found',
            description: 'The CSV did not contain recognizable product rows.',
            variant: 'destructive'
          });
          return;
        }

        toast({
          title: 'Importing Items...',
          description: `Processing ${parsed.length} rows into Firestore database.`,
        });

        for (const item of parsed) {
          if (item.id) {
            await cmsApi.updateProduct(item.id, { ...item, division: divisionId });
          } else {
            await cmsApi.createProduct({ ...item, division: divisionId });
          }
        }

        toast({
          title: 'Import Complete! 🎉',
          description: `Successfully synchronized ${parsed.length} items from sheet.`,
        });
        loadData();
      } catch (err) {
        toast({
          title: 'Import Error',
          description: 'Failed to parse sheet file.',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Place Quick Order
  const handlePlaceOrder = async () => {
    if (!orderingItem) return;
    setSubmittingOrder(true);
    try {
      const activeConsumer = getActiveConsumerUser();
      const prepDuration = orderingItem.prepTimeMinutes || 15;

      const placed = await orderService.placeOrder({
        customerId: activeConsumer?.id,
        customerName: orderCustomerName.trim() || activeConsumer?.name || 'Guest User',
        customerPhone: orderPhone.trim() || activeConsumer?.phone || '+234 800 000 0000',
        customerEmail: activeConsumer?.email,
        shippingAddress: `${config.name} (${orderTable})`,
        tableNumber: orderTable,
        items: [
          {
            id: orderingItem.id,
            name: orderingItem.name,
            quantity: orderQuantity,
            price: 10,
            division: divisionId,
            category: orderingItem.category,
            image: orderingItem.image
          }
        ],
        prepDurationMinutes: prepDuration
      });

      toast({
        title: 'Order Placed! 🛒',
        description: `Order #${placed.id} placed for ${orderQuantity}x ${orderingItem.name} at ₦10 each (Total: ₦${placed.totalAmount}). Status: Waiting for Chef. Stock is NOT decremented yet.`,
      });

      setOrderingItem(null);
      const freshOrders = await orderService.getOrders();
      setOrders(freshOrders);
    } catch (err) {
      toast({
        title: 'Order Failed',
        description: 'Could not place order.',
        variant: 'destructive'
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Chef Confirm and Start
  const handleChefConfirm = async (orderId: string) => {
    try {
      await orderService.confirmAndStartOrder(orderId, 11);
      toast({
        title: '👨‍🍳 Chef Confirmed & Started!',
        description: `Order #${orderId} is now preparing! Countdown timer running. Stock has auto-decremented.`,
      });
      loadData();
    } catch (err) {
      toast({
        title: 'Confirmation Error',
        description: 'Could not confirm order.',
        variant: 'destructive'
      });
    }
  };

  // Chef: Test 10-Minute Warning (Call to attention)
  const handleTestWarning = async (orderId: string) => {
    try {
      await orderService.sendTenMinuteWarning(orderId);
      toast({
        title: '⚠️ 10-Minute Warning Dispatched!',
        description: `Sent alert to customer for Order #${orderId}: '10 minutes left until ready!'`,
      });
      const freshOrders = await orderService.getOrders();
      setOrders(freshOrders);
    } catch (e) {
      toast({
        title: 'Alert Failed',
        description: 'Could not send 10-min warning alert.',
        variant: 'destructive'
      });
    }
  };

  // Chef: Mark Ready (Positive outcome)
  const handleChefReady = async (orderId: string) => {
    try {
      await orderService.markOrderReady(orderId);
      toast({
        title: '🎉 Order Marked Ready!',
        description: `Order #${orderId} is ready for customer pickup!`,
      });
      const freshOrders = await orderService.getOrders();
      setOrders(freshOrders);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not mark order ready.',
        variant: 'destructive'
      });
    }
  };

  // Manual metrics override state
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [manualMetrics, setManualMetrics] = useState<{
    dishesToday?: number;
    revenue?: number;
    onlineOrders?: number;
    walkInOrders?: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(`orient_metrics_${divisionId}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`orient_metrics_${divisionId}`);
      setManualMetrics(saved ? JSON.parse(saved) : {});
    } catch (e) {}
  }, [divisionId]);

  const saveManualMetrics = (updates: { dishesToday?: number; revenue?: number; onlineOrders?: number; walkInOrders?: number }) => {
    setManualMetrics(updates);
    try {
      localStorage.setItem(`orient_metrics_${divisionId}`, JSON.stringify(updates));
      toast({ title: 'Metrics Updated! 📊', description: 'Dashboard live metrics updated successfully.' });
    } catch (e) {}
    setIsMetricsModalOpen(false);
  };

  // Calculated live statistics for this division (defaults to 0 for new site)
  const totalDishesToday = useMemo(() => {
    if (manualMetrics.dishesToday !== undefined) return manualMetrics.dishesToday;
    return orders.reduce((sum, ord) => sum + ord.items.reduce((iSum, item) => iSum + item.quantity, 0), 0);
  }, [orders, manualMetrics.dishesToday]);

  const onlineOrdersCount = useMemo(() => {
    if (manualMetrics.onlineOrders !== undefined) return manualMetrics.onlineOrders;
    return orders.filter(o => o.shippingAddress && o.shippingAddress !== 'In-Store Walk-in').length;
  }, [orders, manualMetrics.onlineOrders]);

  const walkInOrdersCount = useMemo(() => {
    if (manualMetrics.walkInOrders !== undefined) return manualMetrics.walkInOrders;
    return orders.filter(o => o.shippingAddress === 'In-Store Walk-in').length;
  }, [orders, manualMetrics.walkInOrders]);

  const takeawayCount = useMemo(() => Math.round(totalDishesToday * 0.38), [totalDishesToday]);
  const dineInCount = useMemo(() => totalDishesToday - takeawayCount, [totalDishesToday, takeawayCount]);

  const todayRevenue = useMemo(() => {
    if (manualMetrics.revenue !== undefined) return manualMetrics.revenue;
    return orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  }, [orders, manualMetrics.revenue]);

  const weeklySalesData = useMemo(() => [
    { day: 'Mon', sales: Math.round(todayRevenue * 0.7) },
    { day: 'Tue', sales: Math.round(todayRevenue * 0.8) },
    { day: 'Wed', sales: Math.round(todayRevenue * 0.85) },
    { day: 'Thu', sales: Math.round(todayRevenue * 0.9) },
    { day: 'Fri', sales: todayRevenue },
    { day: 'Sat', sales: Math.round(todayRevenue * 1.1) },
    { day: 'Sun', sales: Math.round(todayRevenue * 1.05) },
  ], [todayRevenue]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 px-2 sm:px-4">
      {/* 1. Page Header (Clean title with direct link to public restaurant menu) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl">{config.icon}</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {config.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsMetricsModalOpen(true)}
            className="text-xs font-bold gap-1.5 border-border/60 hover:bg-muted shrink-0 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-primary" />
            Edit Live Metrics
          </Button>

          {divisionId === 'dining' && (
            <Button
              size="sm"
              onClick={() => window.dispatchEvent(new CustomEvent('orient:navigate', { detail: 'dining' }))}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 border-none shadow-xs shrink-0 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5 text-white" />
              Open Public Restaurant Menu
            </Button>
          )}
        </div>
      </div>

      {/* 2. FIRST ROW: Statistics Grid (3 Columns: Dishes+Staff, Revenue+Chart, Quick Actions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Column 1: Combined Dishes Served Today + Staff On Duty Today (Width: col-span-5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-card shadow-xs flex flex-col justify-between space-y-3">
          {/* Section A: Dishes / Items Served Today */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">{metricConfig.title}</span>
                <span className="text-2xl font-extrabold text-foreground font-mono mt-0.5 block">
                  {totalDishesToday} <span className="text-xs font-normal text-muted-foreground">{metricConfig.unit}</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 text-foreground">
                <MetricIcon className="w-5 h-5" />
              </div>
            </div>

            {/* Sub-breakdown 1: Online/Phone vs Walk-In (Hidden for Games & Lounge) */}
            {!['games', 'lounge'].includes(divisionId) && (
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                    <Globe className="w-3 h-3 text-muted-foreground" />
                    <span>Online / Phone</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {onlineOrdersCount}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span>Walk-In</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-foreground">
                    {walkInOrdersCount}
                  </span>
                </div>
              </div>
            )}

            {/* Sub-breakdown 2: Takeaways vs Dine-In (Hidden for Supermarket, Water, Bakery, Games) */}
            {!['market', 'water', 'bakery', 'games'].includes(divisionId) && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-0.5">
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-[#f8fafc] dark:bg-slate-800/40">
                  <span className="text-muted-foreground text-[11px]">Takeaways:</span>
                  <span className="font-mono font-bold text-foreground">{takeawayCount}</span>
                </div>
                <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-[#f8fafc] dark:bg-slate-800/40">
                  <span className="text-muted-foreground text-[11px]">Dine-In:</span>
                  <span className="font-mono font-bold text-foreground">{dineInCount}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section B: Staff On Duty Today */}
          <div className="pt-2 border-t border-border/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Staff On Duty Today</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#f8fafc] dark:bg-slate-800/50">
                <span className="font-semibold text-foreground truncate max-w-[90px]">Chijioke A.</span>
                <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">Chef</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#f8fafc] dark:bg-slate-800/50">
                <span className="font-semibold text-foreground truncate max-w-[90px]">Mary N.</span>
                <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">Supervisor</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#f8fafc] dark:bg-slate-800/50">
                <span className="font-semibold text-foreground truncate max-w-[90px]">Amina B.</span>
                <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">Clerk</span>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#f8fafc] dark:bg-slate-800/50">
                <span className="font-semibold text-foreground truncate max-w-[90px]">Kelvin T.</span>
                <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">Barista</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Revenue Made Today + Weekly Sales Chart (Width: col-span-5) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-card shadow-xs flex flex-col justify-between space-y-3">
          {/* Top of Cell: Revenue Made Today */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Revenue Made Today</span>
              <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 text-foreground flex items-center justify-center min-w-9 h-9">
                <span className="text-base font-extrabold font-mono text-foreground">₦</span>
              </div>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-2">
              <div>
                <span className="text-2xl font-extrabold font-mono text-foreground block">
                  ₦{todayRevenue.toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+14.2% vs last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom of Cell: Progression of Weekly Sales Chart */}
          <div className="pt-2 border-t border-border/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Weekly Sales Progression</span>
            </div>
            <div className="h-28 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklySalesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="weeklySalesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'currentColor' }} 
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: 'currentColor' }} 
                    className="text-muted-foreground"
                    tickFormatter={(val) => `₦${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                    width={42}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white px-2 py-1 rounded text-[10px] shadow-md font-mono">
                            ₦{Number(payload[0].value).toLocaleString()}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="currentColor" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#weeklySalesGradient)" 
                    className="text-foreground"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Column 3: Quick Actions Column (Width: col-span-2) */}
        <div className="lg:col-span-2 p-3.5 rounded-2xl bg-card shadow-xs flex flex-col justify-between space-y-2">
          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/30">
            Actions
          </div>

          {/* Action 1: Add New Item */}
          <Button
            id="btn-add-new-item"
            size="sm"
            onClick={handleOpenCreateModal}
            className="w-full h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 transition-colors duration-200 border-none shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{catalogConfig.addButton}</span>
          </Button>

          {/* Action 2: Export */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExportCSV}
            title="Download Excel / CSV sheet"
            className="w-full h-8 bg-[#f8fafc] dark:bg-slate-800 text-foreground transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-xs gap-1.5 font-semibold border-none"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export</span>
          </Button>

          {/* Action 3: Import */}
          <label
            htmlFor="csv-upload-input"
            title="Import items from Excel or Google Sheets CSV"
            className="w-full h-8 px-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 text-foreground transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 cursor-pointer text-xs font-semibold flex items-center justify-center gap-1.5 border-none"
          >
            <Upload className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Import</span>
            <input
              id="csv-upload-input"
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleImportCSVFile}
              className="hidden"
            />
          </label>

          {/* Action 4: Google Sheets Link (Completely Transparent Background, Green Text) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => sheetsSync.openGoogleSheet()}
            title="Open connected Google Sheet"
            className="w-full h-8 text-xs font-semibold bg-transparent hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors duration-200 gap-1.5 border-none shadow-none"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Google Sheet</span>
            <ExternalLink className="w-2.5 h-2.5 text-emerald-600/70 dark:text-emerald-400/70" />
          </Button>
        </div>

      </div>

      {/* 3. SECOND ROW: Split into 2 Columns (Left: Notifications & Recent Activity, Right: Kitchen & Chef Station Orders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left Column: Notifications & Recent Activity */}
        <div className="bg-card rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/30">
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-100 dark:bg-slate-800 text-foreground p-2 rounded-xl">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Notifications & Recent Activity</h2>
                <p className="text-[11px] text-muted-foreground">Live operational log for {config.name}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/50 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-foreground block">Stock Replenished</span>
                <span className="text-muted-foreground text-[11px] block mt-0.5">Added 12 units to current department inventory.</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">8m ago</span>
            </div>

            <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/50 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-foreground block">Chef Confirmation Logged</span>
                <span className="text-muted-foreground text-[11px] block mt-0.5">Order #ORD-102 confirmed and prep timer started.</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">18m ago</span>
            </div>

            <div className="p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/50 flex items-start justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-foreground block">Sheet Catalog Synchronized</span>
                <span className="text-muted-foreground text-[11px] block mt-0.5">Connected Google Sheet synchronized with catalog items.</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono shrink-0">42m ago</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground flex justify-end">
            <span className="text-foreground font-semibold">4 Entries Today</span>
          </div>
        </div>

        {/* Right Column: Orders */}
        <div className="bg-card rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/30">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#f8fafc] dark:bg-slate-800 text-foreground p-2 rounded-xl">
                <ChefHat className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-foreground">{operationsConfig.title}</h2>
                  {activeOrders.length > 0 && (
                    <Badge className="bg-foreground text-background text-[10px] font-bold px-2 py-0.5 border-none">
                      {activeOrders.length} Active Queue
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{operationsConfig.subtitle}</p>
              </div>
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-8 bg-[#f8fafc] dark:bg-slate-800/40 rounded-xl p-4">
              <ShoppingBag className="w-7 h-7 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">No active orders in queue</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Orders appear here automatically when customer transactions occur.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {activeOrders.map((order) => {
                const isAwaitingChef = order.status === 'awaiting_chef';
                const isPreparing = order.status === 'preparing' || order.status === 'ten_min_warning';
                const isReady = order.status === 'ready';
                const isWarning = order.status === 'ten_min_warning';

                let remainingText = '';
                if (order.timerEndsAt) {
                  const msLeft = Math.max(0, order.timerEndsAt - Date.now());
                  const mins = Math.floor(msLeft / 60000);
                  const secs = Math.floor((msLeft % 60000) / 1000);
                  remainingText = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
                }

                return (
                  <div 
                    key={order.id} 
                    className={`p-3.5 rounded-xl border-none bg-[#f8fafc] dark:bg-slate-800/80 space-y-2.5 transition-colors duration-200`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-foreground">#{order.id}</span>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{order.customerName}</p>
                        <p className="text-[10px] text-muted-foreground">{order.customerPhone} • {order.shippingAddress || 'Store'}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge 
                          className={`text-[9px] font-bold uppercase border-none ${
                            isReady ? 'bg-emerald-600 text-white' :
                            isWarning ? 'bg-red-600 text-white' :
                            isAwaitingChef ? 'bg-orange-500 text-white' :
                            'bg-orange-600 text-white'
                          }`}
                        >
                          {isReady ? 'Ready' : isWarning ? '10m Alert' : isAwaitingChef ? 'Awaiting Chef' : 'Preparing'}
                        </Badge>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer rounded-md hover:bg-red-500/10"
                          title="Delete order permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-card p-2 rounded-lg text-xs space-y-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-foreground font-medium text-[11px]">
                          <span>{it.quantity}x {it.name}</span>
                          <span className="text-muted-foreground font-mono">₦{it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {isAwaitingChef && (
                      <div className="bg-amber-500/10 p-2 rounded-lg border-none text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Timer Status:</span>
                        </div>
                        <span className="font-mono font-bold text-amber-900 dark:text-amber-100 text-xs">
                          Starts On Confirmation
                        </span>
                      </div>
                    )}

                    {isPreparing && (
                      <div className="bg-orange-500/10 p-2 rounded-lg border-none text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-300 font-semibold text-[11px]">
                          <Timer className="w-3.5 h-3.5 animate-spin text-orange-500" />
                          <span>Timer:</span>
                        </div>
                        <span className="font-mono font-bold text-orange-900 dark:text-orange-100 text-xs">
                          {remainingText || `${order.prepDurationMinutes || 15}m`}
                        </span>
                      </div>
                    )}

                    <div className="pt-1 flex flex-col gap-1.5">
                      {isAwaitingChef && (
                        <div className="grid grid-cols-2 gap-1.5">
                          <Button
                            id={`btn-chef-confirm-${order.id}`}
                            size="sm"
                            onClick={() => handleChefConfirm(order.id)}
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 border-none transition-colors duration-200"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            Confirm & Start
                          </Button>
                          <Button
                            id={`btn-mark-ready-early-${order.id}`}
                            size="sm"
                            onClick={() => handleChefReady(order.id)}
                            className="h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1 border-none transition-colors duration-200"
                            title="Mark order ready early before starting timer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Ready
                          </Button>
                        </div>
                      )}

                      {isPreparing && (
                        <div className="grid grid-cols-2 gap-1.5">
                          <Button
                            id={`btn-test-10m-${order.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestWarning(order.id)}
                            className="text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 gap-1 h-7 border-none transition-colors duration-200"
                          >
                            <Bell className="w-3 h-3" />
                            10m Alert
                          </Button>
                          <Button
                            id={`btn-mark-ready-${order.id}`}
                            size="sm"
                            onClick={() => handleChefReady(order.id)}
                            className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-7 border-none transition-colors duration-200"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Mark Ready
                          </Button>
                        </div>
                      )}

                      <Button
                        id={`btn-finish-payment-${order.id}`}
                        size="sm"
                        onClick={() => {
                          orderService.updateOrderStatus(order.id, 'completed').then(() => {
                            toast({
                              title: "Order Completed & Payment Confirmed",
                              description: `Order #${order.id} is marked as ready and payment is confirmed.`
                            });
                            loadData();
                          });
                        }}
                        className="w-full text-xs font-bold h-8 bg-emerald-700 hover:bg-emerald-800 text-white border-none transition-colors duration-200 gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Finish Order (Payment Confirmed)
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 4. THIRD ROW: Inventory Grid & SKU Catalog */}
      <div className="space-y-4 pt-4 border-t border-border/30">
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          {/* Dynamic Category Tabs with Category Icons on the LEFT hand side */}
          <div className="flex flex-wrap items-center gap-2">
            {config.categories.map(cat => {
              const count = cat === 'All' 
                ? products.length 
                : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;

              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              const CategoryIcon = getCategoryIcon(cat);

              return (
                <button
                  key={cat}
                  id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors duration-200 flex items-center gap-2 border-none cursor-pointer ${
                    isSelected 
                      ? 'bg-foreground text-background font-bold' 
                      : 'bg-[#f8fafc] dark:bg-slate-800 text-muted-foreground hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-foreground'
                  }`}
                >
                  <CategoryIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-background' : 'text-muted-foreground'}`} />
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-background/20 text-background' : 'bg-background text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative flex items-center w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 text-muted-foreground pointer-events-none z-10 shrink-0" />
            <Input 
              id="input-search-division-products"
              placeholder={`Search ${config.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9 bg-[#f8fafc] dark:bg-[#1a1a1a] border-none shadow-2xs focus-visible:ring-foreground w-full"
            />
          </div>
        </div>

        {/* 4. Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <RefreshCw className="w-8 h-8 animate-spin text-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border/30 rounded-2xl p-8">
            <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-base font-semibold text-foreground">No items in this category</h3>
            <p className="text-xs text-muted-foreground mt-1">Add your first item using the button below or reset filters.</p>
            <div className="flex justify-center gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="text-xs"
              >
                Reset Filters
              </Button>
              <Button 
                size="sm" 
                onClick={handleOpenCreateModal}
                className="bg-foreground hover:bg-foreground/90 text-background text-xs gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item) => {
              const isOutOfStock = (item.stock ?? 5) === 0;

              return (
                <div 
                  key={item.id}
                  id={`item-card-${item.id}`}
                  className="group bg-card rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between border-none"
                >
                  {/* TOP HALF: IMAGE */}
                  <div className="relative h-44 w-full bg-muted overflow-hidden">
                    <img 
                      src={item.image || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80"}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300"
                    />
                    {/* Top Left Corner: Category Tag */}
                    <div className="absolute top-2.5 left-2.5">
                      <Badge className="bg-slate-900/80 text-white backdrop-blur-md text-[10px] font-semibold border-none px-2.5 py-0.5 rounded-full shadow-2xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* BOTTOM HALF: DETAILS */}
                  <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    {/* Top Row: Item Name & Edit Icon in Top Right of Bottom Half */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-foreground truncate">
                          {item.name}
                        </h3>
                        <button
                          id={`btn-edit-${item.id}`}
                          onClick={() => handleOpenEditModal(item)}
                          className="text-orange-500 hover:text-orange-600 p-1 rounded-md transition-colors shrink-0"
                          title="Edit item details"
                        >
                          <Edit3 className="w-4 h-4 text-orange-500 font-bold" />
                        </button>
                      </div>

                      {/* Immediately under Item Name: Short Description */}
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                        {item.description || 'Premium item crafted with care.'}
                      </p>
                    </div>

                    {/* Immediately under Short Description: Prep Time & Quantity Controls */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border/20">
                      {['dining', 'bakery'].includes(divisionId) ? (
                        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>{item.prepTimeMinutes || 15}m prep</span>
                        </div>
                      ) : <div />}

                      {/* Quantity Controls (Just minus, number, plus; no 'Stock on ground' label) */}
                      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                          id={`btn-stock-dec-${item.id}`}
                          onClick={() => handleQuickStockChange(item, -1)}
                          disabled={isOutOfStock}
                          className="w-5 h-5 rounded flex items-center justify-center bg-card hover:bg-background text-foreground disabled:opacity-40 shadow-2xs"
                          title="Decrement stock"
                        >
                          <Minus className="w-3 h-3 text-foreground" />
                        </button>
                        <span className="w-5 text-center font-bold text-foreground font-mono text-xs">
                          {item.stock ?? 5}
                        </span>
                        <button
                          id={`btn-stock-inc-${item.id}`}
                          onClick={() => handleQuickStockChange(item, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center bg-card hover:bg-background text-foreground shadow-2xs"
                          title="Increment stock"
                        >
                          <Plus className="w-3 h-3 text-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Last Thing at Bottom: Bold Price (50% bigger) */}
                    <div className="pt-2 border-t border-border/20 flex items-center justify-between">
                      <span className="text-xl font-extrabold text-foreground font-mono">
                        ₦{item.price || 10}
                      </span>
                      {isOutOfStock && (
                        <span className="text-[10px] font-semibold text-red-500 uppercase">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Order Dialog */}
      <Dialog open={!!orderingItem} onOpenChange={(open) => !open && setOrderingItem(null)}>
        <DialogContent className="sm:max-w-md border-orange-500/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
              Item Details: {orderingItem?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Catalog item specification and live stock levels.
            </DialogDescription>
          </DialogHeader>

          {orderingItem && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-orange-500/20">
                <img 
                  src={orderingItem.image || (orderingItem.images && orderingItem.images[0]) || "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=200&q=80"}
                  alt={orderingItem.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div>
                  <h4 className="font-bold text-sm text-foreground">{orderingItem.name}</h4>
                  <Badge variant="outline" className="text-[10px] mt-0.5">{orderingItem.category}</Badge>
                  <p className="text-xs font-semibold text-emerald-600 mt-1">₦{orderingItem.price || 10} each</p>
                </div>
              </div>

              {/* Customer Switcher Hint */}
              <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold block text-orange-950 dark:text-orange-200">Ordering as Customer:</span>
                  <span className="text-[11px] text-muted-foreground">{orderCustomerName} ({orderPhone})</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-orange-600">Nigeria +234</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="order-customer" className="text-xs font-semibold">Customer Name</Label>
                  <Input 
                    id="order-customer"
                    value={orderCustomerName}
                    onChange={(e) => setOrderCustomerName(e.target.value)}
                    className="text-xs h-9 border-orange-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="order-table" className="text-xs font-semibold">Table / Room</Label>
                  <Input 
                    id="order-table"
                    value={orderTable}
                    onChange={(e) => setOrderTable(e.target.value)}
                    className="text-xs h-9 border-orange-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOrderQuantity(q => Math.max(1, q - 1))}
                    className="h-8 w-8 p-0 border-orange-500/30 text-orange-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="font-mono font-bold text-sm text-foreground w-8 text-center">{orderQuantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOrderQuantity(q => Math.min(orderingItem.stock || 5, q + 1))}
                    className="h-8 w-8 p-0 border-orange-500/30 text-orange-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground ml-auto font-medium">
                    Total: <span className="font-bold text-emerald-600 font-mono text-sm">₦{orderQuantity * (orderingItem.price || 10)}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setOrderingItem(null)}
              className="text-xs"
            >
              Cancel
            </Button>
            {/* Green button for positive order placement */}
            <Button
              id="btn-confirm-place-order"
              size="sm"
              onClick={handlePlaceOrder}
              disabled={submittingOrder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
            >
              {submittingOrder ? 'Placing Order...' : `Confirm Order (₦${orderQuantity * (orderingItem?.price || 10)})`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT METRICS MODAL DIALOG */}
      <Dialog open={isMetricsModalOpen} onOpenChange={setIsMetricsModalOpen}>
        <DialogContent className="max-w-md p-6 bg-card border-border/40 shadow-2xl rounded-2xl space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-primary" />
              Edit Live Metrics ({config.name})
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Manually adjust performance metrics for this division. Leave blank to rely on live calculations.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const dishesVal = form.elements.namedItem('dishesToday') as HTMLInputElement;
            const revVal = form.elements.namedItem('revenue') as HTMLInputElement;
            const onlineVal = form.elements.namedItem('onlineOrders') as HTMLInputElement;
            const walkVal = form.elements.namedItem('walkInOrders') as HTMLInputElement;

            saveManualMetrics({
              dishesToday: dishesVal.value !== '' ? Number(dishesVal.value) : undefined,
              revenue: revVal.value !== '' ? Number(revVal.value) : undefined,
              onlineOrders: onlineVal.value !== '' ? Number(onlineVal.value) : undefined,
              walkInOrders: walkVal.value !== '' ? Number(walkVal.value) : undefined,
            });
          }} className="space-y-3.5 pt-2">

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                {metricConfig.title}
              </label>
              <input 
                name="dishesToday"
                type="number" 
                defaultValue={manualMetrics.dishesToday ?? totalDishesToday}
                min="0"
                className="w-full h-10 px-3 rounded-xl border border-border/60 bg-transparent text-foreground text-sm font-mono font-bold"
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Today's Sales Revenue (₦)
              </label>
              <input 
                name="revenue"
                type="number" 
                defaultValue={manualMetrics.revenue ?? todayRevenue}
                min="0"
                className="w-full h-10 px-3 rounded-xl border border-border/60 bg-transparent text-foreground text-sm font-mono font-bold"
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Online Orders
                </label>
                <input 
                  name="onlineOrders"
                  type="number" 
                  defaultValue={manualMetrics.onlineOrders ?? onlineOrdersCount}
                  min="0"
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-transparent text-foreground text-sm font-mono font-bold"
                  placeholder="0"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Walk-In Orders
                </label>
                <input 
                  name="walkInOrders"
                  type="number" 
                  defaultValue={manualMetrics.walkInOrders ?? walkInOrdersCount}
                  min="0"
                  className="w-full h-10 px-3 rounded-xl border border-border/60 bg-transparent text-foreground text-sm font-mono font-bold"
                  placeholder="0"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-3 border-t border-border/30">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  saveManualMetrics({});
                  toast({ title: 'Metrics Reset', description: 'Metrics reset to live data state.' });
                }}
                className="text-xs font-medium text-muted-foreground"
              >
                Reset to Zero / Live
              </Button>
              <Button 
                type="submit" 
                size="sm" 
                className="bg-primary text-primary-foreground font-bold text-xs"
              >
                Save Metrics
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Comprehensive Item Creator & Editor Modal */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        productToEdit={editingProduct}
        defaultDivision={divisionId}
        onProductSaved={handleProductSaved}
        onProductDeleted={handleProductDeleted}
      />
    </div>
  );
}
