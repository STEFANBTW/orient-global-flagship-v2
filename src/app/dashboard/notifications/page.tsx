'use client';

import React, { useState, useMemo } from 'react';
import { useRoles } from '@/context/role-context';
import { orderService } from '@/services/orderService';
import { toast } from '@/components/ui/use-toast';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  Check, 
  RotateCcw,
  Layers,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { isNotificationForAdmin, isNotificationForUser } from '@/services/notificationService';

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

export default function NotificationsPage() {
  const { 
    currentUser,
    notifications, 
    markNotificationRead, 
    updateNotificationStatus, 
    clearAllNotifications, 
    deleteNotification 
  } = useRoles();

  const isAdminMode = currentUser?.role === 'boss' || currentUser?.role === 'hod' || currentUser?.role === 'staff' || (typeof window !== 'undefined' && sessionStorage.getItem('orient_dashboard_mode') === 'admin');

  // Strict separation: User sees ONLY user notifications; Admin sees ONLY admin notifications
  const scopedNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (isAdminMode) {
        return isNotificationForAdmin(n as any);
      } else {
        return isNotificationForUser(n as any);
      }
    });
  }, [notifications, isAdminMode]);

  const [statusFilter, setStatusFilter] = useState<'all' | 'attended' | 'unattended' | 'in_progress'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique divisions from notifications
  const availableDivisions = useMemo(() => {
    const set = new Set<string>();
    scopedNotifications.forEach(n => {
      if (n.division) set.add(n.division);
    });
    return Array.from(set);
  }, [scopedNotifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return scopedNotifications.filter(n => {
      const currentStatus = n.status || (n.read ? 'attended' : 'unattended');
      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
      if (readFilter === 'read' && !n.read) return false;
      if (readFilter === 'unread' && n.read) return false;
      if (divisionFilter !== 'all' && n.division?.toLowerCase() !== divisionFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesMessage = n.message?.toLowerCase().includes(query);
        const matchesDivision = n.division?.toLowerCase().includes(query);
        const matchesCategory = (n as any).category?.toLowerCase().includes(query);
        const matchesTitle = (n as any).title?.toLowerCase().includes(query);
        if (!matchesMessage && !matchesDivision && !matchesCategory && !matchesTitle) return false;
      }
      return true;
    });
  }, [scopedNotifications, statusFilter, readFilter, divisionFilter, searchQuery]);

  // Counts for quick metrics
  const counts = useMemo(() => {
    let attended = 0;
    let unattended = 0;
    let inProgress = 0;
    scopedNotifications.forEach(n => {
      const s = n.status || (n.read ? 'attended' : 'unattended');
      if (s === 'attended') attended++;
      else if (s === 'in_progress') inProgress++;
      else unattended++;
    });
    return {
      total: scopedNotifications.length,
      attended,
      unattended,
      inProgress,
      unread: scopedNotifications.filter(n => !n.read).length
    };
  }, [scopedNotifications]);

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      if (orderService.markAllNotificationsRead) {
        await orderService.markAllNotificationsRead();
      }
      scopedNotifications.forEach(n => {
        if (!n.read) markNotificationRead(n.id);
      });
      toast({
        title: 'All Marked as Read',
        description: 'All notifications have been marked as attended and read.'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not mark notifications as read.',
        variant: 'destructive'
      });
    }
  };

  // Clear all notifications
  const handleClearAll = async () => {
    try {
      if (clearAllNotifications) {
        await clearAllNotifications();
      } else {
        await orderService.clearAllNotifications();
      }
      toast({
        title: 'Notifications Cleared',
        description: 'All operational records and notification history have been cleared.'
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not clear notifications.',
        variant: 'destructive'
      });
    }
  };

  // Delete single notification
  const handleDeleteSingle = async (id: string) => {
    try {
      if (deleteNotification) {
        await deleteNotification(id);
      } else {
        await orderService.deleteNotification(id);
      }
      toast({
        title: 'Notification Deleted',
        description: `Notification #${id} has been removed.`
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'Could not delete notification.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 font-display">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 shadow-2xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              {isAdminMode ? 'Administrative Notifications History' : 'User Notifications History'}
            </h1>
          </div>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={counts.unread === 0}
            className="text-xs h-8 gap-1.5 border-border/30 hover:bg-muted font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            <span>Mark All as Read</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            disabled={scopedNotifications.length === 0}
            className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/10 border-border/30 font-semibold rounded-xl transition-colors cursor-pointer"
            title="Purge all notifications from Firestore and local history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards - Aligned with Rest of Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total History */}
        <Card 
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'all' 
              ? 'border-foreground/30 bg-muted/40' 
              : 'border-border/20 bg-card hover:border-border/40'
          }`}
        >
          <div className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase flex items-center justify-between">
            <span>Total History</span>
            <Layers className="w-3.5 h-3.5 opacity-60" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground mt-1 tracking-tight">
            {counts.total}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            All logged events
          </div>
        </Card>

        {/* Unattended */}
        <Card 
          onClick={() => setStatusFilter('unattended')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'unattended' 
              ? 'border-foreground/30 bg-muted/40' 
              : 'border-border/20 bg-card hover:border-border/40'
          }`}
        >
          <div className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase flex items-center justify-between">
            <span>Unattended</span>
            <AlertCircle className="w-3.5 h-3.5 opacity-60" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground mt-1 tracking-tight">
            {counts.unattended}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Requires review
          </div>
        </Card>

        {/* In Progress */}
        <Card 
          onClick={() => setStatusFilter('in_progress')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'in_progress' 
              ? 'border-foreground/30 bg-muted/40' 
              : 'border-border/20 bg-card hover:border-border/40'
          }`}
        >
          <div className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase flex items-center justify-between">
            <span>In Progress</span>
            <Clock className="w-3.5 h-3.5 opacity-60" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground mt-1 tracking-tight">
            {counts.inProgress}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Being handled
          </div>
        </Card>

        {/* Attended & Resolved */}
        <Card 
          onClick={() => setStatusFilter('attended')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs ${
            statusFilter === 'attended' 
              ? 'border-foreground/30 bg-muted/40' 
              : 'border-border/20 bg-card hover:border-border/40'
          }`}
        >
          <div className="text-[11px] font-semibold text-muted-foreground tracking-wide uppercase flex items-center justify-between">
            <span>Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 opacity-60" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground mt-1 tracking-tight">
            {counts.attended}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Fulfilled / closed
          </div>
        </Card>
      </div>

      {/* Filters Bar Card - Dashboard Aesthetic */}
      <Card className="p-3.5 sm:p-4 rounded-2xl border border-border/20 bg-card shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-foreground text-background shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('unattended')}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                statusFilter === 'unattended'
                  ? 'bg-foreground text-background shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              Unattended ({counts.unattended})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('in_progress')}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                statusFilter === 'in_progress'
                  ? 'bg-foreground text-background shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              In Progress ({counts.inProgress})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('attended')}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors font-semibold cursor-pointer ${
                statusFilter === 'attended'
                  ? 'bg-foreground text-background shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              Attended ({counts.attended})
            </button>
          </div>

          {/* Search and Division Select */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Division dropdown */}
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="h-8 text-xs px-3 rounded-xl border border-border/30 bg-[#f8fafc] dark:bg-slate-800 text-foreground font-semibold outline-none cursor-pointer hover:border-border/50 transition-colors"
            >
              <option value="all">All Divisions</option>
              {availableDivisions.map(div => (
                <option key={div} value={div}>{div.toUpperCase()}</option>
              ))}
            </select>

            {/* Read/Unread Filter */}
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value as any)}
              className="h-8 text-xs px-3 rounded-xl border border-border/30 bg-[#f8fafc] dark:bg-slate-800 text-foreground font-semibold outline-none cursor-pointer hover:border-border/50 transition-colors"
            >
              <option value="all">All View States</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>

            {/* Search */}
            <div className="relative flex items-center min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none z-10 shrink-0" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="h-8 pl-8 text-xs bg-[#f8fafc] dark:bg-slate-800 border border-border/20 rounded-xl w-full text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>

            {(statusFilter !== 'all' || readFilter !== 'all' || divisionFilter !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatusFilter('all');
                  setReadFilter('all');
                  setDivisionFilter('all');
                  setSearchQuery('');
                }}
                className="h-8 text-xs text-muted-foreground hover:text-foreground rounded-xl"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center rounded-2xl border border-border/20 bg-card shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 opacity-40" />
            </div>
            <h3 className="text-sm font-bold text-foreground">No notifications found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No operational events match your filter criteria. When new orders or status updates occur, they will stream here.
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => {
            const currentStatus = notif.status || (notif.read ? 'attended' : 'unattended');
            const notifTitle = (notif as any).title || notif.message;
            const notifDesc = (notif as any).title ? notif.message : '';

            return (
              <Card 
                key={notif.id} 
                className={`p-4 rounded-2xl border transition-all duration-150 ${
                  !notif.read 
                    ? 'border-orange-500/30 bg-card shadow-xs' 
                    : 'border-border/15 bg-card/75 hover:border-border/30 shadow-2xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Status Icon Indicator */}
                    <div className="mt-0.5 shrink-0">
                      {currentStatus === 'attended' && (
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center" title="Attended / Resolved">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {currentStatus === 'in_progress' && (
                        <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center" title="In Progress">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      {currentStatus === 'unattended' && (
                        <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center" title="Unattended">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Content details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{notif.id}</span>
                        {notif.division && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border border-border/30 bg-[#f8fafc] dark:bg-slate-800 text-foreground">
                            {notif.division}
                          </span>
                        )}
                        {(notif as any).category && (
                          <span className="text-[10px] uppercase font-mono text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted/40">
                            {(notif as any).category}
                          </span>
                        )}
                        {!notif.read && (
                          <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                            New
                          </span>
                        )}
                        <span className="text-[11px] text-muted-foreground ml-auto font-mono shrink-0">
                          {formatRelativeTime(notif.timestamp)}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className={`text-xs sm:text-sm ${!notif.read ? 'font-bold text-foreground' : 'font-semibold text-foreground/90'}`}>
                          {notifTitle}
                        </h4>
                        {notifDesc && notifDesc !== notifTitle && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {notifDesc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions / Status switchers & Single Delete */}
                  <div className="flex items-center gap-1.5 sm:gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border/20 shrink-0 self-end md:self-center">
                    <span className="text-xs text-muted-foreground hidden lg:inline mr-1">Status:</span>

                    <button
                      type="button"
                      onClick={() => updateNotificationStatus(notif.id, 'unattended')}
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-colors font-medium cursor-pointer ${
                        currentStatus === 'unattended'
                          ? 'border-amber-500 bg-amber-500/15 text-amber-500 font-bold'
                          : 'border-border/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      Unattended
                    </button>

                    <button
                      type="button"
                      onClick={() => updateNotificationStatus(notif.id, 'in_progress')}
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-colors font-medium cursor-pointer ${
                        currentStatus === 'in_progress'
                          ? 'border-blue-500 bg-blue-500/15 text-blue-500 font-bold'
                          : 'border-border/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      In Progress
                    </button>

                    <button
                      type="button"
                      onClick={() => updateNotificationStatus(notif.id, 'attended')}
                      className={`text-xs px-2.5 py-1 rounded-xl border transition-colors font-medium cursor-pointer ${
                        currentStatus === 'attended'
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-500 font-bold'
                          : 'border-border/30 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      Attended
                    </button>

                    {/* Single notification delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSingle(notif.id)}
                      className="p-1.5 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors ml-1 cursor-pointer"
                      title="Delete this notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
