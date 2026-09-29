import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cmsApi } from '@/services/cmsApi';
import { orderService, CustomerOrder, AppNotification, playAlertSound, getDisplayStatus, isDeliveryOrder } from '@/services/orderService';
import { ProductItem } from '@/data/productsCatalog';

const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return 'Just now';
  try {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    if (isNaN(diffMs)) return 'Just now';
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    return `${diffDays}d ago`;
  } catch (e) {
    return 'Just now';
  }
};
import { ProductEditorModal } from './ProductEditorModal';
import OrderDetailsModal from './OrderDetailsModal';
import GoogleSheetModal from './GoogleSheetModal';
import { NotificationToggleButton } from '@/components/common/NotificationToggleButton';

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
  ExternalLink,
  Truck,
  MoreVertical,
  Info,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    icon: '',
    categories: ['All', 'Bread', 'Pastries', 'Cakes', 'Artisan Specials', 'Savory Bakes']
  },
  dining: {
    id: 'dining',
    name: 'Dining & Restaurant',
    subtitle: 'Local Heritage, Nigerian Classics & Artisanal Dining',
    tagline: 'Authentic Nigerian dining featuring grilled proteins, smoky jollof, slow-simmered soups, and natural swallows.',
    icon: '',
    categories: ['All', 'Proteins & Grills', 'The Rice Core', 'Soups & Natural Swallows', 'Yam & Pasta', 'Starters & Sides', 'Drinks & Cellar']
  },
  market: {
    id: 'market',
    name: 'Supermarket & Groceries',
    subtitle: 'Fresh Produce, Pantry Staples, Dairy & Household',
    tagline: 'Complete grocery market offering premium ingredients, staples, snacks, and chilled provisions.',
    icon: '',
    categories: ['All', 'Pantry', 'Produce', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Household']
  },
  games: {
    id: 'games',
    name: 'Arcade & Gaming Arena',
    subtitle: 'Hourly Passes, VR Experiences, Consoles & Table Games',
    tagline: 'Interactive entertainment center featuring virtual reality, console arenas, arcade coins, and billiards.',
    icon: '',
    categories: ['All', 'Hourly Passes', 'VR Experiences', 'Console Gaming', 'Arcade Coins', 'Table Games']
  },
  lounge: {
    id: 'lounge',
    name: 'Lounge & Cocktail Bar',
    subtitle: 'Signature Cocktails, Fine Wines, Spirits & Tapas',
    tagline: 'Relaxed evening sanctuary with handcrafted cocktails, cellar wines, and curated light fare.',
    icon: '',
    categories: ['All', 'Cocktails', 'Wine & Champagne', 'Spirits', 'Small Plates']
  },
  water: {
    id: 'water',
    name: 'Pure Table Water',
    subtitle: 'Spring Water Bottles, Refill Dispensers & Bulk Packs',
    tagline: 'Multi-stage reverse osmosis water in premium portable bottles and commercial dispensers.',
    icon: '',
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
  const [liveNotifications, setLiveNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Full Item Editor / Creator Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  
  // Details Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);

  const handleOpenDetailsModal = (item: ProductItem) => {
    setViewingProduct(item);
    setIsDetailsOpen(true);
  };


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

  // Subscribe to Live Firestore Notifications & Activity Stream
  useEffect(() => {
    orderService.getNotifications().then(notifs => {
      if (Array.isArray(notifs)) setLiveNotifications(notifs);
    });

    const unsubscribe = orderService.subscribeToNotifications(notifs => {
      if (Array.isArray(notifs)) setLiveNotifications(notifs);
    });

    const handleNewNotif = (e: any) => {
      if (e.detail) {
        setLiveNotifications(prev => [e.detail, ...prev.filter(n => n.id !== e.detail.id)]);
      }
    };
    window.addEventListener('orient_new_notification', handleNewNotif);

    return () => {
      unsubscribe();
      window.removeEventListener('orient_new_notification', handleNewNotif);
    };
  }, []);

  // Filter notifications specifically for this division
  const divisionNotifications = useMemo(() => {
    const divKey = (divisionId || 'dining').toLowerCase();
    return liveNotifications.filter(n => {
      if (n.division) {
        const nd = n.division.toLowerCase();
        if (divKey === 'dining') return nd.includes('dining') || nd.includes('rest') || nd.includes('ozzie');
        if (divKey === 'bakery') return nd.includes('bakery') || nd.includes('bake');
        if (divKey === 'water') return nd.includes('water') || nd.includes('orville');
        if (divKey === 'games') return nd.includes('game');
        if (divKey === 'market') return nd.includes('market') || nd.includes('super');
        if (divKey === 'lounge') return nd.includes('lounge');
        return nd === divKey;
      }
      if (n.orderId) {
        const matched = orders.find(o => o.id === n.orderId || o.orderId === n.orderId);
        if (matched) {
          const od = (matched.division || '').toLowerCase();
          return od.includes(divKey) || (divKey === 'dining' && (od.includes('rest') || od.includes('dining')));
        }
      }
      return true;
    }).slice(0, 15);
  }, [liveNotifications, divisionId, orders]);

  const entriesTodayCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return divisionNotifications.filter(n => {
      try {
        return new Date(n.createdAt).toDateString() === todayStr;
      } catch (e) {
        return true;
      }
    }).length;
  }, [divisionNotifications]);

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

  // Chef order status filter (Default to 'current' as requested)
  const [chefOrderFilter, setChefOrderFilter] = useState<'current' | 'all' | 'pending' | 'cooking' | 'ready' | 'in_transit' | 'completed'>('current');
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<CustomerOrder | null>(null);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Division Orders for chef display - STRICT DIVISION ISOLATION
  const divisionOrders = useMemo(() => {
    return orders.filter(o => {
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

  const activeOrders = useMemo(() => {
    return divisionOrders.filter(o => {
      const s = getDisplayStatus(o.status);
      return s !== 'Completed' && s !== 'Cancelled';
    });
  }, [divisionOrders]);

  const displayedChefOrders = useMemo(() => {
    if (chefOrderFilter === 'current') {
      return divisionOrders.filter(o => {
        const s = getDisplayStatus(o.status);
        return s !== 'Completed' && s !== 'Cancelled';
      });
    }
    if (chefOrderFilter === 'all') return divisionOrders;
    return divisionOrders.filter(o => {
      const s = getDisplayStatus(o.status).toLowerCase().replace(/ /g, '_');
      return s === chefOrderFilter;
    });
  }, [divisionOrders, chefOrderFilter]);

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
      title: 'Catalog Exported!',
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
          title: 'Import Complete!',
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
        title: 'Order Placed!',
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
        title: 'Chef Confirmed & Started!',
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
        title: '10-Minute Warning Dispatched!',
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
        title: 'Order Marked Ready!',
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

  // Chef: Mark In Transit (For delivery takeaway orders)
  const handleChefInTransit = async (orderId: string) => {
    try {
      await orderService.markOrderInTransit(orderId);
      toast({
        title: 'Order Dispatched & In Transit!',
        description: `Order #${orderId} has been marked In Transit. Customer will confirm receipt!`,
      });
      const freshOrders = await orderService.getOrders();
      setOrders(freshOrders);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Could not mark order in transit.',
        variant: 'destructive'
      });
    }
  };

  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadData();
      toast({
        title: 'Live Data Refreshed',
        description: 'Orders, inventory, and revenue synchronized from database.'
      });
    } catch (e) {
      toast({
        title: 'Refresh Error',
        description: 'Could not refresh data from database.',
        variant: 'destructive'
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
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
      toast({ title: 'Metrics Updated!', description: 'Dashboard live metrics updated successfully.' });
    } catch (e) {}
    setIsMetricsModalOpen(false);
  };

  // Helper: check if a timestamp or date string is TODAY
  const isToday = (dateValue: any) => {
    if (!dateValue) return false;
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return false;
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  };

  // Real live orders created TODAY for this division (strictly from Firestore)
  const todayDivisionOrders = useMemo(() => {
    return divisionOrders.filter(o => {
      const d = (o as any).placedDate || o.createdAt;
      return isToday(d);
    });
  }, [divisionOrders]);

  const totalOrdersToday = useMemo(() => {
    if (manualMetrics.dishesToday !== undefined) return manualMetrics.dishesToday;
    return todayDivisionOrders.length;
  }, [todayDivisionOrders, manualMetrics.dishesToday]);

  const todayDineInOrders = useMemo(() => {
    return todayDivisionOrders.filter(o => o.destination === 'dine-in' || o.orderType === 'dine-in');
  }, [todayDivisionOrders]);

  const todayTakeawayOrders = useMemo(() => {
    return todayDivisionOrders.filter(o => o.destination === 'takeaway' || o.orderType === 'takeaway');
  }, [todayDivisionOrders]);

  const todayPickupOrders = useMemo(() => {
    return todayDivisionOrders.filter(
      o => o.deliveryMethod === 'pickup' || ((o.destination === 'takeaway' || o.orderType === 'takeaway') && o.deliveryMethod !== 'delivery')
    );
  }, [todayDivisionOrders]);

  const todayDeliveryOrders = useMemo(() => {
    return todayDivisionOrders.filter(o => o.deliveryMethod === 'delivery');
  }, [todayDivisionOrders]);

  const todayRevenue = useMemo(() => {
    if (manualMetrics.revenue !== undefined) return manualMetrics.revenue;
    return todayDivisionOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [todayDivisionOrders, manualMetrics.revenue]);

  const todayDineInRevenue = useMemo(() => {
    return todayDineInOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [todayDineInOrders]);

  const todayTakeawayRevenue = useMemo(() => {
    return todayTakeawayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [todayTakeawayOrders]);

  const todayPickupRevenue = useMemo(() => {
    return todayPickupOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [todayPickupOrders]);

  const todayDeliveryRevenue = useMemo(() => {
    return todayDeliveryOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [todayDeliveryOrders]);

  const onlineOrdersCount = useMemo(() => {
    if (manualMetrics.onlineOrders !== undefined) return manualMetrics.onlineOrders;
    return todayDivisionOrders.filter(o => o.shippingAddress && o.shippingAddress !== 'In-Store Walk-in').length;
  }, [todayDivisionOrders, manualMetrics.onlineOrders]);

  const walkInOrdersCount = useMemo(() => {
    if (manualMetrics.walkInOrders !== undefined) return manualMetrics.walkInOrders;
    return todayDivisionOrders.filter(o => o.shippingAddress === 'In-Store Walk-in').length;
  }, [todayDivisionOrders, manualMetrics.walkInOrders]);

  // Analytics graph state
  const [analyticsMetric, setAnalyticsMetric] = React.useState<'orders' | 'revenue'>('orders');
  const [isMetricDropdownOpen, setIsMetricDropdownOpen] = React.useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = React.useState<'day' | 'week' | 'month' | 'year'>('week');
  const [analyticsPickerOpen, setAnalyticsPickerOpen] = React.useState(false);
  const [analyticsSelectedDay, setAnalyticsSelectedDay] = React.useState<Date>(new Date());
  const [analyticsSelectedWeekMonday, setAnalyticsSelectedWeekMonday] = React.useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.getFullYear(), now.getMonth(), diff);
  });
  const [analyticsSelectedMonth, setAnalyticsSelectedMonth] = React.useState<Date>(new Date());
  const [analyticsSelectedYear, setAnalyticsSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [analyticsCalendarView, setAnalyticsCalendarView] = React.useState<Date>(new Date());

  // Helper: format Date as YYYY-MM-DD
  const formatYMD = (d: Date) => {
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  };

  // Helper: get Monday of any date
  const getMondayOf = (d: Date) => {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.getFullYear(), date.getMonth(), diff);
  };

  // Helper: get all Monday-to-Sunday weeks for a given month
  const getWeeksForMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const weeks: { weekNum: number; start: Date; end: Date; label: string }[] = [];
    
    let curMonday = getMondayOf(firstDay);
    let count = 1;
    while (curMonday <= lastDay) {
      const curSunday = new Date(curMonday.getFullYear(), curMonday.getMonth(), curMonday.getDate() + 6);
      weeks.push({
        weekNum: count,
        start: new Date(curMonday),
        end: new Date(curSunday),
        label: `Week ${count}`
      });
      curMonday = new Date(curMonday.getFullYear(), curMonday.getMonth(), curMonday.getDate() + 7);
      count++;
    }
    return weeks;
  };

  // Compute chart data from live divisionOrders
  const analyticsChartData = React.useMemo(() => {
    // 1. DAY VIEW: 24 Hours (12am .. 11pm)
    if (analyticsPeriod === 'day') {
      const targetStr = formatYMD(analyticsSelectedDay);
      return Array.from({ length: 24 }, (_, h) => {
        const label = h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : (h - 12) + 'pm';
        const dayOrders = divisionOrders.filter(o => {
          const d = o.createdAt ? new Date(o.createdAt) : null;
          return d && formatYMD(d) === targetStr && d.getHours() === h;
        });
        return {
          label,
          fullDate: `${label} (${analyticsSelectedDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})`,
          value: analyticsMetric === 'orders' ? dayOrders.length : dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
        };
      });
    }

    // 2. WEEKLY VIEW: Days of that week (Monday to Sunday)
    if (analyticsPeriod === 'week') {
      const monday = analyticsSelectedWeekMonday;
      const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return Array.from({ length: 7 }, (_, i) => {
        const curDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        const curYMD = formatYMD(curDate);
        const dayOrders = divisionOrders.filter(o => {
          const d = (o as any).placedDate || (o.createdAt ? formatYMD(new Date(o.createdAt)) : null);
          return d === curYMD;
        });
        return {
          label: dayNames[i],
          fullDate: `${dayNames[i]} ${curDate.getDate()} ${curDate.toLocaleString('default', { month: 'short' })}`,
          value: analyticsMetric === 'orders' ? dayOrders.length : dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
        };
      });
    }

    // 3. MONTHLY VIEW: 4 or 5 weeks in that month (Monday to Sunday)
    if (analyticsPeriod === 'month') {
      const yr = analyticsSelectedMonth.getFullYear();
      const mo = analyticsSelectedMonth.getMonth();
      const weeks = getWeeksForMonth(yr, mo);
      return weeks.map(w => {
        const startStr = formatYMD(w.start);
        const endStr = formatYMD(w.end);
        const weekOrders = divisionOrders.filter(o => {
          const d = (o as any).placedDate || (o.createdAt ? formatYMD(new Date(o.createdAt)) : null);
          return d && d >= startStr && d <= endStr;
        });
        return {
          label: w.label,
          fullDate: `${w.label} (${w.start.getDate()} ${w.start.toLocaleString('default', { month: 'short' })} - ${w.end.getDate()} ${w.end.toLocaleString('default', { month: 'short' })})`,
          value: analyticsMetric === 'orders' ? weekOrders.length : weekOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
        };
      });
    }

    // 4. YEARLY VIEW: 12 months of the year
    const yr = analyticsSelectedYear;
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return monthNames.map((m, idx) => {
      const monthOrders = divisionOrders.filter(o => {
        const d = o.createdAt ? new Date(o.createdAt) : null;
        return d && d.getFullYear() === yr && d.getMonth() === idx;
      });
      return {
        label: m,
        fullDate: `${m} ${yr}`,
        value: analyticsMetric === 'orders' ? monthOrders.length : monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
      };
    });
  }, [divisionOrders, analyticsPeriod, analyticsMetric, analyticsSelectedDay, analyticsSelectedWeekMonday, analyticsSelectedMonth, analyticsSelectedYear]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-20 px-2 sm:px-4">
      {/* 1. Page Header (Clean title with direct link to public restaurant menu) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-3">
          {/* icon removed */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {config.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="text-xs font-semibold gap-1.5 border-border/60 hover:bg-muted shrink-0 cursor-pointer shadow-2xs"
            title="Refresh live data from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>

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

      {/* 2. FIRST ROW: 3 Analytics Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch mb-4">
          {/* Box 1: Orders */}
          <div className="p-4 rounded-2xl bg-card shadow-xs flex flex-col justify-between space-y-3 border border-border/10">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Total Orders</span>
                <span className="text-2xl font-extrabold text-foreground font-mono mt-0.5 block">
                  {totalOrdersToday} <span className="text-xs font-normal text-muted-foreground">orders</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 text-foreground">
                <Box className="w-5 h-5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Dine-in</span>
                <span className="text-sm font-bold font-mono text-foreground">{todayDineInOrders.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Takeaway</span>
                <span className="text-sm font-bold font-mono text-foreground">{todayTakeawayOrders.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Pickup</span>
                <span className="text-sm font-bold font-mono text-foreground">{todayPickupOrders.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Delivery</span>
                <span className="text-sm font-bold font-mono text-foreground">{todayDeliveryOrders.length}</span>
              </div>
            </div>
          </div>

          {/* Box 2: Revenue */}
          <div className="p-4 rounded-2xl bg-card shadow-xs flex flex-col justify-between space-y-3 border border-border/10">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/30">
              <div>
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider block">Total Revenue</span>
                <span className="text-2xl font-extrabold text-foreground font-mono mt-0.5 block">
                  ₦{todayRevenue.toLocaleString()}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800 text-foreground text-xl font-bold flex items-center justify-center min-w-9 h-9">
                ₦
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Dine-in</span>
                <span className="text-sm font-bold font-mono text-foreground">₦{todayDineInRevenue.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Takeaway</span>
                <span className="text-sm font-bold font-mono text-foreground">₦{todayTakeawayRevenue.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Pickup</span>
                <span className="text-sm font-bold font-mono text-foreground">₦{todayPickupRevenue.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium">Delivery</span>
                <span className="text-sm font-bold font-mono text-foreground">₦{todayDeliveryRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Box 3: Graph */}
          <div className="p-4 rounded-2xl bg-card shadow-xs flex flex-col space-y-2 border border-border/10 relative">
            <div className="flex items-center justify-between pb-1 gap-2 flex-wrap">
              {/* Custom Styled Metric Dropdown (Orders / Revenue) */}
              <div className="relative">
                <button
                  type="button"
                  id="btn-analytics-metric"
                  onClick={() => setIsMetricDropdownOpen(v => !v)}
                  className="flex items-center gap-1.5 bg-[#f8fafc] dark:bg-slate-800 text-foreground text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-border/40 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs"
                >
                  <span className="capitalize">{analyticsMetric}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-150 ${isMetricDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMetricDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsMetricDropdownOpen(false)} />
                    <div className="absolute left-0 top-9 z-50 min-w-[120px] bg-card border border-border/50 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100">
                      <button
                        type="button"
                        onClick={() => { setAnalyticsMetric('orders'); setIsMetricDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${analyticsMetric === 'orders' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold' : 'text-foreground hover:bg-muted/70'}`}
                      >
                        <span>Orders</span>
                        {analyticsMetric === 'orders' && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAnalyticsMetric('revenue'); setIsMetricDropdownOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${analyticsMetric === 'revenue' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold' : 'text-foreground hover:bg-muted/70'}`}
                      >
                        <span>Revenue</span>
                        {analyticsMetric === 'revenue' && <Check className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Granularity Tabs: Day | Week | Month | Year */}
                <div className="flex items-center bg-[#f8fafc] dark:bg-slate-800 rounded-xl p-0.5 gap-0.5 border border-border/20">
                  {(['day', 'week', 'month', 'year'] as const).map(p => (
                    <button
                      key={p}
                      id={`btn-analytics-period-${p}`}
                      onClick={() => { setAnalyticsPeriod(p); setAnalyticsPickerOpen(false); }}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize transition-all cursor-pointer border-none ${analyticsPeriod === p ? 'bg-foreground text-background shadow-2xs' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Filter Trigger Button */}
                <button
                  type="button"
                  id="btn-analytics-calendar-trigger"
                  onClick={() => setAnalyticsPickerOpen(o => !o)}
                  className="text-[10px] font-semibold bg-[#f8fafc] dark:bg-slate-800 text-foreground px-2.5 py-1.5 rounded-xl border border-border/40 outline-none cursor-pointer hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all whitespace-nowrap shadow-2xs"
                >
                  {analyticsPeriod === 'day'
                    ? analyticsSelectedDay.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : analyticsPeriod === 'week'
                    ? `${analyticsSelectedWeekMonday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${new Date(analyticsSelectedWeekMonday.getFullYear(), analyticsSelectedWeekMonday.getMonth(), analyticsSelectedWeekMonday.getDate() + 6).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                    : analyticsPeriod === 'month'
                    ? analyticsSelectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
                    : analyticsSelectedYear.toString()}
                </button>
              </div>
            </div>

            {/* Custom Aesthetic Filter Popup */}
            {analyticsPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAnalyticsPickerOpen(false)} />
                <div className="absolute right-3 top-[56px] z-50 bg-card border border-border/50 rounded-2xl shadow-2xl p-4 w-[250px] animate-in fade-in zoom-in-95 duration-100">
                  {/* Day Picker */}
                  {analyticsPeriod === 'day' && (() => {
                    const yr = analyticsCalendarView.getFullYear();
                    const mo = analyticsCalendarView.getMonth();
                    const fd = new Date(yr, mo, 1).getDay();
                    const dim = new Date(yr, mo + 1, 0).getDate();
                    const off = fd === 0 ? 6 : fd - 1;
                    const cells = Array.from({ length: off + dim }, (_, i) => i < off ? null : i - off + 1);
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2 pb-1 border-b border-border/30">
                          <button onClick={() => setAnalyticsCalendarView(new Date(yr, mo - 1, 1))} className="p-1 rounded-lg hover:bg-muted cursor-pointer border-none text-foreground font-bold flex items-center justify-center">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-foreground">{analyticsCalendarView.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                          <button onClick={() => setAnalyticsCalendarView(new Date(yr, mo + 1, 1))} className="p-1 rounded-lg hover:bg-muted cursor-pointer border-none text-foreground font-bold flex items-center justify-center">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                          {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-[8px] text-muted-foreground text-center font-bold">{d}</span>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                          {cells.map((d, i) => {
                            if (!d) return <span key={i} />;
                            const isSel = analyticsSelectedDay.getDate() === d && analyticsSelectedDay.getMonth() === mo && analyticsSelectedDay.getFullYear() === yr;
                            const isNow = new Date().getDate() === d && new Date().getMonth() === mo && new Date().getFullYear() === yr;
                            return (
                              <button
                                key={i}
                                onClick={() => { setAnalyticsSelectedDay(new Date(yr, mo, d)); setAnalyticsPickerOpen(false); }}
                                className={`text-[10px] w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none transition-colors ${isSel ? 'bg-foreground text-background font-bold' : isNow ? 'bg-orange-500/20 text-orange-600 font-bold' : 'hover:bg-muted text-foreground'}`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}

                  {/* Week Picker */}
                  {analyticsPeriod === 'week' && (() => {
                    const yr = analyticsCalendarView.getFullYear();
                    const mo = analyticsCalendarView.getMonth();
                    const weeks = getWeeksForMonth(yr, mo);
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2 pb-1 border-b border-border/30">
                          <button onClick={() => setAnalyticsCalendarView(new Date(yr, mo - 1, 1))} className="p-1 rounded-lg hover:bg-muted cursor-pointer border-none text-foreground font-bold flex items-center justify-center">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-foreground">{analyticsCalendarView.toLocaleString('default', { month: 'short', year: 'numeric' })}</span>
                          <button onClick={() => setAnalyticsCalendarView(new Date(yr, mo + 1, 1))} className="p-1 rounded-lg hover:bg-muted cursor-pointer border-none text-foreground font-bold flex items-center justify-center">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          {weeks.map(w => {
                            const isSel = formatYMD(w.start) === formatYMD(analyticsSelectedWeekMonday);
                            return (
                              <button
                                key={w.weekNum}
                                onClick={() => { setAnalyticsSelectedWeekMonday(w.start); setAnalyticsPickerOpen(false); }}
                                className={`w-full text-left text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border-none cursor-pointer transition-colors flex items-center justify-between ${isSel ? 'bg-foreground text-background' : 'bg-muted/40 hover:bg-muted text-foreground'}`}
                              >
                                <span>{w.label}</span>
                                <span className="opacity-70 font-normal text-[10px]">
                                  {w.start.getDate()} {w.start.toLocaleString('default', { month: 'short' })} - {w.end.getDate()} {w.end.toLocaleString('default', { month: 'short' })}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}

                  {/* Month Picker */}
                  {analyticsPeriod === 'month' && (() => {
                    const yr = analyticsCalendarView.getFullYear();
                    return (
                      <>
                        <div className="flex items-center justify-between mb-2 pb-1 border-b border-border/30">
                          <button onClick={() => setAnalyticsCalendarView(new Date(yr - 1, 0, 1))} className="p-1 rounded-lg hover:bg-muted cursor-pointer border-none text-foreground font-bold flex items-center justify-center">
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="text-xs font-bold text-foreground">{yr}</span>
                          <button onClick={() => setAnalyticsCalendarView(new Date(yr + 1, 0, 1))} className="p-1 rounded-lg hover:bg-muted cursor-pointer border-none text-foreground font-bold flex items-center justify-center">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, idx) => {
                            const isSel = analyticsSelectedMonth.getMonth() === idx && analyticsSelectedMonth.getFullYear() === yr;
                            return (
                              <button
                                key={m}
                                onClick={() => { setAnalyticsSelectedMonth(new Date(yr, idx, 1)); setAnalyticsPickerOpen(false); }}
                                className={`text-[11px] font-semibold py-1.5 rounded-xl border-none cursor-pointer transition-colors ${isSel ? 'bg-foreground text-background font-bold' : 'bg-muted/40 hover:bg-muted text-foreground'}`}
                              >
                                {m}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}

                  {/* Year Picker */}
                  {analyticsPeriod === 'year' && (() => {
                    const currentYr = new Date().getFullYear();
                    const years = [currentYr - 2, currentYr - 1, currentYr, currentYr + 1];
                    return (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-foreground mb-2 pb-1 border-b border-border/30">Select Year</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {years.map(y => {
                            const isSel = analyticsSelectedYear === y;
                            return (
                              <button
                                key={y}
                                onClick={() => { setAnalyticsSelectedYear(y); setAnalyticsPickerOpen(false); }}
                                className={`text-xs font-bold py-2 rounded-xl border-none cursor-pointer transition-colors ${isSel ? 'bg-foreground text-background' : 'bg-muted/40 hover:bg-muted text-foreground'}`}
                              >
                                {y}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            )}

            {/* Recharts Area Chart */}
            <div className="h-[150px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsChartData} margin={{ top: 8, right: 6, left: 0, bottom: 2 }}>
                  <defs>
                    <linearGradient id="box3Gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.12} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-muted-foreground font-medium"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: 'currentColor' }}
                    className="text-muted-foreground font-medium"
                    width={analyticsMetric === 'revenue' ? 44 : 26}
                    tickFormatter={(val) =>
                      analyticsMetric === 'revenue'
                        ? `₦${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`
                        : `${val}`
                    }
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        const val = item.value as number;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl font-mono border border-slate-700">
                            <div className="text-slate-400 text-[11px] mb-0.5">{item.fullDate || item.label}</div>
                            <div className="font-bold text-sm">
                              {analyticsMetric === 'revenue' ? `₦${val.toLocaleString()}` : `${val} orders`}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#box3Gradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Action Buttons Row: Add Item, Export, and Google Sheet */}
        <div className="flex items-center gap-3 mb-6 mt-2 flex-wrap">
          <Button size="sm" onClick={handleOpenCreateModal} className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1.5 transition-colors duration-200 border-none shadow-2xs cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> <span>{catalogConfig.addButton}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleExportCSV} className="bg-[#f8fafc] dark:bg-slate-800 text-foreground transition-colors hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-xs gap-1.5 font-semibold border-none cursor-pointer">
            <Download className="w-3.5 h-3.5 text-muted-foreground" /> <span>Export</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsSheetsModalOpen(true)} 
            className="bg-[#f8fafc] dark:bg-slate-800 text-foreground transition-colors hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-xs gap-1.5 font-semibold border-none cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> <span>Google Sheet</span>
          </Button>
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

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[260px] pr-1">
            {divisionNotifications.length === 0 ? (
              <div className="py-8 px-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/40 text-center text-muted-foreground my-auto">
                <Bell className="w-5 h-5 mx-auto mb-1.5 opacity-30 text-muted-foreground" />
                <p className="font-semibold text-xs text-foreground">No recent activity yet</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs mx-auto">
                  When orders are placed, confirmed, prepared, or updated in {config.name}, live operational status will stream here.
                </p>
              </div>
            ) : (
              divisionNotifications.map((notif) => {
                const isCancelled = notif.type === 'order_cancelled';
                const isReady = notif.type === 'order_ready';
                const isConfirmed = notif.type === 'order_confirmed';
                const isPlaced = notif.type === 'order_placed';
                const isReceived = notif.type === 'order_received';

                return (
                  <div 
                    key={notif.id}
                    className="p-3 rounded-xl bg-[#f8fafc] dark:bg-slate-800/50 flex items-start justify-between gap-3 text-xs border border-border/10 hover:border-border/30 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isCancelled
                              ? 'bg-red-500'
                              : isReady
                              ? 'bg-purple-500'
                              : isConfirmed
                              ? 'bg-orange-500'
                              : isReceived
                              ? 'bg-emerald-500'
                              : isPlaced
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="font-semibold text-foreground truncate block">
                          {notif.title}
                        </span>
                      </div>
                      <span className="text-muted-foreground text-[11px] block mt-0.5 leading-relaxed line-clamp-2">
                        {notif.message}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono shrink-0 pt-0.5">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-border/30 text-[11px] text-muted-foreground flex justify-between items-center">
            <span className="text-[10px] text-muted-foreground font-mono">Live Activity Stream</span>
            <span className="text-foreground font-semibold">
              {entriesTodayCount} {entriesTodayCount === 1 ? 'Entry' : 'Entries'} Today
            </span>
          </div>
        </div>

        {/* Right Column: Orders */}
        <div className="bg-card rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/30">
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

            {/* Chef Notification Toggle Button */}
            <NotificationToggleButton />
          </div>

          {/* Chef Status Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pb-1">
            {(['current', 'all', 'pending', 'cooking', 'ready', 'in_transit', 'completed'] as const).map((filterKey) => {
              const label = filterKey === 'current' ? 'Current' :
                            filterKey === 'all' ? 'All' :
                            filterKey === 'pending' ? 'Pending' :
                            filterKey === 'cooking' ? 'Cooking' :
                            filterKey === 'ready' ? 'Ready' :
                            filterKey === 'in_transit' ? 'In Transit' : 'Completed';
              const count = filterKey === 'current'
                ? divisionOrders.filter(o => {
                    const s = getDisplayStatus(o.status);
                    return s !== 'Completed' && s !== 'Cancelled';
                  }).length
                : filterKey === 'all' 
                ? divisionOrders.length 
                : divisionOrders.filter(o => getDisplayStatus(o.status).toLowerCase().replace(/ /g, '_') === filterKey).length;

              return (
                <button
                  key={filterKey}
                  onClick={() => setChefOrderFilter(filterKey)}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors font-medium capitalize cursor-pointer ${
                    chefOrderFilter === filterKey
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          {displayedChefOrders.length === 0 ? (
            <div className="text-center py-8 bg-[#f8fafc] dark:bg-slate-800/40 rounded-xl p-4">
              <ShoppingBag className="w-7 h-7 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs font-semibold text-foreground">No orders in {chefOrderFilter === 'all' ? 'queue' : chefOrderFilter.replace(/_/g, ' ')}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Orders appear here automatically when customer transactions occur.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {displayedChefOrders.map((order) => {
                const displayStatus = getDisplayStatus(order.status);
                const isPending = displayStatus === 'Pending';
                const isCooking = displayStatus === 'Cooking';
                const isReady = displayStatus === 'Ready';
                const isInTransit = displayStatus === 'In Transit';
                const isCompleted = displayStatus === 'Completed';
                const isDelivery = isDeliveryOrder(order);
                const isCustomerReceived = Boolean(order.customerReceivedAt);

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
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <span className="text-xs font-mono font-bold text-foreground">#{order.orderId || order.id}</span>
                        <p className="text-xs font-semibold text-foreground mt-0.5 truncate">{order.customerName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {order.customerPhone} | {order.destination === 'dine-in' ? `Dine-In (${order.seatNumber || order.tableNumber || 'Table'})` : (order.deliveryMethod === 'delivery' ? `Delivery: ${order.deliveryAddress || order.shippingAddress || 'Address'}` : 'Pickup')}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDetailOrder(order)}
                          className="h-7 px-2 text-[11px] font-semibold gap-1 rounded-lg border-border/50 hover:bg-muted/70 cursor-pointer shadow-2xs"
                          title="View full order details"
                        >
                          <Info className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>Details</span>
                        </Button>

                        {isDelivery && (
                          <Badge variant="outline" className="text-[9px] font-bold border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30">
                            Delivery
                          </Badge>
                        )}
                        <Badge 
                          className={`text-[9px] font-bold uppercase border-none ${
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-md hover:bg-muted/50"
                              title="Order options"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-card border border-border/50 shadow-md rounded-xl p-1 z-50">
                            <DropdownMenuItem
                              onClick={() => setSelectedDetailOrder(order)}
                              className="cursor-pointer text-xs font-semibold gap-2 py-1.5"
                            >
                              <Info className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-500/10 cursor-pointer text-xs font-semibold gap-2 py-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                              <span>Delete Order</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

                    {isPending && (
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

                    {isCooking && (
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

                    {isInTransit && (
                      <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                          <Truck className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                          <span>Delivery Status:</span>
                        </div>
                        <span className="font-bold text-blue-900 dark:text-blue-100 text-xs">
                          In Transit to Customer
                        </span>
                      </div>
                    )}

                    <div className="pt-1 flex flex-col gap-1.5">
                      {isPending && (
                        <div className="grid grid-cols-2 gap-1.5">
                          <Button
                            id={`btn-chef-confirm-${order.id}`}
                            size="sm"
                            onClick={() => handleChefConfirm(order.id)}
                            className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 border-none transition-colors duration-200"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            Confirm and Start
                          </Button>
                          <Button
                            id={`btn-mark-ready-early-${order.id}`}
                            size="sm"
                            onClick={() => handleChefReady(order.id)}
                            className="h-8 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs gap-1 border-none transition-colors duration-200"
                            title="Mark order ready early"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ready
                          </Button>
                        </div>
                      )}

                      {isCooking && (
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
                            Ready
                          </Button>
                        </div>
                      )}

                      {!isDelivery && isCooking && (
                        <Button
                          id={`btn-finish-payment-${order.id}`}
                          size="sm"
                          onClick={async () => {
                            await orderService.finishAndConfirmPayment(order.id);
                            toast({
                              title: "Order Completed & Payment Confirmed",
                              description: `Order #${order.id} is finished and payment is confirmed.`
                            });
                            loadData();
                          }}
                          className="w-full text-xs font-bold h-8 bg-emerald-700 hover:bg-emerald-800 text-white border-none transition-colors duration-200 gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Finish and Payment Confirmed
                        </Button>
                      )}

                      {/* Ready State */}
                      {isReady && (
                        <div className="space-y-1.5">
                          {isDelivery ? (
                            /* Delivery orders must be marked In Transit */
                            <Button
                              id={`btn-chef-intransit-${order.id}`}
                              size="sm"
                              onClick={() => handleChefInTransit(order.id)}
                              className="w-full text-xs font-bold h-8 bg-blue-600 hover:bg-blue-700 text-white border-none transition-colors duration-200 gap-1.5 shadow-sm"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              In Transit
                            </Button>
                          ) : (
                            /* Non-delivery orders go straight to Finish & Confirm Payment */
                            <Button
                              id={`btn-finish-payment-${order.id}`}
                              size="sm"
                              onClick={async () => {
                                await orderService.finishAndConfirmPayment(order.id);
                                toast({
                                  title: "Order Completed & Payment Confirmed",
                                  description: `Order #${order.id} is finished and payment is confirmed.`
                                });
                                loadData();
                              }}
                              className="w-full text-xs font-bold h-8 bg-emerald-700 hover:bg-emerald-800 text-white border-none transition-colors duration-200 gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Finish and Payment Confirmed
                            </Button>
                          )}
                        </div>
                      )}

                      {/* In Transit State (Delivery Only) */}
                      {isInTransit && (
                        <div className="space-y-1.5">
                          {isCustomerReceived ? (
                            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Customer Confirmed "Received"</span>
                              </div>
                              <span className="text-[10px] text-emerald-600 font-mono font-bold">Unlocked</span>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>Awaiting Customer to click "Received"</span>
                            </div>
                          )}

                          <Button
                            id={`btn-finish-payment-${order.id}`}
                            size="sm"
                            disabled={!isCustomerReceived}
                            onClick={async () => {
                              try {
                                await orderService.finishAndConfirmPayment(order.id);
                                toast({
                                  title: "Order Completed & Payment Confirmed",
                                  description: `Order #${order.id} is finished and payment is confirmed.`
                                });
                                loadData();
                              } catch (e: any) {
                                toast({
                                  title: "Action Locked",
                                  description: e.message || "Customer must mark Received first.",
                                  variant: "destructive"
                                });
                              }
                            }}
                            className={`w-full text-xs font-bold h-8 transition-colors duration-200 gap-1 border-none ${
                              isCustomerReceived 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                                : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                            }`}
                            title={!isCustomerReceived ? "Locked until customer clicks 'Received' on customer dashboard" : "Finish order"}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {isCustomerReceived ? 'Finish and Payment Confirmed' : 'Finish Locked (Awaiting "Received")'}
                          </Button>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Finished & Payment Confirmed</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono">Completed</span>
                        </div>
                      )}
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
        {/* Sticky & Spacious Filter Bar */}
        <div className="sticky top-[48px] sm:top-[52px] z-30 bg-background/95 backdrop-blur-md py-4 px-3 sm:px-6 -mx-2 sm:-mx-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3.5 sm:gap-4 border-b border-border/30 shadow-xs rounded-2xl">
          {/* Dynamic Category Tabs with Category Icons on the LEFT hand side */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-2 border-none cursor-pointer shadow-2xs ${
                    isSelected 
                      ? 'bg-foreground text-background font-bold shadow-xs scale-[1.02]' 
                      : 'bg-[#f8fafc] dark:bg-slate-800/80 text-muted-foreground hover:bg-slate-200/90 dark:hover:bg-slate-700/90 hover:text-foreground'
                  }`}
                >
                  <CategoryIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-background' : 'text-muted-foreground'}`} />
                  <span>{cat}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSelected ? 'bg-background/25 text-background' : 'bg-background text-muted-foreground'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative flex items-center w-full sm:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 text-muted-foreground pointer-events-none z-10 shrink-0" />
            <Input 
              id="input-search-division-products"
              placeholder={`Search ${config.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs h-10 bg-[#f8fafc] dark:bg-slate-800/80 border border-border/30 shadow-2xs focus-visible:ring-foreground rounded-xl w-full"
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
                        <div className="flex items-center gap-1">
                          <button
                            id={`btn-details-${item.id}`}
                            onClick={() => handleOpenDetailsModal(item)}
                            className="text-blue-500 hover:text-blue-600 p-1 rounded-md transition-colors shrink-0"
                            title="View item details"
                          >
                            <Info className="w-4 h-4 text-blue-500 font-bold" />
                          </button>
                          <button
                            id={`btn-edit-${item.id}`}
                            onClick={() => handleOpenEditModal(item)}
                            className="text-orange-500 hover:text-orange-600 p-1 rounded-md transition-colors shrink-0"
                            title="Edit item details"
                          >
                            <Edit3 className="w-4 h-4 text-orange-500 font-bold" />
                          </button>
                        </div>
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
                defaultValue={manualMetrics.dishesToday ?? totalOrdersToday}
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

      {/* Order Details Modal (Responsive: Desktop modal, Mobile full-screen box with close button at bottom) */}
      <OrderDetailsModal
        order={selectedDetailOrder}
        isOpen={Boolean(selectedDetailOrder)}
        onClose={() => setSelectedDetailOrder(null)}
      />

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={(open) => !open && setIsDetailsOpen(false)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Info className="w-4 h-4 text-blue-500" />
              Item Details: {viewingProduct?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">Full catalog item specification and real-time data.</DialogDescription>
          </DialogHeader>
          {viewingProduct && (
            <div className="space-y-0.5 text-xs">
              {([
                ['Item ID', viewingProduct.id],
                ['Name', viewingProduct.name],
                ['Division', viewingProduct.division],
                ['Category', viewingProduct.category],
                ['Price', `\u20a6${viewingProduct.price}`],
                ['Cost of Production', viewingProduct.cost_of_production ? `\u20a6${viewingProduct.cost_of_production}` : 'N/A'],
                ['Gross Margin', viewingProduct.cost_of_production ? `\u20a6${viewingProduct.price - viewingProduct.cost_of_production} (${Math.round(((viewingProduct.price - viewingProduct.cost_of_production) / viewingProduct.price) * 100)}%)` : 'N/A'],
                ['Unit', viewingProduct.unit],
                ['Unit of Measure', viewingProduct.unit_of_measure || 'N/A'],
                ['Stock', `${viewingProduct.stock ?? 5} units`],
                ['Min Stock Alert', viewingProduct.minimum_stock_threshold ? `${viewingProduct.minimum_stock_threshold} units` : 'N/A'],
                ['Status', viewingProduct.status],
                ['Prep Time', viewingProduct.prepTimeMinutes ? `${viewingProduct.prepTimeMinutes} mins` : 'N/A'],
                ['Description', viewingProduct.description],
                ['Ingredients', viewingProduct.ingredients || 'N/A'],
                ['Suggested Pairing', viewingProduct.suggested_pairing || 'N/A'],
                ['Dietary Tags', viewingProduct.dietary_tags?.join(', ') || 'N/A'],
                ['Featured / Chef Special', viewingProduct.is_featured ? 'Yes' : 'No'],
                ['Tags', viewingProduct.tags?.join(', ') || 'N/A'],
                ['Images', viewingProduct.images?.length ? `${viewingProduct.images.length} image(s)` : viewingProduct.image ? '1 image' : 'None'],
                ['Created At', viewingProduct.createdAt || 'N/A'],
                ['Updated At', viewingProduct.updatedAt || 'N/A'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-1.5 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground font-medium shrink-0 w-40">{label}</span>
                  <span className="font-semibold text-right text-foreground break-all">{value}</span>
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="pt-3 gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsDetailsOpen(false)} className="text-xs border-none bg-muted/50">Close</Button>
            <Button size="sm" onClick={() => { setIsDetailsOpen(false); if (viewingProduct) handleOpenEditModal(viewingProduct); }} className="text-xs bg-orange-500 hover:bg-orange-600 text-white border-none">Edit This Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Google Sheets Real-Time Sync & Config Modal */}
      <GoogleSheetModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        divisionId={divisionId}
        divisionName={config.name}
      />
    </div>
  );
}
