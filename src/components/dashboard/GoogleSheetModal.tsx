import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Download,
  RefreshCw,
  Settings,
  ListFilter,
  Maximize2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  RotateCw
} from 'lucide-react';
import {
  sheetsSync,
  SyncedSheetOrderRow,
  MonochromaticOrderStatus
} from '@/services/sheetsSync';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  divisionId?: 'bakery' | 'dining' | 'market' | 'games' | 'lounge' | 'water';
  divisionName?: string;
}

export default function GoogleSheetModal({ 
  isOpen, 
  onClose, 
  divisionId = 'dining',
  divisionName = 'Dining & Restaurant'
}: GoogleSheetModalProps) {
  const [sheetUrl, setSheetUrl] = useState(sheetsSync.getGoogleSheetUrl());
  const [webhookUrl, setWebhookUrl] = useState(sheetsSync.getGoogleSheetWebhookUrl());
  const [syncedOrders, setSyncedOrders] = useState<SyncedSheetOrderRow[]>([]);
  const [activeTab, setActiveTab] = useState<'embedded' | 'orders' | 'config'>('embedded');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  const loadData = () => {
    setSheetUrl(sheetsSync.getGoogleSheetUrl());
    setWebhookUrl(sheetsSync.getGoogleSheetWebhookUrl());
    setSyncedOrders(sheetsSync.getSyncedOrders());
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

  // Filter synced orders STRICTLY for this division - No other division details
  const divisionOrders = useMemo(() => {
    const divKey = (divisionId || 'dining').toLowerCase();
    return syncedOrders.filter(order => {
      const d = (order.division || '').toLowerCase();
      if (divKey === 'dining') return d.includes('dining') || d.includes('restaurant') || d.includes('ozzie');
      if (divKey === 'bakery') return d.includes('bakery') || d.includes('bake');
      if (divKey === 'market') return d.includes('market') || d.includes('supermarket') || d.includes('grocer');
      if (divKey === 'games') return d.includes('game') || d.includes('arcade');
      if (divKey === 'lounge') return d.includes('lounge') || d.includes('bar');
      if (divKey === 'water') return d.includes('water') || d.includes('orville');
      return d === divKey;
    });
  }, [syncedOrders, divisionId]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return divisionOrders;
    return divisionOrders.filter(order => 
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.itemName.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query)
    );
  }, [divisionOrders, searchQuery]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    sheetsSync.setGoogleSheetUrl(sheetUrl);
    sheetsSync.setGoogleSheetWebhookUrl(webhookUrl);
    toast({
      title: "Sheet Configuration Saved",
      description: "Google Sheet URL and Webhook updated successfully."
    });
  };

  const handleExportCSV = () => {
    sheetsSync.exportOrdersToCSV();
    toast({
      title: "Orders CSV Exported",
      description: `Downloaded orders for ${divisionName}.`
    });
  };

  const handleReloadIframe = () => {
    setIsReloading(true);
    setIframeKey(k => k + 1);
    setTimeout(() => setIsReloading(false), 600);
  };

  // Convert raw Google Sheets URL to an embeddable preview URL
  const getEmbeddableSheetUrl = (rawUrl: string): string => {
    if (!rawUrl || !rawUrl.includes('google.com/spreadsheets/d/')) {
      return 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview?widget=true&headers=false';
    }
    let clean = rawUrl.split('/edit')[0];
    return `${clean}/preview?widget=true&headers=false`;
  };

  const getStatusBadge = (status: MonochromaticOrderStatus | string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Pending
        </span>
      );
    }
    if (s === 'cooking') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
          Cooking
        </span>
      );
    }
    if (s === 'ready') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          Ready
        </span>
      );
    }
    if (s === 'in transit' || s === 'in_transit') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          In Transit
        </span>
      );
    }
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border/40">
        Cancelled
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-background text-foreground flex flex-col overflow-hidden animate-in fade-in duration-150">
      
      {/* 1. Sleek Fullscreen Top Navigation */}
      <header className="h-14 px-4 sm:px-6 border-b border-border/40 bg-card/95 backdrop-blur-md flex items-center justify-between shrink-0 gap-4">
        
        {/* Left: Division Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
                {divisionName} Spreadsheet
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
          </div>
        </div>

        {/* Center: Clean Minimalist Tabs */}
        <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/30 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('embedded')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'embedded'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Live Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'orders'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Synced Orders ({divisionOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'config'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* Right: Actions & Close Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleReloadIframe}
            disabled={isReloading}
            className="h-8 text-xs font-semibold gap-1.5 border-border/60 hover:bg-muted cursor-pointer"
            title="Reload live spreadsheet"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Reload</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-8 text-xs font-semibold gap-1.5 border-border/60 hover:bg-muted cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={() => sheetsSync.openGoogleSheet()}
            className="h-8 text-xs font-bold gap-1.5 bg-orange-500 hover:bg-orange-600 text-white border-none cursor-pointer shadow-xs"
            title="Open in external Google Sheets"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open in Sheets</span>
          </Button>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer border-none ml-1"
            title="Close spreadsheet viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Full-Screen Workspace Body */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        
        {/* TAB 1: LIVE IN-APP SHEET (FULL SCREEN EMBEDDED VIEWER) */}
        {activeTab === 'embedded' && (
          <div className="flex-1 w-full h-full p-2 sm:p-4 flex flex-col min-h-0">
            <div className="flex-1 w-full h-full rounded-2xl overflow-hidden border border-border/40 bg-card shadow-sm relative">
              <iframe
                key={iframeKey}
                src={getEmbeddableSheetUrl(sheetUrl)}
                title={`${divisionName} Google Sheet`}
                className="w-full h-full border-none bg-white"
                allow="autoplay; clipboard-write; encrypted-media"
              />
            </div>
          </div>
        )}

        {/* TAB 2: DIVISION SYNCED ORDERS TABLE */}
        {activeTab === 'orders' && (
          <div className="flex-1 w-full h-full p-4 sm:p-6 flex flex-col space-y-4 overflow-hidden max-w-7xl mx-auto">
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${divisionName} orders by ID, customer, item...`}
                  className="pl-9 text-xs h-9 bg-card border-border/50"
                />
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-muted-foreground font-mono">
                  {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'} recorded
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportCSV}
                  className="h-8 text-xs font-semibold gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Table</span>
                </Button>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="flex-1 rounded-2xl border border-border/40 overflow-hidden bg-card shadow-xs flex flex-col min-h-0">
              <div className="overflow-x-auto overflow-y-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-muted/60 text-muted-foreground uppercase text-[10px] tracking-wider sticky top-0 z-10 backdrop-blur-xs font-semibold border-b border-border/40">
                    <tr>
                      <th className="py-3 px-3.5">Order ID</th>
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Items Ordered</th>
                      <th className="py-3 px-3 text-right">Unit Price</th>
                      <th className="py-3 px-3 text-center">Qty</th>
                      <th className="py-3 px-3 text-right">Total Amount</th>
                      <th className="py-3 px-3">Destination</th>
                      <th className="py-3 px-3">Seat / Address</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3">Confirmed</th>
                      <th className="py-3 px-3">Ready</th>
                      <th className="py-3 px-3">Finished</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="py-16 text-center text-muted-foreground">
                          <FileSpreadsheet className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                          <p className="font-semibold text-xs text-foreground">No synced orders found</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            When customers place orders in {divisionName}, they sync here automatically.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o, idx) => (
                        <tr 
                          key={o.orderId || idx}
                          className="hover:bg-muted/40 transition-colors"
                        >
                          <td className="py-3 px-3.5 font-mono font-bold text-foreground whitespace-nowrap">
                            #{o.orderId}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-muted-foreground text-[11px]">
                            {o.placedDate} <span className="opacity-75">{o.placedTime}</span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-foreground whitespace-nowrap">{o.customerName}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{o.customerPhone}</p>
                          </td>
                          <td className="py-3 px-3 font-medium text-foreground max-w-[200px] truncate" title={o.itemName}>
                            {o.itemName}
                          </td>
                          <td className="py-3 px-3 font-mono text-muted-foreground text-right whitespace-nowrap">
                            {o.unitPrice}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-foreground text-center">
                            {o.quantity}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-foreground text-right whitespace-nowrap">
                            {o.totalAmount}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap capitalize text-foreground font-medium">
                            {o.destination}
                            {o.deliveryMethod && o.deliveryMethod !== 'N/A' && (
                              <span className="block text-[10px] text-muted-foreground">({o.deliveryMethod})</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-[11px] max-w-[150px] truncate text-muted-foreground" title={o.deliveryAddress !== 'N/A' ? o.deliveryAddress : o.seatNumber}>
                            {o.deliveryAddress !== 'N/A' ? o.deliveryAddress : (o.seatNumber !== 'N/A' ? o.seatNumber : '-')}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {getStatusBadge(o.status)}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {o.confirmedTime || '-'}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {o.readyTime || '-'}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {o.completedTime || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS CONFIGURATION */}
        {activeTab === 'config' && (
          <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-y-auto max-w-2xl mx-auto flex flex-col justify-center">
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Google Sheet Synchronization Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure the Google Spreadsheet link and optional webhook endpoint for {divisionName}.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Google Sheet URL</label>
                  <Input
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must be set to "Anyone with the link can view/edit" in Google Drive share settings.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Apps Script Webhook Endpoint (Optional)</label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Optional webhook to push order status updates directly into rows via Google Apps Script.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveConfig}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs border-none cursor-pointer shadow-xs"
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
