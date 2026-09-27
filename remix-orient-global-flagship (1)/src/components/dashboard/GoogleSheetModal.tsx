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
  CheckCircle2,
  Settings,
  ListFilter,
  Code2,
  AlertCircle
} from 'lucide-react';
import { sheetsSync, SyncedSheetOrderRow } from '@/services/sheetsSync';
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
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'config' | 'script'>('orders');

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

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    sheetsSync.setGoogleSheetUrl(sheetUrl);
    sheetsSync.setGoogleSheetWebhookUrl(webhookUrl);
    toast({
      title: "Google Sheet Settings Saved",
      description: "URLs updated and ready for automatic order sync."
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
        description: "Paste into your Google Sheet's Apps Script editor."
      });
    }
  };

  const handleExportCSV = () => {
    sheetsSync.exportOrdersToCSV();
    toast({
      title: "Orders CSV Exported",
      description: "File downloaded. You can import this directly into Google Sheets."
    });
  };

  const handleClearLog = () => {
    if (window.confirm("Are you sure you want to clear the local sync history buffer?")) {
      sheetsSync.clearSyncedOrders();
      setSyncedOrders([]);
      toast({ title: "Sync Buffer Cleared" });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs sm:p-4 overflow-hidden animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full h-[100dvh] sm:h-auto sm:max-h-[88vh] sm:max-w-3xl bg-card text-card-foreground border-none sm:border border-border/60 shadow-2xl rounded-none sm:rounded-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/40 bg-muted/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Google Sheets Real-Time Sync</h3>
                <Badge variant="outline" className="text-[10px] font-bold border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                  Live Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Automatic order entries with all allocated fields & instant stock decrement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-border/30 bg-muted/10 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Synced Orders ({syncedOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Sheet Configuration</span>
            </button>

            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'script'
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Auto-Sync Script</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => sheetsSync.openGoogleSheet()}
              className="h-7 text-xs font-semibold gap-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 cursor-pointer"
            >
              <span>Open Sheet</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* TAB 1: SYNCED ORDERS LOG */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Live Logged Sheet Entries
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleExportCSV}
                    className="h-7 text-xs font-medium gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download CSV</span>
                  </Button>
                  {syncedOrders.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleClearLog}
                      className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              {syncedOrders.length === 0 ? (
                <div className="p-8 text-center bg-muted/20 rounded-xl border border-dashed border-border/50 space-y-2">
                  <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground/60" />
                  <p className="text-sm font-semibold text-foreground">No synced orders yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Place an order anywhere in the store or dining menu. It will automatically populate here and in your connected Google Sheet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {syncedOrders.map((order, idx) => (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs space-y-2 transition-all hover:bg-muted/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-foreground">#{order.orderId}</span>
                            <Badge className="text-[9px] px-1.5 py-0 font-bold bg-emerald-600 text-white border-none">
                              {order.destination}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border">
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-xs font-semibold text-foreground mt-0.5">{order.customerName} ({order.customerPhone})</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-sm text-foreground">{order.totalAmount}</span>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {order.placedDate} {order.placedTime}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/20 text-[11px] text-muted-foreground">
                        <div>
                          <span className="block text-[10px] text-muted-foreground/70">Routing:</span>
                          <span className="font-medium text-foreground">
                            {order.destination === 'Dine-In' ? `Seat: ${order.seatNumber}` : `${order.deliveryMethod} (${order.deliveryAddress})`}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground/70">Reservation:</span>
                          <span className="font-medium text-foreground">
                            {order.reservedDate !== 'N/A' ? `${order.reservedDate} @ ${order.reservedTime}` : 'Immediate'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground/70">Division:</span>
                          <span className="font-medium capitalize text-foreground">{order.division}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-muted-foreground/70">Synced Status:</span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">✅ Transferred</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-lg bg-background border border-border/30 text-[11px]">
                        <span className="text-muted-foreground">Items: </span>
                        <span className="font-medium text-foreground">{order.items}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SHEET CONFIGURATION */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Connected Google Sheet URL
                </span>
                <p className="text-xs text-muted-foreground">
                  The link to your Google Spreadsheet where order rows and catalog data reside.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="text-xs font-mono"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveConfig}
                    className="text-xs font-bold shrink-0 bg-primary text-primary-foreground"
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Google Apps Script Webhook URL (Recommended)
                  </span>
                  <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                    Instant Row Injection
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste your Google Apps Script Web App URL below. When configured, every placed order will immediately append a row directly into your Google Sheet in the background!
                </p>
                <div className="flex gap-2">
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="text-xs font-mono"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveConfig}
                    className="text-xs font-bold shrink-0 bg-primary text-primary-foreground"
                  >
                    Save
                  </Button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Always Buffered & Never Lost</span>
                </div>
                <p className="text-emerald-800/80 dark:text-emerald-200/80 leading-relaxed">
                  Even if your Google Sheet is offline or you haven't deployed a webhook yet, Orient automatically logs and formats every order locally. You can export the spreadsheet anytime using the "Download CSV" button.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: AUTO-SYNC SCRIPT */}
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">30-Second Google Sheet Setup</span>
                  <Button
                    size="sm"
                    onClick={handleCopyScript}
                    className="h-7 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy Script'}</span>
                  </Button>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>In your Google Sheet, click <strong className="text-foreground">Extensions &gt; Apps Script</strong>.</li>
                  <li>Delete any existing code and paste the script below.</li>
                  <li>Click <strong className="text-foreground">Deploy &gt; New deployment</strong>.</li>
                  <li>Select type: <strong className="text-foreground">Web app</strong>.</li>
                  <li>Set <em>Execute as</em>: <strong>Me</strong>, and <em>Who has access</em>: <strong>Anyone</strong>.</li>
                  <li>Click <strong>Deploy</strong> and paste the resulting Web App URL into the <strong>Sheet Configuration</strong> tab.</li>
                </ol>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-64 border border-border/40 leading-relaxed">
                  {sheetsSync.getAppsScriptTemplate()}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border/40 bg-card/95 backdrop-blur-md flex items-center justify-end shrink-0">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto px-6 h-11 sm:h-9 text-xs font-bold bg-foreground text-background hover:bg-foreground/90 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}
