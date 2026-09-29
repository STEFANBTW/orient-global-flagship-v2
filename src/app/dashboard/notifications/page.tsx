'use client';

import React, { useState, useMemo } from 'react';
import { useRoles } from '@/context/role-context';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  Check, 
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, updateNotificationStatus } = useRoles();
  const [statusFilter, setStatusFilter] = useState<'all' | 'attended' | 'unattended' | 'in_progress'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique divisions from notifications
  const availableDivisions = useMemo(() => {
    const set = new Set<string>();
    notifications.forEach(n => {
      if (n.division) set.add(n.division);
    });
    return Array.from(set);
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const currentStatus = n.status || (n.read ? 'attended' : 'unattended');
      if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
      if (readFilter === 'read' && !n.read) return false;
      if (readFilter === 'unread' && n.read) return false;
      if (divisionFilter !== 'all' && n.division?.toLowerCase() !== divisionFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesMessage = n.message.toLowerCase().includes(query);
        const matchesDivision = n.division?.toLowerCase().includes(query);
        const matchesCategory = n.category?.toLowerCase().includes(query);
        if (!matchesMessage && !matchesDivision && !matchesCategory) return false;
      }
      return true;
    });
  }, [notifications, statusFilter, readFilter, divisionFilter, searchQuery]);

  // Counts for quick metrics
  const counts = useMemo(() => {
    let attended = 0;
    let unattended = 0;
    let inProgress = 0;
    notifications.forEach(n => {
      const s = n.status || (n.read ? 'attended' : 'unattended');
      if (s === 'attended') attended++;
      else if (s === 'in_progress') inProgress++;
      else unattended++;
    });
    return {
      total: notifications.length,
      attended,
      unattended,
      inProgress,
      unread: notifications.filter(n => !n.read).length
    };
  }, [notifications]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Administrative Notifications History
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete operational audit trail of system alerts, division inquiries, and task fulfillment statuses.
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Action */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              notifications.forEach(n => {
                if (!n.read) markNotificationRead(n.id);
              });
            }}
            className="text-xs h-8 gap-1.5 border-border"
          >
            <Check className="w-3.5 h-3.5" />
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card 
          onClick={() => setStatusFilter('all')}
          className={`p-4 border cursor-pointer transition-all hover:border-primary/50 ${
            statusFilter === 'all' ? 'border-primary bg-primary/5' : 'border-border bg-card'
          }`}
        >
          <div className="text-xs text-muted-foreground">Total History</div>
          <div className="text-2xl font-bold font-mono text-foreground mt-1">{counts.total}</div>
          <div className="text-[16px] text-muted-foreground mt-1">All logged events</div>
        </Card>

        <Card 
          onClick={() => setStatusFilter('unattended')}
          className={`p-4 border cursor-pointer transition-all hover:border-amber-500/50 ${
            statusFilter === 'unattended' ? 'border-amber-500 bg-amber-500/5' : 'border-border bg-card'
          }`}
        >
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Unattended</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-500 mt-1">{counts.unattended}</div>
          <div className="text-[16px] text-muted-foreground mt-1">Requires immediate attention</div>
        </Card>

        <Card 
          onClick={() => setStatusFilter('in_progress')}
          className={`p-4 border cursor-pointer transition-all hover:border-blue-500/50 ${
            statusFilter === 'in_progress' ? 'border-blue-500 bg-blue-500/5' : 'border-border bg-card'
          }`}
        >
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>In Progress</span>
            <Clock className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-500 mt-1">{counts.inProgress}</div>
          <div className="text-[16px] text-muted-foreground mt-1">Being actively resolved</div>
        </Card>

        <Card 
          onClick={() => setStatusFilter('attended')}
          className={`p-4 border cursor-pointer transition-all hover:border-emerald-500/50 ${
            statusFilter === 'attended' ? 'border-emerald-500 bg-emerald-500/5' : 'border-border bg-card'
          }`}
        >
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Attended & Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">{counts.attended}</div>
          <div className="text-[16px] text-muted-foreground mt-1">Completed / fulfilled</div>
        </Card>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border border-border bg-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-foreground text-background font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              All ({counts.total})
            </button>
            <button
              onClick={() => setStatusFilter('unattended')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                statusFilter === 'unattended'
                  ? 'bg-amber-600 text-white font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Unattended ({counts.unattended})
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                statusFilter === 'in_progress'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              In Progress ({counts.inProgress})
            </button>
            <button
              onClick={() => setStatusFilter('attended')}
              className={`text-xs px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                statusFilter === 'attended'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Attended ({counts.attended})
            </button>
          </div>

          {/* Search and Division Select */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Division dropdown */}
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="h-8 text-xs px-2.5 rounded-md border border-border bg-background text-foreground"
            >
              <option value="all">All Divisions</option>
              {availableDivisions.map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>

            {/* Read/Unread Filter */}
            <select
              value={readFilter}
              onChange={(e) => setReadFilter(e.target.value as any)}
              className="h-8 text-xs px-2.5 rounded-md border border-border bg-background text-foreground"
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
                className="h-8 pl-8 text-xs bg-[#f8fafc] dark:bg-[#1a1a1a] border-none w-full"
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
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center border border-border bg-card">
            <Bell className="w-8 h-8 mx-auto text-muted-foreground/50 mb-3" />
            <h3 className="text-sm font-semibold text-foreground">No notifications match your filters</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your status filters or search query to view historical notification logs.
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => {
            const currentStatus = notif.status || (notif.read ? 'attended' : 'unattended');
            return (
              <Card 
                key={notif.id} 
                className={`p-4 border transition-colors ${
                  !notif.read ? 'border-primary/40 bg-card/90 shadow-2xs' : 'border-border bg-card/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Status Icon Indicator */}
                    <div className="mt-0.5 shrink-0">
                      {currentStatus === 'attended' && (
                        <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-500" title="Attended / Fulfilled">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                      {currentStatus === 'in_progress' && (
                        <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-500" title="In Progress">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                      {currentStatus === 'unattended' && (
                        <div className="p-1.5 rounded-full bg-amber-500/10 text-amber-500" title="Unattended">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Content details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[16px] text-muted-foreground">{notif.id}</span>
                        {notif.division && (
                          <Badge variant="outline" className="text-[14px] font-medium">
                            {notif.division}
                          </Badge>
                        )}
                        {notif.category && (
                          <span className="text-[14px] uppercase font-mono text-muted-foreground px-1.5 py-0.5 rounded-xs bg-muted">
                            {notif.category}
                          </span>
                        )}
                        {!notif.read && (
                          <span className="text-[14px] font-semibold text-primary px-1.5 py-0.5 rounded-xs bg-primary/10">
                            New
                          </span>
                        )}
                        <span className="text-[16px] text-muted-foreground ml-auto font-mono">
                          {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'text-foreground/90'}`}>
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Status switchers */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border shrink-0 self-end md:self-center">
                    <span className="text-xs text-muted-foreground hidden lg:inline">Status:</span>

                    <button
                      onClick={() => updateNotificationStatus(notif.id, 'unattended')}
                      className={`text-[16px] px-2.5 py-1 rounded-md border transition-colors ${
                        currentStatus === 'unattended'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-semibold'
                          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      Unattended
                    </button>

                    <button
                      onClick={() => updateNotificationStatus(notif.id, 'in_progress')}
                      className={`text-[16px] px-2.5 py-1 rounded-md border transition-colors ${
                        currentStatus === 'in_progress'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-semibold'
                          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      In Progress
                    </button>

                    <button
                      onClick={() => updateNotificationStatus(notif.id, 'attended')}
                      className={`text-[16px] px-2.5 py-1 rounded-md border transition-colors ${
                        currentStatus === 'attended'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 font-semibold'
                          : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      Attended
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
