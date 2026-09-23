'use client';

import React, { useState, useEffect } from 'react';
import { 
  Store,
  ChevronDown,
  LayoutDashboard,
  ChefHat,
  Utensils,
  Gamepad2,
  Wine as WineIcon,
  Droplets,
  Search,
  RotateCcw,
  Bell,
  Sun,
  Moon,
  Home,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Check,
  TrendingUp,
  DollarSign,
  User,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Phone,
  Edit3,
  X,
  Shield,
  Users
} from 'lucide-react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useRoles } from '@/context/role-context';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { getActiveConsumerUser, getActiveAdminUser, updateActiveConsumerUserDetails, AppUser } from '@/services/userService';
import { Toaster } from '@/components/ui/toaster';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Six core operational divisions
const STORE_DIVISIONS = [
  { id: 'bakery', label: 'Bakery & Pastries', path: '/dashboard/bakery', icon: ChefHat },
  { id: 'dining', label: 'Dining & Restaurant', path: '/dashboard/dining', icon: Utensils },
  { id: 'market', label: 'Supermarket', path: '/dashboard/market', icon: Store },
  { id: 'games', label: 'Games & Arcade', path: '/dashboard/games', icon: Gamepad2 },
  { id: 'lounge', label: 'Lounge & Bar', path: '/dashboard/lounge', icon: WineIcon },
  { id: 'water', label: 'Pure Table Water', path: '/dashboard/water', icon: Droplets },
];

export default function DashboardLayout({ onCancel }: { onCancel?: () => void }) {
  const { currentUser, setCurrentUser, logout, notifications, markNotificationRead } = useRoles();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  // Active consumer user profile state
  const [activeConsumer, setActiveConsumer] = useState<AppUser | null>(() => getActiveConsumerUser());

  // Determine if Admin CMS mode is active
  const isAdminMode = currentUser?.role === 'boss' || currentUser?.role === 'hod' || currentUser?.role === 'staff';

  // Active user details derived cleanly from session/state without hardcoded fallbacks
  const activeUser = isAdminMode ? (getActiveAdminUser() || currentUser) : (activeConsumer || getActiveConsumerUser());
  const displayName = activeUser?.name || currentUser?.name || (isAdminMode ? 'The Boss' : 'User');
  const displayEmail = activeUser?.email || (currentUser?.email && !currentUser.email.includes('@orientglobal.ng') ? currentUser.email : '') || '';
  const displayPhone = (activeUser as AppUser)?.phone || '';
  const displayAddress = (activeUser as AppUser)?.deliveryAddress || '';
  const displayAvatar = activeUser?.avatar || currentUser?.avatar || (isAdminMode ? 'B' : displayName ? displayName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U');

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    const syncConsumer = () => {
      setActiveConsumer(getActiveConsumerUser());
    };
    syncConsumer();
    window.addEventListener('orient_consumer_user_changed', syncConsumer);
    return () => window.removeEventListener('orient_consumer_user_changed', syncConsumer);
  }, []);

  const handleOpenEditProfile = () => {
    const current = activeConsumer || getActiveConsumerUser();
    setEditName(current?.name || currentUser?.name || '');
    setEditEmail(current?.email || (currentUser?.email && !currentUser.email.includes('@orientglobal.ng') ? currentUser.email : '') || '');
    setEditPhone(current?.phone || '');
    setEditAddress(current?.deliveryAddress || '');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name is required.',
        variant: 'destructive'
      });
      return;
    }

    const updated = updateActiveConsumerUserDetails({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      deliveryAddress: editAddress.trim()
    });

    if (updated) {
      setActiveConsumer(updated);
      if (setCurrentUser) {
        setCurrentUser({
          id: updated.id,
          name: updated.name,
          email: updated.email || '',
          role: (updated.role as any) || 'customer',
          division: (updated.division as any) || 'global',
          avatar: updated.avatar
        });
      }
      toast({
        title: 'Account Profile Updated',
        description: 'Your user details have been saved successfully.'
      });
    }
    setIsEditProfileOpen(false);
  };

  // Header quick search state
  const [headerSearch, setHeaderSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Unread notification count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Manual refresh animation & dispatch
  const handleRefresh = () => {
    setIsRefreshing(true);
    window.dispatchEvent(new CustomEvent('refresh-dashboard-data'));
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Determine current active section title for the dropdown label
  const currentDivision = STORE_DIVISIONS.find(d => pathname.startsWith(d.path));
  let currentNavLabel = 'Overview';
  if (pathname === '/dashboard/notifications') {
    currentNavLabel = 'Notifications';
  } else if (currentDivision) {
    currentNavLabel = currentDivision.label;
  }

  return (
    <div className="min-h-screen w-full bg-background font-display text-foreground flex flex-col">
      {/* ========================================================================= */}
      {/* UNIFIED SINGLE TOP BAR                                                    */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* ===================================================================== */}
          {/* TOP LEFT: Orient Icon, "Orient CMS", & Back to Storefront Underneath  */}
          {/* ===================================================================== */}
          <div className="flex flex-col items-start shrink-0">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 group hover:opacity-90 transition-opacity"
            >
              {/* Orient Icon */}
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-xs shrink-0">
                <Store className="w-4 h-4" />
              </div>
              {/* Exact Name: Orient CMS or Orient User Portal */}
              <span className="text-base font-bold tracking-tight text-foreground leading-none">
                {isAdminMode ? 'Orient CMS' : 'Orient User Portal'}
              </span>
            </Link>

            {/* Back to Storefront button directly under Orient CMS */}
            <button
              onClick={() => onCancel ? onCancel() : navigate('/')}
              className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
              title="Return to public storefront"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Storefront</span>
            </button>
          </div>

          {/* ===================================================================== */}
          {/* CENTER: Navigation Dropdown (Overview, Divisions, Notifications)       */}
          {/* ===================================================================== */}
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  id="btn-nav-division-dropdown"
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-background hover:bg-muted text-foreground transition-colors text-sm font-semibold shadow-xs"
                >
                  <span className="max-w-[140px] sm:max-w-[200px] truncate">{currentNavLabel}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground ml-0.5 shrink-0" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="center" className="w-80 sm:w-96 p-4 sm:p-5 backdrop-blur-[10px] bg-card/90 border-none shadow-2xl rounded-2xl space-y-3 z-50">
                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-1">
                  Navigation & Portals
                </DropdownMenuLabel>
                
                <div className="space-y-1">
                  {/* 1. Overview */}
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/dashboard" 
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 text-sm rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 ${
                        pathname === '/dashboard' ? 'bg-[#f8fafc] dark:bg-slate-800 text-foreground font-bold' : 'text-foreground font-medium'
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="flex-1">Overview</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* 2. Notifications History */}
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/dashboard/notifications" 
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 text-sm rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 ${
                        pathname === '/dashboard/notifications' ? 'bg-[#f8fafc] dark:bg-slate-800 text-foreground font-bold' : 'text-foreground font-medium'
                      }`}
                    >
                      <Bell className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="flex-1">Notifications</span>
                      {unreadCount > 0 ? (
                        <Badge variant="outline" className="text-xs font-mono px-2 py-0.5 border-none bg-[#f8fafc] dark:bg-slate-800 text-foreground font-bold">
                          {unreadCount} new
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">History</span>
                      )}
                    </Link>
                  </DropdownMenuItem>
                </div>

                <div className="pt-2"></div>

                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-1">
                  Store Divisions (6)
                </DropdownMenuLabel>

                {/* 6 Store Divisions */}
                <div className="space-y-1">
                  {STORE_DIVISIONS.map((division) => {
                    const Icon = division.icon;
                    const isActive = pathname.startsWith(division.path);
                    return (
                      <DropdownMenuItem key={division.id} asChild>
                        <Link
                          to={division.path}
                          className={`flex items-center gap-3.5 px-3.5 py-2.5 text-sm rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 ${
                            isActive ? 'bg-[#f8fafc] dark:bg-slate-800 text-foreground font-bold' : 'text-foreground font-medium'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span className="flex-1 truncate">{division.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </div>

                <div className="pt-2"></div>

                <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-1">
                  User Management
                </DropdownMenuLabel>

                <DropdownMenuItem asChild>
                  <Link
                    to="/dashboard/users"
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 text-sm rounded-xl cursor-pointer transition-colors duration-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 ${
                      pathname === '/dashboard/users' ? 'bg-[#f8fafc] dark:bg-slate-800 text-foreground font-bold' : 'text-foreground font-medium'
                    }`}
                  >
                    <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 truncate">Users</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ===================================================================== */}
          {/* TOP RIGHT: Home, Search, Refresh, Notifications, Profile, Theme       */}
          {/* ===================================================================== */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* 1. Home Icon (No border, simple clean icon) */}
            <Link
              to="/dashboard"
              id="btn-header-home"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
              title="Dashboard Overview Home"
            >
              <Home className="w-4 h-4" />
            </Link>

            {/* 2. Compact Search Bar with centered magnifying glass */}
            <div className="relative hidden md:flex items-center min-w-[150px] lg:min-w-[190px]">
              <Search className="w-3.5 h-3.5 absolute left-3 pointer-events-none text-muted-foreground" />
              <Input
                id="header-search-bar"
                value={headerSearch}
                onChange={(e) => {
                  setHeaderSearch(e.target.value);
                  window.dispatchEvent(new CustomEvent('header-search-changed', { detail: e.target.value }));
                }}
                placeholder="Search..."
                className="h-8 pl-8 pr-2.5 text-xs bg-[#f8fafc] dark:bg-[#1a1a1a] text-foreground rounded-lg border-none focus:ring-0 focus-visible:ring-0"
              />
            </div>

            {/* 3. Refresh Button (Icon-only, no text, no border) */}
            <Button
              id="btn-header-refresh"
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
              title="Sync & Refresh Data"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            {/* 4. Notification Bell Icon (Comes BEFORE profile button, no border) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  id="btn-header-notifications"
                  className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-card shadow-lg border-none">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="outline" className="text-[10px] font-mono border-none text-muted-foreground">
                        {unreadCount} Unread
                      </Badge>
                    )}
                  </div>
                  <Link 
                    to="/dashboard/notifications" 
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    View History
                  </Link>
                </div>

                <ScrollArea className="h-[280px]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      No notifications recorded
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((notif) => (
                      <DropdownMenuItem
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className="flex flex-col items-start p-3 gap-1 cursor-pointer hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-xs ${!notif.read ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                            {notif.message}
                          </span>
                        </div>
                        <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground mt-0.5">
                          <span>{notif.division || 'System'}</span>
                          <span className="font-mono">{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </ScrollArea>

                <div className="p-2 bg-muted/30 text-center">
                  <Link 
                    to="/dashboard/notifications" 
                    className="text-xs text-foreground font-semibold hover:underline block py-1"
                  >
                    Open Full History & Status Filters →
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 5. Profile Avatar Icon */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="btn-header-profile-avatar"
                  style={{ borderWidth: '0px' }}
                  className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center font-bold text-xs transition-colors shrink-0 shadow-2xs cursor-pointer border-none"
                  title="User Account Profile & Settings"
                >
                  {displayAvatar}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-80 sm:w-96 p-5 sm:p-6 bg-card shadow-2xl rounded-2xl border-none space-y-4">
                {/* Top Box: Active User Header Info with Repositioned Edit Icon */}
                <div className="relative p-4 rounded-2xl bg-muted/40 flex items-start gap-3.5">
                  <div className="relative w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-base shadow-sm shrink-0">
                    {displayAvatar}
                  </div>
                  <div className="min-w-0 flex-1 pr-7">
                    <span className="text-sm font-bold text-foreground block truncate leading-tight">
                      {displayName}
                    </span>
                    {displayEmail ? (
                      <span className="text-xs text-muted-foreground block truncate mt-1">
                        {displayEmail}
                      </span>
                    ) : null}
                    <div className="mt-2">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isAdminMode ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/10 text-primary'
                      }`}>
                        {isAdminMode ? 'Admin Officer (The Boss)' : 'Customer Account'}
                      </span>
                    </div>
                  </div>

                  {/* Edit Icon in the bottom right corner of this box */}
                  <button
                    type="button"
                    onClick={handleOpenEditProfile}
                    className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-500/10 transition-colors cursor-pointer shrink-0"
                    title="Edit Profile Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Account Profile Details Section */}
                <div className="p-4 rounded-xl bg-muted/40 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      Phone:
                    </span>
                    <span className="font-semibold text-foreground text-right font-mono">
                      {displayPhone}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted-foreground flex items-center gap-1.5 shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      Delivery Address:
                    </span>
                    <div className="flex items-start gap-2 text-right">
                      <span className="font-semibold text-foreground leading-snug break-words max-w-[200px]">
                        {displayAddress}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="space-y-1 pt-1">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-3 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl transition-colors hover:bg-muted cursor-pointer">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      <span>Back to Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/notifications" className="flex items-center gap-3 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl transition-colors hover:bg-muted cursor-pointer">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <span>Notification Log</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onCancel ? onCancel() : navigate('/')}
                    className="flex items-center gap-3 text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl transition-colors hover:bg-muted cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                    <span>Return to Storefront</span>
                  </DropdownMenuItem>
                </div>

                {/* Log Out Option */}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 py-2.5 px-3 rounded-xl transition-colors hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 6. Theme Toggle Icon (Sun / Moon) */}
            <button 
              id="btn-header-theme-toggle"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0"
              title="Toggle Theme"
            >
              <Moon className="w-4 h-4 dark:hidden" />
              <Sun className="w-4 h-4 hidden dark:block" />
            </button>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className="flex-1 p-3 sm:p-6 max-w-7xl w-full mx-auto flex flex-col justify-between overflow-x-hidden">
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </main>

      {/* Edit Account Details Modal (Full screen on mobile) */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="w-full h-full sm:h-auto sm:max-w-md bg-card border-none shadow-2xl rounded-none sm:rounded-2xl p-5 sm:p-6 overflow-y-auto flex flex-col justify-between sm:justify-start">
          <DialogHeader className="pr-6">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Edit Account Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Update your personal contact details and default delivery address.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveProfileDetails} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Full Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Chijioke Adeleke"
                required
                className="h-10 text-xs bg-background border-border/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Email Address</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="user@example.ng (optional)"
                className="h-10 text-xs bg-background border-border/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Phone Number</label>
              <Input
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+234 802 000 0000"
                required
                className="h-10 text-xs bg-background border-border/80"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Delivery Address</label>
              <Input
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Street address, City (optional)"
                className="h-10 text-xs bg-background border-border/80"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditProfileOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
