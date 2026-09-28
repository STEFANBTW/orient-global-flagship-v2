import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Download,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Settings,
  ListFilter,
  Code2,
  Plus,
  UtensilsCrossed,
  Croissant,
  Droplets,
  Gamepad2,
  Store,
  Wine,
  Maximize2,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import {
  sheetsSync,
  SyncedSheetOrderRow,
  ORIENT_DIVISIONS,
  DivisionSheetConfig,
  MonochromaticOrderStatus
} from '@/services/sheetsSync';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleSheetModal({ isOpen, onClose }: GoogleSheetModalProps) {
  const [sheetUrl, setSheetUrl] = useState(sheetsSync.getGoogleSheetUrl());
  const [webhookUrl, setWebhookUrl] = useState(sheetsSync.getGoogleSheetWebhookUrl());
  const [syncedOrders, setSyncedOrders] = useState<SyncedSheetOrderRow[]>([]);
  const [activeDivisionSheets, setActiveDivisionSheets] = useState<string[]>(sheetsSync.getActiveDivisionSheets());
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'embedded' | 'orders' | 'divisions' | 'config' | 'script'>('embedded');
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isCreatingDivisionModalOpen, setIsCreatingDivisionModalOpen] = useState(false);

  const loadData = () => {
    setSheetUrl(sheetsSync.getGoogleSheetUrl());
    setWebhookUrl(sheetsSync.getGoogleSheetWebhookUrl());
    setSyncedOrders(sheetsSync.getSyncedOrders());
    setActiveDivisionSheets(sheetsSync.getActiveDivisionSheets());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleSync = () => loadData();
    window.addEventListener('orient_sheets_synced', handleSync);
    window.addEventListener('orient_sheets_config_changed', handleSync);
    return () => {
      window.removeEventListener('orient_sheets_synced', handleSync);
      window.removeEventListener('orient_sheets_config_changed', handleSync);
    };
  }, []);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    sheetsSync.setGoogleSheetUrl(sheetUrl);
    sheetsSync.setGoogleSheetWebhookUrl(webhookUrl);
    toast({
      title: "Master Sheet Config Saved",
      description: "URLs updated for all 6 division sheets."
    });
  };

  const handleCopyScript = () => {
    const script = sheetsSync.getAppsScriptTemplate();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(script);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast({
        title: "Script Copied!",
        description: "Paste into your Google Sheet's Apps Script editor to auto-manage all 6 division sheets."
      });
    }
  };

  const handleExportCSV = () => {
    sheetsSync.exportOrdersToCSV();
    toast({
      title: "Master Orders CSV Exported",
      description: "Downloaded with full monochromatic column layout."
    });
  };

  const handleClearLog = () => {
    if (window.confirm("Are you sure you want to clear the local sheet sync buffer?")) {
      sheetsSync.clearSyncedOrders();
      setSyncedOrders([]);
      toast({ title: "Sync Buffer Cleared" });
    }
  };

  const handleCreateDivisionSheet = async (divConfig: DivisionSheetConfig) => {
    const success = await sheetsSync.addDivisionSheet(divConfig.name);
    if (success) {
      setActiveDivisionSheets(sheetsSync.getActiveDivisionSheets());
      setIsCreatingDivisionModalOpen(false);
      toast({
        title: `Sheet Created: ${divConfig.name}`,
        description: `Successfully provisioned tab for ${divConfig.name} in your Master Google Sheet with monochromatic styling.`
      });
    }
  };

  // Convert raw Google Sheets URL to a clean embedded iframe URL
  const getEmbeddableSheetUrl = (rawUrl: string): string => {
    if (!rawUrl || !rawUrl.includes('google.com/spreadsheets/d/')) {
      return 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview?widget=true&headers=false';
    }
    // Replace /edit with /preview for clean inline embedding
    let clean = rawUrl.split('/edit')[0];
    return `${clean}/preview?widget=true&headers=false`;
  };

  const filteredOrders = syncedOrders.filter(order => {
    const matchesDiv = selectedDivisionFilter === 'all' || order.division.toLowerCase() === selectedDivisionFilter.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesDiv;
    const matchesSearch = 
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.itemName.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query);
    return matchesDiv && matchesSearch;
  });

  const getDivisionIcon = (id: string) => {
    switch (id) {
      case 'dining': return <UtensilsCrossed className="w-4 h-4 text-foreground" />;
      case 'bakery': return <Croissant className="w-4 h-4 text-foreground" />;
      case 'water': return <Droplets className="w-4 h-4 text-foreground" />;
      case 'games': return <Gamepad2 className="w-4 h-4 text-foreground" />;
      case 'market': return <Store className="w-4 h-4 text-foreground" />;
      case 'lounge': return <Wine className="w-4 h-4 text-foreground" />;
      default: return <FileSpreadsheet className="w-4 h-4 text-foreground" />;
    }
  };

  const getMonochromeStatusBadge = (status: MonochromaticOrderStatus | string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
          Pending
        </span>
      );
    }
    if (s === 'cooking') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-600 text-white dark:bg-neutral-600 border border-neutral-500">
          Cooking
        </span>
      );
    }
    if (s === 'ready') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-800 text-white dark:bg-neutral-700 border border-neutral-600">
          Ready
        </span>
      );
    }
    if (s === 'in transit' || s === 'in_transit') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-900 text-white dark:bg-black border border-neutral-700 shadow-xs">
          <span>In Transit</span>
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-black text-white dark:bg-white dark:text-black border border-neutral-900 dark:border-white shadow-xs">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-500 line-through dark:bg-neutral-900 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-800">
        Cancelled
      </span>
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm sm:p-4 overflow-hidden animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full h-[100dvh] sm:h-[92vh] sm:max-w-6xl bg-card text-card-foreground border-none sm:border border-border/80 shadow-2xl rounded-none sm:rounded-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Monochromatic Executive Header */}
        <div className="px-5 py-3.5 border-b border-border/80 bg-neutral-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-white font-mono">
                  ORIENT GLOBAL — MASTER GOOGLE SHEETS
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase tracking-wider">
                  6-Division Workbook
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                1 Master Document • Automated Chef Status Tracking • Monochromatic Hierarchy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setIsCreatingDivisionModalOpen(true)}
              className="h-8 px-3 text-xs font-bold bg-white text-black hover:bg-neutral-200 border-none transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Google Sheet</span>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Monochromatic Tab Navigation */}
        <div className="px-5 pt-2.5 border-b border-border/60 bg-muted/20 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('embedded')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'embedded'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Live In-App Sheet</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Orders Stream ({syncedOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('divisions')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'divisions'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>6 Division Sheets</span>
            </button>

            <button
              onClick={() => setActiveTab('script')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Auto-Sync Script</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-black shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => sheetsSync.openGoogleSheet()}
              className="h-7 text-xs font-bold gap-1 text-foreground border-border hover:bg-muted cursor-pointer"
            >
              <span>Open in Google Sheets</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: EMBEDDED LIVE GOOGLE SHEET (NEVER LEAVE ORIENT) */}
          {activeTab === 'embedded' && (
            <div className="h-full flex flex-col space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-border/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-foreground">
                    Live Embedded Google Sheet Window
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    (6 Division Tabs Loaded Inside Orient)
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIframeKey(prev => prev + 1)}
                    className="h-7 text-xs font-semibold gap-1 text-foreground hover:bg-muted"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reload Sheet</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="h-7 text-xs font-semibold gap-1 text-foreground hover:bg-muted"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export CSV</span>
                  </Button>
                </div>
              </div>

              {/* Embedded Interactive Iframe */}
              <div className="flex-1 min-h-[460px] sm:min-h-[520px] rounded-xl overflow-hidden border border-border/80 bg-neutral-950 relative shadow-inner">
                <iframe
                  key={iframeKey}
                  src={getEmbeddableSheetUrl(sheetUrl)}
                  title="Orient Master Google Sheet"
                  className="w-full h-full border-none bg-white"
                  allow="autoplay; clipboard-write; encrypted-media"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
                <span>All 6 division tabs are visible at the bottom of the sheet.</span>
                <span>Chef button clicks update rows in real-time hands-free.</span>
              </div>
            </div>
          )}

          {/* TAB 2: ORDER STREAM (ALL DETAILED COLUMNS) */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                    Division Filter:
                  </span>
                  <button
                    onClick={() => setSelectedDivisionFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                      selectedDivisionFilter === 'all'
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All ({syncedOrders.length})
                  </button>

                  {ORIENT_DIVISIONS.map(div => (
                    <button
                      key={div.id}
                      onClick={() => setSelectedDivisionFilter(div.name)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                        selectedDivisionFilter.toLowerCase() === div.name.toLowerCase()
                          ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                          : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {div.name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by order ID, item, customer..."
                    className="h-8 text-xs w-full sm:w-60 bg-background"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="h-8 text-xs font-bold gap-1 text-foreground shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </Button>
                </div>
              </div>

              {/* Table of Orders with Monochromatic Styling */}
              <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 overflow-hidden shadow-xs bg-card">
                <div className="overflow-x-auto max-h-[460px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#18181B] text-white uppercase text-[10px] tracking-wider sticky top-0 z-10 font-mono">
                      <tr>
                        <th className="py-3 px-3 border-b border-neutral-700">Order ID</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Date & Time</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Customer</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Items Ordered</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Unit Price</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Qty</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Total Amount</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Destination</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Seat / Address</th>
                        <th className="py-3 px-3 border-b border-neutral-700 text-center">Status</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Confirmed</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Ready</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Finished</th>
                        <th className="py-3 px-3 border-b border-neutral-700">Division</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={14} className="py-12 text-center text-muted-foreground text-xs">
                            No synced orders matching this filter yet. When an order is placed, it appears here automatically.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o, idx) => (
                          <tr 
                            key={o.orderId || idx}
                            className={`transition-colors ${
                              idx % 2 === 0 ? 'bg-white dark:bg-neutral-950' : 'bg-neutral-50 dark:bg-neutral-900/60'
                            } hover:bg-neutral-100 dark:hover:bg-neutral-800/80`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                              {o.orderId}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap text-muted-foreground">
                              {o.placedDate} <span className="text-[10px] opacity-75">{o.placedTime}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <p className="font-semibold text-foreground whitespace-nowrap">{o.customerName}</p>
                              <p className="text-[10px] text-muted-foreground whitespace-nowrap">{o.customerPhone}</p>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-foreground max-w-[180px] truncate" title={o.itemName}>
                              {o.itemName}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-muted-foreground whitespace-nowrap">
                              {o.unitPrice}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-foreground text-center">
                              {o.quantity}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                              {o.totalAmount}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className="font-medium text-foreground">{o.destination}</span>
                              {o.deliveryMethod && o.deliveryMethod !== 'N/A' && (
                                <span className="block text-[10px] text-muted-foreground">({o.deliveryMethod})</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] max-w-[140px] truncate text-muted-foreground" title={o.deliveryAddress !== 'N/A' ? o.deliveryAddress : o.seatNumber}>
                              {o.deliveryAddress !== 'N/A' ? o.deliveryAddress : (o.seatNumber !== 'N/A' ? o.seatNumber : '—')}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              {getMonochromeStatusBadge(o.status)}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {o.confirmedTime || '—'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {o.readyTime || '—'}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                              {o.completedTime || '—'}
                            </td>
                            <td className="py-2.5 px-3 font-medium whitespace-nowrap text-foreground text-[11px]">
                              {o.division}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Showing {filteredOrders.length} order row(s) synced in Google Sheet buffer</span>
                <button
                  onClick={handleClearLog}
                  className="text-red-500 hover:text-red-600 font-semibold cursor-pointer text-xs"
                >
                  Clear Buffer Log
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: 6 DIVISION SHEETS MANAGER */}
          {activeTab === 'divisions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-mono">
                    MASTER WORKBOOK DIVISION TABS
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    All 6 business divisions operate within the single master document.
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsCreatingDivisionModalOpen(true)}
                  className="h-8 text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Division Tab</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {ORIENT_DIVISIONS.map((div) => {
                  const isActive = activeDivisionSheets.includes(div.name);
                  const orderCount = syncedOrders.filter(o => o.division.toLowerCase() === div.name.toLowerCase()).length;

                  return (
                    <div
                      key={div.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'border-neutral-800 dark:border-neutral-700 bg-card shadow-xs'
                          : 'border-dashed border-border bg-muted/20 opacity-70'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-foreground">
                            {getDivisionIcon(div.id)}
                          </div>
                          <div>
                            <h5 className="text-sm font-bold text-foreground font-sans">
                              {div.name}
                            </h5>
                            <p className="text-[11px] text-muted-foreground">
                              {div.tagline}
                            </p>
                          </div>
                        </div>

                        {isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            Unprovisioned
                          </span>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">
                          Synced Orders: <strong className="text-foreground">{orderCount}</strong>
                        </span>

                        {!isActive ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCreateDivisionSheet(div)}
                            className="h-7 text-xs font-bold"
                          >
                            <span>Create Tab</span>
                          </Button>
                        ) : (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            Tab: "{div.tabName}"
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: APPS SCRIPT WEBHOOK SETUP */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-mono">
                    GOOGLE APPS SCRIPT WEBHOOK DEPLOYMENT
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Copy and paste this script into your Google Sheet to enable automated zero-typing status tracking and 6-division routing.
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={handleCopyScript}
                  className="h-8 text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black gap-1.5"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied to Clipboard' : 'Copy Full Script'}</span>
                </Button>
              </div>

              <div className="bg-neutral-950 text-neutral-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[380px] border border-neutral-800">
                <pre>{sheetsSync.getAppsScriptTemplate()}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs space-y-1.5">
                <p className="font-bold text-foreground">30-Second Webhook Setup:</p>
                <ol className="list-decimal pl-4 space-y-1 text-muted-foreground">
                  <li>In your Google Sheet, click <strong>Extensions &gt; Apps Script</strong>.</li>
                  <li>Replace any existing code with the copied script above and click <strong>Save</strong>.</li>
                  <li>Click <strong>Deploy &gt; New deployment</strong>, select <strong>Web app</strong>.</li>
                  <li>Set <em>Execute as</em> to <strong>Me</strong> and <em>Who has access</em> to <strong>Anyone</strong>.</li>
                  <li>Click <strong>Deploy</strong> and paste the Web App URL into the <strong>Settings</strong> tab here!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 5: CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-foreground font-mono">
                  MASTER WORKBOOK CONFIGURATION
                </h4>
                <p className="text-xs text-muted-foreground">
                  Set your Google Sheet URL and Webhook endpoint for live real-time sync.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Master Google Sheet URL
                  </label>
                  <Input
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="text-xs font-mono bg-background"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    The URL of your master Google Sheet containing the division tabs.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">
                    Google Apps Script Webhook URL (Optional for Direct HTTP POST)
                  </label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="text-xs font-mono bg-background"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    When provided, orders and chef button clicks update your Google Sheet in the background automatically.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveConfig}
                    className="h-8 text-xs font-bold bg-neutral-900 text-white dark:bg-white dark:text-black"
                  >
                    Save Settings
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="h-8 text-xs font-bold text-foreground"
                  >
                    Export Full Orders CSV
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* DIVISION SELECTOR MODAL (WHEN USER CLICKS "CREATE GOOGLE SHEET") */}
        {isCreatingDivisionModalOpen && (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
            onClick={() => setIsCreatingDivisionModalOpen(false)}
          >
            <div 
              className="bg-card text-card-foreground border border-neutral-700 shadow-2xl rounded-2xl max-w-lg w-full p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-foreground" />
                  <h4 className="text-base font-bold text-foreground font-mono">
                    Select Division to Create Sheet
                  </h4>
                </div>
                <button
                  onClick={() => setIsCreatingDivisionModalOpen(false)}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground">
                All sheets are created as tabs <strong>within your single master document</strong>. Choose a division below to provision its sheet with monochromatic headers and automated order routing:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {ORIENT_DIVISIONS.map((div) => {
                  const alreadyActive = activeDivisionSheets.includes(div.name);

                  return (
                    <div
                      key={div.id}
                      onClick={() => handleCreateDivisionSheet(div)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        alreadyActive
                          ? 'border-neutral-700 bg-muted/40 hover:bg-muted/70'
                          : 'border-border/80 hover:border-foreground hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-foreground">
                          {getDivisionIcon(div.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-foreground font-sans">
                              {div.name}
                            </span>
                            {alreadyActive && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-neutral-900 text-white dark:bg-white dark:text-black">
                                Existing Tab
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            {div.tagline}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={alreadyActive ? "secondary" : "default"}
                        className="h-7 text-xs font-bold shrink-0"
                      >
                        {alreadyActive ? 'Select Tab' : 'Create Sheet Tab'}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <span>Creates tab with monochromatic headers and styling.</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsCreatingDivisionModalOpen(false)}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
