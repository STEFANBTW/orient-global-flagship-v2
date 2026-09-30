import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  Download,
  Copy,
  Plus,
  Trash2,
  Search,
  Settings,
  Table as TableIcon,
  Maximize2,
  Check,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  sheetsSync,
  SyncedSheetOrderRow,
  SHEET_COLUMNS,
  SheetColumnDef,
  getDivisionSheetTitle,
  getCreateGoogleSheetUrl
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
  divisionName = "Ozzie's Restaurant"
}: GoogleSheetModalProps) {
  const [sheetUrl, setSheetUrl] = useState(sheetsSync.getGoogleSheetUrl());
  const [webhookUrl, setWebhookUrl] = useState(sheetsSync.getGoogleSheetWebhookUrl());
  const [syncedOrders, setSyncedOrders] = useState<SyncedSheetOrderRow[]>([]);
  const [activeTab, setActiveTab] = useState<'grid' | 'embed' | 'settings'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: keyof SyncedSheetOrderRow } | null>(null);
  const [cellDraftValue, setCellDraftValue] = useState<string>('');
  const [copiedHeaders, setCopiedHeaders] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const sheetTitle = useMemo(() => getDivisionSheetTitle(divisionName), [divisionName]);

  const loadData = () => {
    setSheetUrl(sheetsSync.getGoogleSheetUrl());
    setWebhookUrl(sheetsSync.getGoogleSheetWebhookUrl());
    setSyncedOrders(sheetsSync.getSyncedOrders());
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      // Lock body scroll to enforce 100% fullscreen modal
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
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

  useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  // Filter synced orders STRICTLY for this division
  const divisionOrders = useMemo(() => {
    const divKey = (divisionId || 'dining').toLowerCase();
    return syncedOrders.filter(order => {
      const d = (order.division || order.divisionId || '').toLowerCase();
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
    return divisionOrders.filter(row => 
      String(row.order_id || '').toLowerCase().includes(query) ||
      String(row.customer_name || '').toLowerCase().includes(query) ||
      String(row.customer_phone || '').includes(query) ||
      String(row.name_of_item || '').toLowerCase().includes(query) ||
      String(row.status || '').toLowerCase().includes(query) ||
      String(row.destination || '').toLowerCase().includes(query)
    );
  }, [divisionOrders, searchQuery]);

  if (!isOpen) return null;

  // Convert raw Google Sheets URL to an embeddable direct edit URL (/edit?rm=minimal)
  const getEmbeddableSheetUrl = (rawUrl: string): string => {
    if (!rawUrl || !rawUrl.includes('google.com/spreadsheets/d/')) {
      return '';
    }
    const clean = rawUrl.split('/edit')[0].split('/preview')[0].split('?')[0];
    return `${clean}/edit?rm=minimal`;
  };

  const handleStartEdit = (rowId: string, field: keyof SyncedSheetOrderRow, currentValue: any) => {
    setEditingCell({ rowId, field });
    setCellDraftValue(currentValue !== undefined && currentValue !== null ? String(currentValue) : '');
  };

  const handleCommitEdit = () => {
    if (!editingCell) return;
    const { rowId, field } = editingCell;
    const updated = syncedOrders.map(row => {
      if (row.row_id === rowId) {
        const newRow: any = { ...row, [field]: cellDraftValue, updated_at: new Date().toISOString() };
        
        // Auto-recalculate item_total_price if price or quantity changed
        if (field === 'item_unit_price' || field === 'item_quantity') {
          const uPrice = Number(field === 'item_unit_price' ? cellDraftValue : newRow.item_unit_price) || 0;
          const uQty = Number(field === 'item_quantity' ? cellDraftValue : newRow.item_quantity) || 1;
          newRow.item_total_price = uPrice * uQty;
        }

        // Conditional rules when destination changes
        if (field === 'destination') {
          const dest = String(cellDraftValue).toLowerCase();
          if (dest === 'takeaway') {
            newRow.reserved_date = '';
            newRow.reserved_time = '';
            newRow.table_number = '';
            if (!newRow.delivery_method) newRow.delivery_method = 'pickup';
          } else if (dest === 'dine-in') {
            newRow.delivery_method = '';
            newRow.delivery_address = '';
          }
        }

        // Conditional rules when delivery_method changes
        if (field === 'delivery_method' && String(cellDraftValue).toLowerCase() !== 'delivery') {
          newRow.delivery_address = '';
        }

        return newRow;
      }
      return row;
    });

    sheetsSync.saveSyncedOrders(updated);
    setSyncedOrders(updated);
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommitEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleAddRow = () => {
    const newRow = sheetsSync.addEmptyRow(divisionName, divisionId);
    setSyncedOrders(sheetsSync.getSyncedOrders());
    toast({
      title: "New Row Added",
      description: `Added row for ${newRow.order_id}. Click any cell to type and edit.`
    });
  };

  const handleDeleteRow = (rowId: string) => {
    sheetsSync.deleteRow(rowId);
    setSyncedOrders(sheetsSync.getSyncedOrders());
    toast({
      title: "Row Removed",
      description: "Row deleted from the spreadsheet."
    });
  };

  const handleExportCSV = () => {
    sheetsSync.exportOrdersToCSV(`${divisionId}_orders_sheet.csv`, divisionOrders);
    toast({
      title: "CSV Exported",
      description: `Downloaded ${divisionOrders.length} rows with all 28 operational columns.`
    });
  };

  const handleCopyHeaders = async () => {
    const success = await sheetsSync.copyHeadersToClipboard();
    if (success) {
      setCopiedHeaders(true);
      setTimeout(() => setCopiedHeaders(false), 2000);
      toast({
        title: "28 Columns Copied!",
        description: "Paste directly into row 1 of your Google Sheet."
      });
    }
  };

  const handleOpenGoogleSheet = () => {
    sheetsSync.openGoogleSheet(divisionName);
  };

  const handleSaveConfig = () => {
    sheetsSync.setGoogleSheetUrl(sheetUrl);
    sheetsSync.setGoogleSheetWebhookUrl(webhookUrl);
    toast({
      title: "Settings Saved",
      description: "Google Sheet connection settings updated."
    });
    setIframeKey(k => k + 1);
  };

  const embedUrl = getEmbeddableSheetUrl(sheetUrl);

  const modalContent = (
    <div className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[99999] w-screen h-screen m-0 p-0 bg-background text-foreground flex flex-col overflow-hidden animate-in fade-in duration-100">
      
      {/* 1. Fullscreen Monochromatic Header Bar (No live pulsating dot or button) */}
      <header className="h-14 px-4 sm:px-6 border-b border-border/40 bg-card/95 backdrop-blur-md flex items-center justify-between shrink-0 gap-3">
        
        {/* Left: Division Sheet Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-muted/80 text-foreground border border-border/60 flex items-center justify-center shrink-0 shadow-2xs">
            <FileSpreadsheet className="w-4 h-4 text-orange-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground truncate">
              {sheetTitle}
            </h1>
            <p className="text-[11px] text-muted-foreground truncate">
              28 Operational Columns · Direct In-Cell Editing · Option 1 Item Expansion
            </p>
          </div>
        </div>

        {/* Center: Minimal Navigation Tabs */}
        <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/40 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'grid'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Spreadsheet Grid ({divisionOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'embed'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Google Sheet Embed</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border-none ${
              activeTab === 'settings'
                ? 'bg-foreground text-background shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        {/* Right: Quick Operational Actions & Close Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyHeaders}
            className="h-8 text-xs font-semibold gap-1.5 border-border/60 hover:bg-muted cursor-pointer"
            title="Copy 28 Columns to Clipboard (TSV format for Google Sheets)"
          >
            {copiedHeaders ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedHeaders ? 'Copied' : 'Copy 28 Cols'}</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCSV}
            className="h-8 text-xs font-semibold gap-1.5 border-border/60 hover:bg-muted cursor-pointer"
            title="Download CSV file with 28 columns"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </Button>

          <Button
            size="sm"
            onClick={handleOpenGoogleSheet}
            className="h-8 text-xs font-bold gap-1.5 bg-orange-500 hover:bg-orange-600 text-white border-none cursor-pointer shadow-xs"
            title={sheetUrl ? "Open connected Google Sheet" : "Create new Google Sheet with this document title"}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sheetUrl ? 'Open Sheet' : 'Create Sheet'}</span>
          </Button>

          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer border-none ml-1"
            title="Close Fullscreen Sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. Workspace Body */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        
        {/* ========================================================================= */}
        {/* TAB 1: INTERACTIVE SPREADSHEET GRID (Direct In-Cell Editing)               */}
        {/* ========================================================================= */}
        {activeTab === 'grid' && (
          <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
            
            {/* Action Bar Above Spreadsheet Grid */}
            <div className="h-12 px-4 border-b border-border/30 bg-muted/20 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleAddRow}
                  className="h-7 text-xs font-bold gap-1.5 bg-foreground text-background hover:bg-foreground/90 border-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </Button>

                <span className="text-xs text-muted-foreground font-mono ml-2">
                  {divisionOrders.length === 0 ? 'Empty (0 rows)' : `${divisionOrders.length} item row${divisionOrders.length === 1 ? '' : 's'}`}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-64 sm:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, customer, item, status..."
                    className="pl-8 text-xs h-7 bg-background border-border/40"
                  />
                </div>
              </div>
            </div>

            {/* The 28-Column Fullscreen Grid */}
            <div className="flex-1 w-full h-full overflow-auto bg-card/40">
              <table className="w-max min-w-full border-collapse text-xs select-text">
                
                {/* Fixed Monochrome Header Row */}
                <thead className="sticky top-0 z-20 bg-[#18181B] text-[#FFFFFF] text-[11px] font-mono tracking-tight shadow-xs select-none">
                  <tr>
                    {/* Row Index Column */}
                    <th className="py-2.5 px-3 border-r border-[#27272A] text-center w-12 bg-[#121214] font-bold text-neutral-400">
                      #
                    </th>
                    {/* Delete Action Column */}
                    <th className="py-2.5 px-2 border-r border-[#27272A] text-center w-10 bg-[#121214]">
                      Action
                    </th>
                    {/* 28 Exact Operational Columns */}
                    {SHEET_COLUMNS.map((col) => (
                      <th
                        key={col.key}
                        style={{ minWidth: col.width || '130px', width: col.width || '130px' }}
                        className="py-2.5 px-3 border-r border-[#27272A] text-left font-semibold truncate hover:bg-[#27272A] transition-colors"
                        title={`Col ${col.index}: ${col.name}\nType: ${col.type}\nRule: ${col.rule}\n${col.description}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">{col.name}</span>
                          <span className="text-[9px] text-neutral-400 font-normal opacity-70">
                            {col.index}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body with In-Cell Direct Editing */}
                <tbody className="divide-y divide-border/20 font-mono text-[11px]">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={SHEET_COLUMNS.length + 2}
                        className="py-24 text-center text-muted-foreground bg-background/50"
                      >
                        <div className="max-w-md mx-auto space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto border border-border/40 text-muted-foreground">
                            <TableIcon className="w-6 h-6 opacity-60" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-foreground">Spreadsheet is Clean & Empty</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              All 28 columns are ready. Real customer orders placed in {divisionName} will automatically expand item rows here in real-time.
                            </p>
                          </div>
                          <div className="pt-2 flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={handleAddRow}
                              className="text-xs font-semibold gap-1.5 bg-foreground text-background"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Row Manually</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleOpenGoogleSheet}
                              className="text-xs font-semibold gap-1.5 border-border/60"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Create Google Sheet</span>
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((row, rowIdx) => {
                      const isZebra = rowIdx % 2 === 1;
                      return (
                        <tr
                          key={row.row_id || `${row.order_id}_${rowIdx}`}
                          className={`transition-colors ${
                            isZebra ? 'bg-muted/15' : 'bg-background'
                          } hover:bg-muted/40`}
                        >
                          {/* Row Number */}
                          <td className="py-2 px-3 border-r border-border/30 text-center font-bold text-muted-foreground bg-muted/30 select-none">
                            {rowIdx + 1}
                          </td>

                          {/* Delete Button */}
                          <td className="py-1 px-1.5 border-r border-border/30 text-center">
                            <button
                              onClick={() => handleDeleteRow(row.row_id)}
                              className="p-1 text-muted-foreground hover:text-red-500 rounded hover:bg-red-500/10 transition-colors cursor-pointer border-none"
                              title="Delete this row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>

                          {/* 28 Editable Cells */}
                          {SHEET_COLUMNS.map((col) => {
                            const val = row[col.key as keyof SyncedSheetOrderRow];
                            const isEditing = editingCell?.rowId === row.row_id && editingCell?.field === col.key;
                            const displayVal = val !== undefined && val !== null ? String(val) : '';

                            // Highlight special status cell
                            const isStatusCol = col.key === 'status';

                            return (
                              <td
                                key={col.key}
                                onClick={() => handleStartEdit(row.row_id, col.key as keyof SyncedSheetOrderRow, val)}
                                className={`py-1.5 px-3 border-r border-border/30 truncate cursor-text transition-all ${
                                  isEditing
                                    ? 'p-0 bg-background ring-2 ring-orange-500 z-10'
                                    : 'hover:bg-muted/60'
                                }`}
                                style={{ minWidth: col.width || '130px', maxWidth: col.width || '130px' }}
                                title={`Click to edit ${col.name}: ${displayVal}`}
                              >
                                {isEditing ? (
                                  isStatusCol ? (
                                    <select
                                      value={cellDraftValue}
                                      onChange={(e) => {
                                        setCellDraftValue(e.target.value);
                                      }}
                                      onBlur={handleCommitEdit}
                                      autoFocus
                                      className="w-full h-8 px-2 text-xs bg-background text-foreground border-none outline-none font-mono"
                                    >
                                      <option value="pending">pending</option>
                                      <option value="cooking">cooking</option>
                                      <option value="ready">ready</option>
                                      <option value="in_transit">in_transit</option>
                                      <option value="completed">completed</option>
                                      <option value="cancelled">cancelled</option>
                                    </select>
                                  ) : col.key === 'destination' ? (
                                    <select
                                      value={cellDraftValue}
                                      onChange={(e) => setCellDraftValue(e.target.value)}
                                      onBlur={handleCommitEdit}
                                      autoFocus
                                      className="w-full h-8 px-2 text-xs bg-background text-foreground border-none outline-none font-mono"
                                    >
                                      <option value="dine-in">dine-in</option>
                                      <option value="takeaway">takeaway</option>
                                    </select>
                                  ) : col.key === 'delivery_method' ? (
                                    <select
                                      value={cellDraftValue}
                                      onChange={(e) => setCellDraftValue(e.target.value)}
                                      onBlur={handleCommitEdit}
                                      autoFocus
                                      className="w-full h-8 px-2 text-xs bg-background text-foreground border-none outline-none font-mono"
                                    >
                                      <option value="">(blank)</option>
                                      <option value="pickup">pickup</option>
                                      <option value="delivery">delivery</option>
                                    </select>
                                  ) : (
                                    <input
                                      ref={editInputRef}
                                      type="text"
                                      value={cellDraftValue}
                                      onChange={(e) => setCellDraftValue(e.target.value)}
                                      onBlur={handleCommitEdit}
                                      onKeyDown={handleKeyDown}
                                      className="w-full h-8 px-2 text-xs bg-background text-foreground border-none outline-none font-mono"
                                    />
                                  )
                                ) : isStatusCol ? (
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      displayVal === 'pending'
                                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                        : displayVal === 'cooking'
                                        ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
                                        : displayVal === 'ready'
                                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                        : displayVal === 'in_transit'
                                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                        : displayVal === 'completed'
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                        : 'text-muted-foreground'
                                    }`}
                                  >
                                    {displayVal || 'pending'}
                                  </span>
                                ) : (
                                  <span className={displayVal ? 'text-foreground' : 'text-muted-foreground/30 italic'}>
                                    {displayVal || '—'}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="h-8 px-4 border-t border-border/30 bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
              <div className="flex items-center gap-4">
                <span>
                  Tip: <strong className="text-foreground">Click any cell</strong> to edit directly in the spreadsheet.
                </span>
                <span>
                  Changes persist automatically.
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span>Columns: 28</span>
                <span>Active Division: {divisionName}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: LIVE GOOGLE SHEETS EMBED (/edit?rm=minimal Direct Editing)         */}
        {/* ========================================================================= */}
        {activeTab === 'embed' && (
          <div className="flex-1 w-full h-full p-3 sm:p-4 flex flex-col min-h-0 bg-background">
            {embedUrl ? (
              <div className="flex-1 w-full h-full rounded-2xl overflow-hidden border border-border/40 bg-card shadow-sm relative flex flex-col">
                <div className="h-10 px-4 bg-muted/40 border-b border-border/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground truncate">
                    Embedded Google Sheet: <span className="font-mono text-muted-foreground">{sheetUrl}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIframeKey(k => k + 1)}
                      className="h-7 text-xs font-semibold gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reload</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleOpenGoogleSheet}
                      className="h-7 text-xs font-semibold gap-1 bg-orange-500 text-white hover:bg-orange-600 border-none"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open Externally</span>
                    </Button>
                  </div>
                </div>
                <iframe
                  key={iframeKey}
                  src={embedUrl}
                  title={sheetTitle}
                  className="w-full flex-1 border-none bg-white"
                  allow="autoplay; clipboard-write; encrypted-media"
                />
              </div>
            ) : (
              <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center mb-4">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <h2 className="text-base font-bold text-foreground">
                  Connect Your Google Sheet
                </h2>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  To view and edit your live Google Sheet directly inside this tab, create a new spreadsheet with the appropriate title and paste its URL below.
                </p>

                <div className="mt-6 w-full space-y-3 text-left">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Document Title</label>
                    <Input
                      value={sheetTitle}
                      readOnly
                      className="text-xs h-9 font-mono bg-muted/40 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Google Sheet Share URL</label>
                    <Input
                      value={sheetUrl}
                      onChange={(e) => setSheetUrl(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                      className="text-xs h-9 font-mono bg-card"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                    <Button
                      onClick={handleOpenGoogleSheet}
                      className="w-full sm:flex-1 h-9 text-xs font-bold gap-1.5 bg-orange-500 hover:bg-orange-600 text-white border-none cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Create New Google Sheet</span>
                    </Button>

                    <Button
                      onClick={handleSaveConfig}
                      variant="outline"
                      className="w-full sm:w-auto h-9 text-xs font-bold border-border/60 hover:bg-muted cursor-pointer"
                    >
                      <span>Connect URL</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SETTINGS & APPS SCRIPT CONFIGURATION                                */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="flex-1 w-full h-full p-4 sm:p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Google Sheet Synchronization Settings
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure direct spreadsheet integration for {divisionName}.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Spreadsheet Document Title</label>
                  <Input
                    value={sheetTitle}
                    readOnly
                    className="text-xs h-9 font-mono bg-muted/40"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Standardized naming: Orient Global — [Division] Orders Sheet.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Google Sheet Share URL</label>
                  <Input
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                    className="text-xs h-9 font-mono"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Must be set to "Anyone with the link can edit" in Google Drive share settings for in-frame editing.
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
                    Automates hands-free POST updates into your live Google Sheet when chef status changes.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-border/30">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      sheetsSync.clearSyncedOrders();
                      setSyncedOrders([]);
                      toast({ title: "Sheet Reset", description: "Cleared all rows. All fields are now completely empty." });
                    }}
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                  >
                    Clear All Orders (Clean Slate)
                  </Button>

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

            {/* 28 Columns Reference Guide */}
            <div className="p-6 rounded-2xl bg-card border border-border/40 shadow-xs space-y-4">
              <div>
                <h4 className="text-sm font-bold text-foreground">
                  28 Operational Columns Architecture (Option 1 Data Model)
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Every order item generates its own row sharing the parent order_id with automatic timestamp tracking.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {SHEET_COLUMNS.map((col) => (
                  <div key={col.key} className="p-2.5 rounded-xl bg-muted/30 border border-border/20 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-foreground">{col.index}. {col.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{col.type}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{col.description}</p>
                    <span className="text-[10px] text-orange-500 font-medium mt-0.5">{col.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );

  return createPortal(modalContent, document.body);
}
