'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  DollarSign, TrendingUp, AlertTriangle, CheckCircle2, Clock, 
  Plus, Package, Users, Eye, RefreshCw, ArrowUpRight, 
  Store, Utensils, ChefHat, Gamepad2, Wine, Droplets,
  Search, Bell, Layers, Sparkles, Filter, ChevronRight, ChevronDown,
  ShieldCheck, Activity, ArrowRight, Settings2, Edit3, Check, RotateCcw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { cmsApi } from '@/services/cmsApi';
import { useRoles } from '@/context/role-context';
import { useToast } from '@/hooks/use-toast';


// 6 Company Divisions Data Definition
const DIVISIONS_CONFIG = [
  { id: 'restaurant', key: 'dining', name: 'Restaurant', icon: Utensils, path: '/dashboard/dining', share: 28, color: '#3B82F6' },
  { id: 'games', key: 'games', name: 'Game Shop', icon: Gamepad2, path: '/dashboard/games', share: 18, color: '#8B5CF6' },
  { id: 'bakery', key: 'bakery', name: 'Bakery', icon: ChefHat, path: '/dashboard/bakery', share: 22, color: '#10B981' },
  { id: 'water', key: 'water', name: 'Water Factory', icon: Droplets, path: '/dashboard/water', share: 14, color: '#06B6D4' },
  { id: 'lounge', key: 'lounge', name: 'Lounge', icon: Wine, path: '/dashboard/lounge', share: 10, color: '#F59E0B' },
  { id: 'market', key: 'market', name: 'Supermarket', icon: Store, path: '/dashboard/market', share: 8, color: '#64748B' },
];

const getDivisionIcon = (divisionName: string) => {
  const norm = (divisionName || '').toLowerCase();
  if (norm.includes('restaurant') || norm.includes('dining')) return Utensils;
  if (norm.includes('game')) return Gamepad2;
  if (norm.includes('bakery')) return ChefHat;
  if (norm.includes('water')) return Droplets;
  if (norm.includes('lounge')) return Wine;
  if (norm.includes('market') || norm.includes('supermarket')) return Store;
  return Store;
};

// Revenue Timeline Data (Global & Per Division)
const REVENUE_TIMELINE = {
  today: [
    { period: '8 AM', revenue: 42000, sales: 84 },
    { period: '10 AM', revenue: 78000, sales: 156 },
    { period: '12 PM', revenue: 165000, sales: 310 },
    { period: '2 PM', revenue: 210000, sales: 420 },
    { period: '4 PM', revenue: 195000, sales: 390 },
    { period: '6 PM', revenue: 280000, sales: 560 },
    { period: '8 PM', revenue: 245000, sales: 490 },
  ],
  week: [
    { period: 'Mon', revenue: 840000, sales: 1680 },
    { period: 'Tue', revenue: 920000, sales: 1840 },
    { period: 'Wed', revenue: 890000, sales: 1780 },
    { period: 'Thu', revenue: 1050000, sales: 2100 },
    { period: 'Fri', revenue: 1420000, sales: 2840 },
    { period: 'Sat', revenue: 1680000, sales: 3360 },
    { period: 'Sun', revenue: 1350000, sales: 2700 },
  ],
  month: [
    { period: 'Week 1', revenue: 5600000, sales: 11200 },
    { period: 'Week 2', revenue: 6400000, sales: 12800 },
    { period: 'Week 3', revenue: 7100000, sales: 14200 },
    { period: 'Week 4', revenue: 8200000, sales: 16400 },
  ]
};

// Division-specific sales & volume timelines
const DIVISION_TIMELINES: Record<string, typeof REVENUE_TIMELINE> = {
  restaurant: {
    today: [
      { period: '8 AM', revenue: 14000, sales: 28 },
      { period: '10 AM', revenue: 24000, sales: 48 },
      { period: '12 PM', revenue: 58000, sales: 116 },
      { period: '2 PM', revenue: 72000, sales: 144 },
      { period: '4 PM', revenue: 48000, sales: 96 },
      { period: '6 PM', revenue: 95000, sales: 190 },
      { period: '8 PM', revenue: 85000, sales: 170 },
    ],
    week: [
      { period: 'Mon', revenue: 250000, sales: 500 },
      { period: 'Tue', revenue: 280000, sales: 560 },
      { period: 'Wed', revenue: 270000, sales: 540 },
      { period: 'Thu', revenue: 320000, sales: 640 },
      { period: 'Fri', revenue: 440000, sales: 880 },
      { period: 'Sat', revenue: 530000, sales: 1060 },
      { period: 'Sun', revenue: 410000, sales: 820 },
    ],
    month: [
      { period: 'Week 1', revenue: 1680000, sales: 3360 },
      { period: 'Week 2', revenue: 1920000, sales: 3840 },
      { period: 'Week 3', revenue: 2150000, sales: 4300 },
      { period: 'Week 4', revenue: 2550000, sales: 5100 },
    ]
  },
  games: {
    today: [
      { period: '8 AM', revenue: 4000, sales: 8 },
      { period: '10 AM', revenue: 12000, sales: 24 },
      { period: '12 PM', revenue: 28000, sales: 56 },
      { period: '2 PM', revenue: 42000, sales: 84 },
      { period: '4 PM', revenue: 51000, sales: 102 },
      { period: '6 PM', revenue: 62000, sales: 124 },
      { period: '8 PM', revenue: 45000, sales: 90 },
    ],
    week: [
      { period: 'Mon', revenue: 140000, sales: 280 },
      { period: 'Tue', revenue: 160000, sales: 320 },
      { period: 'Wed', revenue: 155000, sales: 310 },
      { period: 'Thu', revenue: 190000, sales: 380 },
      { period: 'Fri', revenue: 290000, sales: 580 },
      { period: 'Sat', revenue: 360000, sales: 720 },
      { period: 'Sun', revenue: 275000, sales: 550 },
    ],
    month: [
      { period: 'Week 1', revenue: 980000, sales: 1960 },
      { period: 'Week 2', revenue: 1120000, sales: 2240 },
      { period: 'Week 3', revenue: 1250000, sales: 2500 },
      { period: 'Week 4', revenue: 1460000, sales: 2920 },
    ]
  },
  bakery: {
    today: [
      { period: '8 AM', revenue: 16000, sales: 32 },
      { period: '10 AM', revenue: 26000, sales: 52 },
      { period: '12 PM', revenue: 38000, sales: 76 },
      { period: '2 PM', revenue: 35000, sales: 70 },
      { period: '4 PM', revenue: 44000, sales: 88 },
      { period: '6 PM', revenue: 48000, sales: 96 },
      { period: '8 PM', revenue: 32000, sales: 64 },
    ],
    week: [
      { period: 'Mon', revenue: 190000, sales: 380 },
      { period: 'Tue', revenue: 210000, sales: 420 },
      { period: 'Wed', revenue: 200000, sales: 400 },
      { period: 'Thu', revenue: 235000, sales: 470 },
      { period: 'Fri', revenue: 315000, sales: 630 },
      { period: 'Sat', revenue: 370000, sales: 740 },
      { period: 'Sun', revenue: 295000, sales: 590 },
    ],
    month: [
      { period: 'Week 1', revenue: 1240000, sales: 2480 },
      { period: 'Week 2', revenue: 1410000, sales: 2820 },
      { period: 'Week 3', revenue: 1560000, sales: 3120 },
      { period: 'Week 4', revenue: 1810000, sales: 3620 },
    ]
  },
  water: {
    today: [
      { period: '8 AM', revenue: 6000, sales: 12 },
      { period: '10 AM', revenue: 11000, sales: 22 },
      { period: '12 PM', revenue: 24000, sales: 48 },
      { period: '2 PM', revenue: 31000, sales: 62 },
      { period: '4 PM', revenue: 28000, sales: 56 },
      { period: '6 PM', revenue: 35000, sales: 70 },
      { period: '8 PM', revenue: 26000, sales: 52 },
    ],
    week: [
      { period: 'Mon', revenue: 120000, sales: 240 },
      { period: 'Tue', revenue: 130000, sales: 260 },
      { period: 'Wed', revenue: 125000, sales: 250 },
      { period: 'Thu', revenue: 145000, sales: 290 },
      { period: 'Fri', revenue: 200000, sales: 400 },
      { period: 'Sat', revenue: 235000, sales: 470 },
      { period: 'Sun', revenue: 190000, sales: 380 },
    ],
    month: [
      { period: 'Week 1', revenue: 780000, sales: 1560 },
      { period: 'Week 2', revenue: 890000, sales: 1780 },
      { period: 'Week 3', revenue: 990000, sales: 1980 },
      { period: 'Week 4', revenue: 1150000, sales: 2300 },
    ]
  },
  lounge: {
    today: [
      { period: '8 AM', revenue: 1000, sales: 2 },
      { period: '10 AM', revenue: 3000, sales: 6 },
      { period: '12 PM', revenue: 12000, sales: 24 },
      { period: '2 PM', revenue: 20000, sales: 40 },
      { period: '4 PM', revenue: 28000, sales: 56 },
      { period: '6 PM', revenue: 42000, sales: 84 },
      { period: '8 PM', revenue: 48000, sales: 96 },
    ],
    week: [
      { period: 'Mon', revenue: 75000, sales: 150 },
      { period: 'Tue', revenue: 85000, sales: 170 },
      { period: 'Wed', revenue: 80000, sales: 160 },
      { period: 'Thu', revenue: 100000, sales: 200 },
      { period: 'Fri', revenue: 160000, sales: 320 },
      { period: 'Sat', revenue: 200000, sales: 400 },
      { period: 'Sun', revenue: 150000, sales: 300 },
    ],
    month: [
      { period: 'Week 1', revenue: 540000, sales: 1080 },
      { period: 'Week 2', revenue: 620000, sales: 1240 },
      { period: 'Week 3', revenue: 700000, sales: 1400 },
      { period: 'Week 4', revenue: 800000, sales: 1600 },
    ]
  },
  market: {
    today: [
      { period: '8 AM', revenue: 3000, sales: 6 },
      { period: '10 AM', revenue: 6000, sales: 12 },
      { period: '12 PM', revenue: 15000, sales: 30 },
      { period: '2 PM', revenue: 18000, sales: 36 },
      { period: '4 PM', revenue: 17000, sales: 34 },
      { period: '6 PM', revenue: 22000, sales: 44 },
      { period: '8 PM', revenue: 20000, sales: 40 },
    ],
    week: [
      { period: 'Mon', revenue: 65000, sales: 130 },
      { period: 'Tue', revenue: 70000, sales: 140 },
      { period: 'Wed', revenue: 68000, sales: 136 },
      { period: 'Thu', revenue: 80000, sales: 160 },
      { period: 'Fri', revenue: 110000, sales: 220 },
      { period: 'Sat', revenue: 135000, sales: 270 },
      { period: 'Sun', revenue: 105000, sales: 210 },
    ],
    month: [
      { period: 'Week 1', revenue: 420000, sales: 840 },
      { period: 'Week 2', revenue: 480000, sales: 960 },
      { period: 'Week 3', revenue: 530000, sales: 1060 },
      { period: 'Week 4', revenue: 610000, sales: 1220 },
    ]
  }
};

// Master pool of configurable action shortcuts
interface ShortcutTool {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  colorClass: string;
  path?: string;
  isAction?: boolean;
}

const AVAILABLE_SHORTCUTS: ShortcutTool[] = [
  {
    id: 'add-item',
    title: 'Add New Item',
    subtitle: 'Create product SKU in catalog',
    icon: Plus,
    colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    path: '/dashboard/inventory'
  },
  {
    id: 'review-stock',
    title: 'Review Stock',
    subtitle: 'Verify floor quantities',
    icon: Package,
    colorClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    path: '/dashboard/inventory'
  },
  {
    id: 'manage-catalog',
    title: 'Manage Divisions',
    subtitle: 'Open individual department',
    icon: Layers,
    colorClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    path: '/dashboard/dining'
  },
  {
    id: 'switch-operator',
    title: 'Switch User',
    subtitle: 'Test persona profiles',
    icon: Users,
    colorClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    isAction: true
  },
  {
    id: 'view-notifications',
    title: 'Notification Log',
    subtitle: 'Inspect audit history & filters',
    icon: Bell,
    colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    path: '/dashboard/notifications'
  },
  {
    id: 'activity-feed',
    title: 'Activity Feed',
    subtitle: 'Live register and order updates',
    icon: Activity,
    colorClass: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    path: '/dashboard'
  },
  {
    id: 'pos-billing',
    title: 'POS Terminal',
    subtitle: 'POS Terminal & Register',
    icon: DollarSign,
    colorClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    path: '/dashboard/dining'
  },
  {
    id: 'audit-security',
    title: 'System Audit',
    subtitle: 'Staff & floor compliance check',
    icon: ShieldCheck,
    colorClass: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    path: '/dashboard'
  }
];

// Initial Actionable Alerts and Notifications
interface DashboardAlert {
  id: string;
  type: 'inventory' | 'staff' | 'finance' | 'system';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  division: string;
  timestamp: string;
  actionText: string;
  actionPath: string;
}

const INITIAL_ALERTS: DashboardAlert[] = [
  {
    id: 'alt-1',
    type: 'inventory',
    severity: 'high',
    title: 'Low Flour Stock Alert',
    description: 'Bakery flour supply reached 12% reserve threshold. Re-order recommended.',
    division: 'Bakery',
    timestamp: '10 mins ago',
    actionText: 'Review Stock',
    actionPath: '/dashboard/bakery'
  },
  {
    id: 'alt-2',
    type: 'staff',
    severity: 'medium',
    title: 'Weekly Roster Update Pending',
    description: 'Dining and Restaurant staff roster for next week needs supervisor sign-off.',
    division: 'Restaurant',
    timestamp: '35 mins ago',
    actionText: 'Approve Roster',
    actionPath: '/dashboard/dining'
  },
  {
    id: 'alt-3',
    type: 'finance',
    severity: 'low',
    title: 'Daily Register Reconciliation',
    description: 'Water Factory sales batches ready for end-of-day verification.',
    division: 'Water Factory',
    timestamp: '1 hour ago',
    actionText: 'View Report',
    actionPath: '/dashboard/water'
  },
  {
    id: 'alt-4',
    type: 'system',
    severity: 'low',
    title: 'VR Headset Maintenance Routine',
    description: 'Game Shop VR Stations 3 & 4 scheduled for sanitary lens check.',
    division: 'Game Shop',
    timestamp: '2 hours ago',
    actionText: 'Equipment Log',
    actionPath: '/dashboard/games'
  }
];

// Activity Feed Item
interface ActivityItem {
  id: string;
  division: string;
  action: string;
  details: string;
  actor: string;
  timeAgo: string;
  badgeColor: string;
}

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    division: 'Bakery',
    action: 'Catalog Update',
    details: 'Added 5 units of Artisan Brioche Loaf to morning batch inventory',
    actor: 'Chef Adebayo',
    timeAgo: '4 mins ago',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
  },
  {
    id: 'act-2',
    division: 'Restaurant',
    action: 'Menu Adjustment',
    details: 'Updated weekend chef special notes on Jollof Rice platter',
    actor: 'Supervisor Ngozi',
    timeAgo: '18 mins ago',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
  },
  {
    id: 'act-3',
    division: 'Game Shop',
    action: 'Pass Renewal',
    details: 'Opened 4 new arcade simulator stations for weekend tournament',
    actor: 'Tunde (Admin)',
    timeAgo: '32 mins ago',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300'
  },
  {
    id: 'act-4',
    division: 'Water Factory',
    action: 'Quality Check',
    details: 'Batch #WT-402 passed standard purity check at 7.2 pH balance',
    actor: 'Lab Lead Ibrahim',
    timeAgo: '1 hour ago',
    badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
  },
  {
    id: 'act-5',
    division: 'Lounge',
    action: 'Inventory Check',
    details: 'Cellar stock updated for premium reserve beverages',
    actor: 'Manager Kelvin',
    timeAgo: '2 hours ago',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
  },
  {
    id: 'act-6',
    division: 'Supermarket',
    action: 'Price Verification',
    details: 'Confirmed active inventory across all 25 grocery SKUs',
    actor: 'Store Clerk Amina',
    timeAgo: '3 hours ago',
    badgeColor: 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
  }
];

export default function Overview_Revamp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useRoles();

  // State
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [alerts, setAlerts] = useState<DashboardAlert[]>(INITIAL_ALERTS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(90);
  const [totalStock, setTotalStock] = useState(450);

  // Quick Action Shortcuts Editable State (persisted in localStorage)
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [shortcutIds, setShortcutIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('orient_admin_quick_shortcuts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return ['add-item', 'review-stock', 'manage-catalog', 'switch-operator'];
  });
  const [tempShortcutIds, setTempShortcutIds] = useState<string[]>(shortcutIds);

  const handleOpenShortcutModal = () => {
    setTempShortcutIds([...shortcutIds]);
    setIsShortcutModalOpen(true);
  };

  const handleToggleShortcutOption = (id: string) => {
    if (tempShortcutIds.includes(id)) {
      if (tempShortcutIds.length > 2) {
        setTempShortcutIds(prev => prev.filter(item => item !== id));
      } else {
        toast({
          title: 'Minimum Shortcuts',
          description: 'Keep at least 2 shortcuts in your active panel.'
        });
      }
    } else {
      if (tempShortcutIds.length < 4) {
        setTempShortcutIds(prev => [...prev, id]);
      } else {
        toast({
          title: 'Maximum 4 Shortcuts',
          description: 'Deselct one shortcut first to add a different tool.'
        });
      }
    }
  };

  const handleSaveShortcuts = () => {
    setShortcutIds(tempShortcutIds);
    try {
      localStorage.setItem('orient_admin_quick_shortcuts', JSON.stringify(tempShortcutIds));
    } catch (e) {
      // ignore
    }
    setIsShortcutModalOpen(false);
    toast({
      title: 'Shortcuts Updated',
      description: 'Quick Action panel configuration saved successfully.'
    });
  };

  const handleResetDefaultShortcuts = () => {
    const defaults = ['add-item', 'review-stock', 'manage-catalog', 'switch-operator'];
    setTempShortcutIds(defaults);
  };

  // Active configured shortcuts
  const activeShortcuts = shortcutIds
    .map(id => AVAILABLE_SHORTCUTS.find(s => s.id === id))
    .filter(Boolean) as ShortcutTool[];

  // Find currently active division object if one is selected
  const activeDivisionConfig = DIVISIONS_CONFIG.find(
    d => d.name.toLowerCase() === selectedDivisionFilter.toLowerCase()
  );

  // Compute Revenue Totals for current timeframe & selected division
  const currentChartData = useMemo(() => {
    if (selectedDivisionFilter !== 'all' && activeDivisionConfig) {
      const divData = DIVISION_TIMELINES[activeDivisionConfig.id];
      if (divData && divData[timeframe]) {
        return divData[timeframe];
      }
    }
    return REVENUE_TIMELINE[timeframe];
  }, [timeframe, selectedDivisionFilter, activeDivisionConfig]);

  const totalRevenue = currentChartData.reduce((sum, item) => sum + item.revenue, 0);
  const totalSalesUnits = currentChartData.reduce((sum, item) => sum + item.sales, 0);

  // Active division inventory and product counts
  const displayProductsCount = selectedDivisionFilter !== 'all' && activeDivisionConfig
    ? Math.round(totalProducts * (activeDivisionConfig.share / 100))
    : totalProducts;

  const displayStockCount = selectedDivisionFilter !== 'all' && activeDivisionConfig
    ? Math.round(totalStock * (activeDivisionConfig.share / 100))
    : totalStock;

  // Load live product inventory count
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const res = await cmsApi.getProducts();
      if (res?.products && res.products.length > 0) {
        setTotalProducts(res.products.length);
        const sumStock = res.products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0);
        setTotalStock(sumStock);
      }
    } catch (e) {
      console.warn('Could not refresh products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    const handleHeaderRefresh = () => {
      refreshData();
    };

    const handleHeaderSearch = (e: any) => {
      if (typeof e.detail === 'string') {
        setSearchQuery(e.detail);
      }
    };

    window.addEventListener('header-refresh-triggered', handleHeaderRefresh);
    window.addEventListener('header-search-changed', handleHeaderSearch);

    return () => {
      window.removeEventListener('header-refresh-triggered', handleHeaderRefresh);
      window.removeEventListener('header-search-changed', handleHeaderSearch);
    };
  }, []);

  // Handle Dismissing an Alert
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast({
      title: 'Alert Acknowledged',
      description: 'The notification has been marked as reviewed.'
    });
  };

  // Filter activities
  const filteredActivities = activities.filter(act => {
    const matchesDiv = selectedDivisionFilter === 'all' || act.division.toLowerCase() === selectedDivisionFilter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      act.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiv && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* ========================================================================= */}
      {/* ROW 1: Left column (Multi-Division Portal on top of Global Revenue        */}
      {/* Overview) and Right column (Quick Action Shortcuts), both spanning equal */}
      {/* height on desktop screens.                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (7 cols): Multi-Division Portal stacked directly on top of Global Revenue Overview */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Multi-Division Portal (Clean, compact department quick-filter bar) */}
          <div 
            id="dashboard-multi-division-portal"
            className="p-4 rounded-xl bg-card shadow-xs flex flex-col gap-3 shrink-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">Multi-Division Portal</span>
            </div>

            {/* Quick Department Switcher Pills - on one straight line at the bottom */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedDivisionFilter('all')}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium ${
                  selectedDivisionFilter === 'all'
                    ? 'bg-foreground text-background font-semibold'
                    : 'bg-[#f8fafc] dark:bg-slate-800 text-muted-foreground hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-foreground'
                }`}
              >
                All Divisions
              </button>
              {DIVISIONS_CONFIG.map(div => (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivisionFilter(div.name)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 font-medium ${
                    selectedDivisionFilter.toLowerCase() === div.name.toLowerCase()
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-[#f8fafc] dark:bg-slate-800 text-muted-foreground hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-foreground'
                  }`}
                >
                  <span>{div.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Global Revenue/Sales Overview */}
          <Card className="p-6 bg-card shadow-xs flex-1 flex flex-col justify-between border-none">
            <div>
              {/* Header with Timeframe Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">Total Company Performance</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Real-time sales volume aggregated across all 6 operational divisions.
                  </p>
                </div>

                {/* Plain-Language Timeframe Selector */}
                <div className="inline-flex items-center p-1 rounded-lg bg-muted">
                  <button
                    onClick={() => setTimeframe('today')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      timeframe === 'today'
                        ? 'bg-background text-foreground font-medium shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setTimeframe('week')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      timeframe === 'week'
                        ? 'bg-background text-foreground font-medium shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setTimeframe('month')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      timeframe === 'month'
                        ? 'bg-background text-foreground font-medium shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    This Month
                  </button>
                </div>
              </div>

              {/* KPI Summary Banner */}
              <div className="grid grid-cols-2 gap-4 py-4 my-2">
                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/50 flex flex-col justify-between min-h-[100px]">
                  <span className="text-xs text-muted-foreground font-medium block">Total Revenue</span>
                  <div className="mt-1">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-foreground block">
                      ₦{totalRevenue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-1">
                      +12.4% vs last period
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#f8fafc] dark:bg-slate-800/50 flex flex-col justify-between min-h-[100px]">
                  <span className="text-xs text-muted-foreground font-medium block">Units Sold</span>
                  <div className="mt-1">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-foreground block">
                      {totalSalesUnits.toLocaleString()} items
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-1 invisible">
                      &nbsp;
                    </span>
                  </div>
                </div>
              </div>

              {/* Area Chart Visualization */}
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 11, fill: 'currentColor' }} 
                      tickLine={false} 
                      axisLine={{ stroke: 'rgba(150, 150, 150, 0.2)' }} 
                    />
                    <YAxis 
                      tick={{ fontSize: 11, fill: 'currentColor' }} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(val) => `₦${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'}`} 
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-popover border-none rounded-lg p-2.5 shadow-md text-xs space-y-1">
                              <span className="font-semibold text-foreground block">{item.period}</span>
                              <div className="text-muted-foreground flex justify-between gap-4">
                                <span>Revenue:</span>
                                <span className="font-mono font-bold text-foreground">₦{item.revenue.toLocaleString()}</span>
                              </div>
                              <div className="text-muted-foreground flex justify-between gap-4">
                                <span>Volume:</span>
                                <span className="font-mono font-bold text-foreground">{item.sales} units</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-muted-foreground mt-4">
              <span>Automatic sync enabled</span>
              <span className="font-mono">Updated just now</span>
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Quick Action Shortcuts - Spans matching height */}
        <div className="lg:col-span-5 flex flex-col">
          <Card className="p-6 bg-card shadow-xs h-full flex flex-col justify-between border-none">
            <div>
              <div className="pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-foreground">Quick Action Shortcuts</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Frequently used administrative controls for fast store operations.
                </p>
              </div>

              {/* Primary Operational Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                
                {/* 1. Add New Item */}
                <Link
                  to="/dashboard/inventory"
                  id="action-add-item"
                  className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex flex-col justify-between h-full min-h-[110px] group"
                >
                  <div className="flex items-center justify-between w-full shrink-0">
                    <Plus className="w-5 h-5 text-foreground" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="mt-3 flex-1 flex flex-col justify-end">
                    <span className="text-xs font-semibold text-foreground block group-hover:underline">
                      Add New Item
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5 leading-tight">
                      Create product SKU in catalog
                    </span>
                  </div>
                </Link>

                {/* 2. Review Low Stock */}
                <Link
                  to="/dashboard/inventory"
                  id="action-review-stock"
                  className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex flex-col justify-between h-full min-h-[110px] group"
                >
                  <div className="flex items-center justify-between w-full shrink-0">
                    <Package className="w-5 h-5 text-foreground" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="mt-3 flex-1 flex flex-col justify-end">
                    <span className="text-xs font-semibold text-foreground block group-hover:underline">
                      Review Stock
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5 leading-tight">
                      Verify floor quantities
                    </span>
                  </div>
                </Link>

                {/* 3. Manage Catalog */}
                <Link
                  to="/dashboard/dining"
                  id="action-manage-catalog"
                  className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/60 transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 flex flex-col justify-between h-full min-h-[110px] group"
                >
                  <div className="flex items-center justify-between w-full shrink-0">
                    <Layers className="w-5 h-5 text-foreground" />
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="mt-3 flex-1 flex flex-col justify-end">
                    <span className="text-xs font-semibold text-foreground block group-hover:underline">
                      Manage Divisions
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5 leading-tight">
                      Open individual department
                    </span>
                  </div>
                </Link>
              </div>

              {/* Department Direct Jumps */}
              <div className="mt-4 pt-4">
                <span className="text-[11px] font-medium text-muted-foreground block mb-2">
                  Jump to Division:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {DIVISIONS_CONFIG.map(div => (
                    <Link
                      key={div.id}
                      to={div.path}
                      className="px-2.5 py-1.5 rounded-lg bg-[#f8fafc] dark:bg-slate-800/60 transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-[11px] font-medium text-foreground truncate flex items-center gap-1.5"
                    >
                      <span className="truncate">{div.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 text-xs text-muted-foreground flex items-center justify-between">
              <span>All 6 departments accessible</span>
            </div>
          </Card>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 2: (30%) Division Performance  +  (70%) Actionable Alerts/Notifs      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* 2. Division Performance Breakdown (30% -> 4 cols on lg screen) */}
        <div className="lg:col-span-4">
          <Card className="p-6 bg-card border border-border shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-border">
                <h2 className="text-base font-semibold text-foreground">Division Breakdown</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share of business activity across all six departments.
                </p>
              </div>

              {/* Donut Chart */}
              <div className="h-44 w-full relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DIVISIONS_CONFIG}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="share"
                    >
                      {DIVISIONS_CONFIG.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border rounded-lg p-2 text-xs shadow-sm">
                              <span className="font-semibold text-foreground">{item.name}</span>
                              <span className="block text-muted-foreground">{item.share}% contribution</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-foreground">6</span>
                  <span className="text-[10px] text-muted-foreground">Divisions</span>
                </div>
              </div>

              {/* Division Percentages List */}
              <div className="space-y-2 mt-2">
                {DIVISIONS_CONFIG.map(div => (
                  <Link
                    key={div.id}
                    to={div.path}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-xs shrink-0" style={{ backgroundColor: div.color }} />
                      <span className="text-foreground font-medium truncate group-hover:underline">
                        {div.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-muted-foreground text-[11px]">{div.share}%</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 flex justify-between items-center text-xs text-muted-foreground">
              <span>Leader: Restaurant (28%)</span>
              <span className="text-[11px]">Updated today</span>
            </div>
          </Card>
        </div>

        {/* 4. Actionable Alerts and Notifications (70% -> 8 cols on lg screen) */}
        <div className="lg:col-span-8">
          <Card className="p-6 bg-card shadow-xs h-full flex flex-col justify-between border-none">
            <div>
              <div className="flex items-center justify-between pb-3">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Alert & Notifications</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Matters that need immediate attention!
                  </p>
                </div>

                {alerts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAlerts([]);
                      toast({ title: 'Cleared', description: 'All alerts cleared from view.' });
                    }}
                    className="text-xs h-7 px-3 rounded-lg bg-[#f8fafc] dark:bg-slate-800 text-muted-foreground hover:text-foreground font-medium transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-none"
                  >
                    Mark All Done
                  </Button>
                )}
              </div>

              {/* Alerts List */}
              <div className="space-y-3 mt-4">
                {alerts.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-muted/30">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500/80 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-foreground">All Alerts Handled</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      No urgent operational or stock discrepancies detected across the 6 divisions.
                    </p>
                  </div>
                ) : (
                  alerts.map(alert => {
                    const DivIcon = getDivisionIcon(alert.division);
                    return (
                      <div
                        key={alert.id}
                        className="p-3.5 rounded-xl bg-[#f8fafc] dark:bg-slate-800/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-foreground truncate">
                                {alert.title}
                              </span>
                              {/* Category pill with Icon on LEFT side and darker background */}
                              <span className="text-xs px-2.5 py-0.5 capitalize border-none bg-slate-200 dark:bg-slate-700 text-foreground font-semibold rounded-full flex items-center gap-1.5 shrink-0 shadow-2xs">
                                <DivIcon className="w-3.5 h-3.5 text-foreground shrink-0" />
                                <span>{alert.division}</span>
                              </span>
                              {/* Timing pill with darker background */}
                              <span className="text-xs px-2.5 py-0.5 border-none bg-slate-200 dark:bg-slate-700 text-foreground font-semibold rounded-full font-mono shrink-0 shadow-2xs">
                                {alert.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <Link to={alert.actionPath}>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7 text-xs font-medium border-none bg-muted hover:bg-muted/80 text-foreground transition-colors duration-200"
                            >
                              {alert.actionText}
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissAlert(alert.id)}
                            className="h-7 text-xs font-medium text-muted-foreground bg-[#f8fafc] dark:bg-slate-800 border border-transparent hover:border-red-600 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-500 hover:bg-transparent transition-colors duration-200 rounded-lg"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 3: (100% Width) Aggregated Recent Activity Feed                       */}
      {/* ========================================================================= */}
      <Card className="p-6 bg-card shadow-xs border-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Operational activity log across all divisions.
            </p>
          </div>

          {/* Division Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Filter:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs bg-[#f8fafc] dark:bg-slate-800 rounded-xl px-3 text-foreground border-none font-medium gap-2 transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80"
                >
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{selectedDivisionFilter === 'all' ? 'All Departments' : selectedDivisionFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-2 backdrop-blur-[10px] bg-card border border-border/40 shadow-2xl rounded-2xl space-y-1 z-50">
                <DropdownMenuItem 
                  onClick={() => setSelectedDivisionFilter('all')} 
                  className="flex items-center gap-2.5 text-xs font-semibold py-2 px-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-foreground"
                >
                  <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>All Departments</span>
                </DropdownMenuItem>
                {DIVISIONS_CONFIG.map(div => {
                  const DivIcon = div.icon;
                  return (
                    <DropdownMenuItem 
                      key={div.id} 
                      onClick={() => setSelectedDivisionFilter(div.name)} 
                      className="flex items-center gap-2.5 text-xs font-medium py-2 px-3 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-foreground"
                    >
                      <DivIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{div.name}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Activity Table / Rows */}
        <div className="mt-2 space-y-1">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No recent activity matching your current filter.
            </div>
          ) : (
            filteredActivities.map(act => {
              const DivIcon = getDivisionIcon(act.division);
              return (
                <div 
                  key={act.id} 
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 px-2.5 rounded-xl transition-colors duration-200"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Category pill with Icon on LEFT side and darker background */}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-foreground border-none shrink-0 flex items-center gap-1.5 shadow-2xs">
                      <DivIcon className="w-3.5 h-3.5 text-foreground shrink-0" />
                      <span>{act.division}</span>
                    </span>
                    <div>
                      <span className="text-xs font-semibold text-foreground mr-2">
                        {act.action}:
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {act.details}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center text-xs text-muted-foreground shrink-0">
                    <span className="font-medium text-foreground">{act.actor}</span>
                    {/* Timing pill with darker background */}
                    <span className="text-xs px-2.5 py-0.5 border-none bg-slate-200 dark:bg-slate-700 text-foreground font-semibold rounded-full font-mono shrink-0 shadow-2xs">
                      {act.timeAgo}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="pt-4 mt-3 flex items-center justify-end text-xs text-muted-foreground">
          <span className="font-mono">Retention: 30 Days</span>
        </div>
      </Card>

    </div>
  );
}
