import { CustomerOrder } from './orderService';

/**
 * Excel & Google Sheets Operations Sync Service
 * 
 * Supports:
 * - 28 Exact Operational Columns with strict conditional rules
 * - Option 1 Data Model: Each item in an order is expanded into its own row sharing the parent order_id
 * - Hands-free automatic status tracking & 7 timestamp audit points
 * - Direct in-cell spreadsheet editing within the Orient dashboard
 * - Executive Monochromatic Design System
 * - Zero hardcoded or third-party example sheet data: all fields start completely empty
 */

export const DEFAULT_SHEET_URL = '';

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return localStorage.getItem(key);
      }
    } catch (e) {}
    return null;
  },
  setItem: (key: string, val: string): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(key, val);
      }
    } catch (e) {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

export interface DivisionSheetConfig {
  id: string;
  name: string;
  tabName: string;
  tagline: string;
}

export const ORIENT_DIVISIONS: DivisionSheetConfig[] = [
  { id: 'dining', name: "Ozzie's Restaurant", tabName: "Ozzie's Restaurant", tagline: "Restaurant, Soups, Swallows & Cellar" },
  { id: 'bakery', name: "Ozzie's Bakery", tabName: "Ozzie's Bakery", tagline: "Fresh Breads, Croissants & Pastries" },
  { id: 'water', name: "Orville Water", tabName: "Orville Water", tagline: "Natural Spring Water & Bottling" },
  { id: 'games', name: "Orient Games", tabName: "Orient Games", tagline: "Arcade, VR, Boardgames & Tournaments" },
  { id: 'market', name: "Orient Supermarket", tabName: "Orient Supermarket", tagline: "Groceries, Provisions & Fresh Produce" },
  { id: 'lounge', name: "Orient Lounge", tabName: "Orient Lounge", tagline: "VIP Lounge, Cocktails & Private Dining" }
];

export function getDivisionDisplayName(divId?: string): string {
  const norm = (divId || '').toLowerCase().trim();
  if (norm.includes('rest') || norm === 'dining') return "Ozzie's Restaurant";
  if (norm.includes('bake')) return "Ozzie's Bakery";
  if (norm.includes('water') || norm.includes('orville')) return "Orville Water";
  if (norm.includes('game')) return "Orient Games";
  if (norm.includes('market') || norm.includes('super')) return "Orient Supermarket";
  if (norm.includes('lounge')) return "Orient Lounge";
  return "Ozzie's Restaurant";
}

export function getDivisionSheetTitle(divisionName?: string): string {
  const name = divisionName || "Ozzie's Restaurant";
  return `Orient Global — ${name} Orders Sheet`;
}

export function getCreateGoogleSheetUrl(divisionName?: string): string {
  const title = getDivisionSheetTitle(divisionName);
  return `https://docs.google.com/spreadsheets/create?title=${encodeURIComponent(title)}`;
}

export type MonochromaticOrderStatus = 'pending' | 'cooking' | 'ready' | 'in_transit' | 'completed' | 'cancelled';

export function normalizeSheetStatus(rawStatus?: string, isDelivery = false): MonochromaticOrderStatus {
  const s = (rawStatus || '').toLowerCase().trim().replace(/-/g, '_').replace(/ /g, '_');
  if (s === 'cooking' || s === 'preparing' || s === 'in_preparation' || s === 'confirmed' || s === 'ten_min_warning' || s === 'five_min_warning') {
    return 'cooking';
  }
  if (s === 'ready' || s === 'ready_for_pickup') return 'ready';
  if (s === 'in_transit' || s === 'transit' || s === 'dispatched' || s === 'on_the_way') {
    return isDelivery ? 'in_transit' : 'ready';
  }
  if (s === 'completed' || s === 'finished' || s === 'delivered' || s === 'paid') return 'completed';
  if (s === 'cancelled' || s === 'rejected') return 'cancelled';
  return 'pending';
}

/**
 * Exact 28 Columns Definition with types, conditional rules, and descriptions
 */
export interface SheetColumnDef {
  index: number;
  key: keyof SyncedSheetOrderRow;
  name: string;
  type: string;
  rule: string;
  description: string;
  width?: string;
}

export const SHEET_COLUMNS: SheetColumnDef[] = [
  { index: 1, key: 'order_id', name: 'order_id', type: 'String', rule: 'Always Active', description: 'Unique parent order tracking ID (e.g., ORD-2026-0041)', width: '140px' },
  { index: 2, key: 'customer_id', name: 'customer_id', type: 'String', rule: 'Always Active', description: 'Unique registered or guest customer identifier', width: '130px' },
  { index: 3, key: 'item_id', name: 'item_id', type: 'String', rule: 'Always Active', description: 'Distinct product SKU code (e.g., PRD-D-001)', width: '120px' },
  { index: 4, key: 'name_of_item', name: 'name_of_item', type: 'String', rule: 'Always Active', description: 'Clean title of the dish or beverage', width: '180px' },
  { index: 5, key: 'item_unit_price', name: 'item_unit_price', type: 'Number / ₦', rule: 'Always Active', description: 'Price for one unit of this item (e.g., ₦10)', width: '120px' },
  { index: 6, key: 'item_quantity', name: 'item_quantity', type: 'Number', rule: 'Always Active', description: 'Portions of this specific item ordered (e.g., 2)', width: '100px' },
  { index: 7, key: 'item_total_price', name: 'item_total_price', type: 'Number / ₦', rule: 'Always Active', description: '(Calculated: item_unit_price * item_quantity)', width: '130px' },
  { index: 8, key: 'total_item_quantity', name: 'total_item_quantity', type: 'Number', rule: 'Always Active', description: 'Cumulative sum of all items in this parent order', width: '140px' },
  { index: 9, key: 'unique_item_quantity', name: 'unique_item_quantity', type: 'Number', rule: 'Always Active', description: 'Count of distinct SKUs in this parent order', width: '140px' },
  { index: 10, key: 'destination', name: 'destination', type: 'String', rule: 'Always Active', description: 'Where the order goes (e.g., Dining Room, Takeaway)', width: '120px' },
  { index: 11, key: 'reserved_date', name: 'reserved_date', type: 'String', rule: 'Active only if dine-in, blank if takeaway', description: 'Reservation date (e.g., 2026-09-30)', width: '130px' },
  { index: 12, key: 'reserved_time', name: 'reserved_time', type: 'String', rule: 'Active only if dine-in, blank if takeaway', description: 'Reservation time (e.g., 19:30)', width: '120px' },
  { index: 13, key: 'table_number', name: 'table_number', type: 'String', rule: 'Active only if dine-in, blank if takeaway', description: 'Assigned table/seat number', width: '120px' },
  { index: 14, key: 'delivery_method', name: 'delivery_method', type: 'String', rule: 'Active only if takeaway: pickup/delivery, blank if dine-in', description: 'Takeaway method: pickup or delivery', width: '130px' },
  { index: 15, key: 'delivery_address', name: 'delivery_address', type: 'String', rule: 'Active only if delivery, blank if pickup/dine-in', description: 'Destination street address', width: '180px' },
  { index: 16, key: 'customer_name', name: 'customer_name', type: 'String', rule: 'Always Active', description: 'Customer full name', width: '150px' },
  { index: 17, key: 'customer_phone', name: 'customer_phone', type: 'String', rule: 'Always Active', description: 'Customer contact phone number', width: '140px' },
  { index: 18, key: 'customer_email', name: 'customer_email', type: 'String', rule: 'Always Active', description: 'Customer email address', width: '170px' },
  { index: 19, key: 'status', name: 'status', type: 'String', rule: 'Always Active', description: 'pending -> cooking -> ready -> in_transit -> completed', width: '120px' },
  { index: 20, key: 'notes', name: 'notes', type: 'String', rule: 'Always Active', description: 'Customer or kitchen instructions', width: '160px' },
  { index: 21, key: 'total_amount', name: 'total_amount', type: 'Number / ₦', rule: 'Always Active', description: 'Grand total of the parent order', width: '120px' },
  { index: 22, key: 'created_at', name: 'created_at', type: 'String', rule: 'Always Active', description: 'ISO timestamp when order was placed', width: '170px' },
  { index: 23, key: 'updated_at', name: 'updated_at', type: 'String', rule: 'Always Active', description: 'ISO timestamp when order was last updated', width: '170px' },
  { index: 24, key: 'timer_started_at', name: 'timer_started_at', type: 'String', rule: 'Always Active', description: 'ISO timestamp when kitchen timer started', width: '170px' },
  { index: 25, key: 'timer_ended_at', name: 'timer_ended_at', type: 'String', rule: 'Always Active', description: 'ISO timestamp when kitchen timer ended', width: '170px' },
  { index: 26, key: 'chef_confirmed_at', name: 'chef_confirmed_at', type: 'String', rule: 'Always Active', description: 'ISO timestamp when chef confirmed preparation', width: '170px' },
  { index: 27, key: 'customer_received_at', name: 'customer_received_at', type: 'String', rule: 'Active for delivery/dine-in', description: 'ISO timestamp when handed over', width: '170px' },
  { index: 28, key: 'completed_at', name: 'completed_at', type: 'String', rule: 'Always Active', description: 'ISO timestamp when order marked completed', width: '170px' },
];

/**
 * Option 1 Row Data Structure (Every item is its own row sharing parent order_id)
 */
export interface SyncedSheetOrderRow {
  row_id: string;
  order_id: string;
  customer_id: string;
  item_id: string;
  name_of_item: string;
  item_unit_price: number | string;
  item_quantity: number | string;
  item_total_price: number | string;
  total_item_quantity: number | string;
  unique_item_quantity: number | string;
  destination: string;
  reserved_date: string;
  reserved_time: string;
  table_number: string;
  delivery_method: string;
  delivery_address: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  status: string;
  notes: string;
  total_amount: number | string;
  created_at: string;
  updated_at: string;
  timer_started_at: string;
  timer_ended_at: string;
  chef_confirmed_at: string;
  customer_received_at: string;
  completed_at: string;
  // Division grouping
  division?: string;
  divisionId?: string;
  // Compatibility properties
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  itemName?: string;
  unitPrice?: string;
  quantity?: number | string;
  totalAmount?: string;
  seatNumber?: string;
  deliveryMethod?: string;
  deliveryAddress?: string;
  reservedDateTime?: string;
  confirmedTime?: string;
  readyTime?: string;
  completedTime?: string;
  placedDate?: string;
  placedTime?: string;
  syncedAt?: string;
}

export const sheetsSync = {
  /**
   * Export catalog items to CSV
   */
  exportToCSV: (products: any[], filename = 'orient_catalog.csv'): void => {
    if (typeof window === 'undefined') return;
    const headers = ['id', 'name', 'category', 'price', 'unit', 'stock', 'description', 'status'];
    const rows = (products || []).map(p => [
      escapeCSV(p.id),
      escapeCSV(p.name),
      escapeCSV(p.category),
      p.price ?? 10,
      escapeCSV(p.unit || 'unit'),
      p.stock ?? 5,
      escapeCSV(p.description || ''),
      escapeCSV(p.status || 'active')
    ].join(','));
    const content = [headers.join(','), ...rows].join('\r\n');
    downloadBlob(content, filename, 'text/csv;charset=utf-8;');
  },

  /**
   * Parse uploaded catalog CSV
   */
  parseCSV: (csv: string): any[] => {
    if (!csv) return [];
    const lines = csv.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const items: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length === 0 || !cols[0]) continue;
      const obj: any = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] || '';
      });
      items.push({
        id: obj.id || `PRD-IMP-${i}`,
        name: obj.name || 'Imported Item',
        category: obj.category || 'General',
        price: Number(obj.price) || 10,
        unit: obj.unit || 'unit',
        stock: Number(obj.stock) || 5,
        description: obj.description || '',
        status: obj.status === 'draft' ? 'draft' : 'active'
      });
    }
    return items;
  },

  /**
   * Get connected Google Sheet URL (Empty by default)
   */
  getGoogleSheetUrl: (): string => {
    return safeStorage.getItem('orient_google_sheet_url') || DEFAULT_SHEET_URL;
  },

  /**
   * Set and persist Google Sheet URL
   */
  setGoogleSheetUrl: (url: string): void => {
    safeStorage.setItem('orient_google_sheet_url', url.trim());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_sheets_config_changed'));
    }
  },

  /**
   * Get Google Apps Script Webhook URL
   */
  getGoogleSheetWebhookUrl: (): string => {
    return safeStorage.getItem('orient_google_sheet_webhook_url') || '';
  },

  /**
   * Set Google Apps Script Webhook URL
   */
  setGoogleSheetWebhookUrl: (url: string): void => {
    safeStorage.setItem('orient_google_sheet_webhook_url', url.trim());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_sheets_config_changed'));
    }
  },

  /**
   * Get active division sheets
   */
  getActiveDivisionSheets: (): string[] => {
    try {
      const raw = safeStorage.getItem('orient_active_division_sheets');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return ["Ozzie's Restaurant"];
  },

  /**
   * Open the connected Google Sheet or create a new one
   */
  openGoogleSheet: (divisionName?: string): void => {
    if (typeof window !== 'undefined') {
      const url = sheetsSync.getGoogleSheetUrl();
      if (url && url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.open(getCreateGoogleSheetUrl(divisionName), '_blank', 'noopener,noreferrer');
      }
    }
  },

  /**
   * Retrieve all synced orders from persistent log.
   * All fields start completely empty until real orders arrive.
   */
  getSyncedOrders: (): SyncedSheetOrderRow[] => {
    try {
      const raw = safeStorage.getItem('orient_google_sheet_orders');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Filter out any legacy third-party example data if present
          return parsed.filter(o => !String(o.order_id || o.orderId || '').includes('EXAMPLE-SHEET-TEST'));
        }
      }
    } catch (e) {}
    return [];
  },

  /**
   * Save and persist modified order rows (Used by in-app direct spreadsheet editor)
   */
  saveSyncedOrders: (rows: SyncedSheetOrderRow[]): void => {
    safeStorage.setItem('orient_google_sheet_orders', JSON.stringify(rows));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_sheets_synced', { detail: rows }));
    }
  },

  /**
   * Clear the local synced orders log
   */
  clearSyncedOrders: (): void => {
    safeStorage.setItem('orient_google_sheet_orders', JSON.stringify([]));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient_sheets_synced', { detail: [] }));
    }
  },

  /**
   * Add a brand new empty row directly in the spreadsheet
   */
  addEmptyRow: (divisionName?: string, divisionId?: string): SyncedSheetOrderRow => {
    const timestamp = new Date().toISOString();
    const shortId = Date.now().toString().slice(-4);
    const orderId = `ORD-2026-${shortId}`;
    const divName = divisionName || "Ozzie's Restaurant";
    const divId = divisionId || 'dining';
    const rowId = `${orderId}_custom_${Date.now()}`;

    const newRow: SyncedSheetOrderRow = {
      row_id: rowId,
      order_id: orderId,
      customer_id: `usr_${shortId}`,
      item_id: `PRD-${shortId}`,
      name_of_item: '',
      item_unit_price: 10,
      item_quantity: 1,
      item_total_price: 10,
      total_item_quantity: 1,
      unique_item_quantity: 1,
      destination: divId === 'dining' ? 'dine-in' : 'takeaway',
      reserved_date: divId === 'dining' ? new Date().toLocaleDateString('en-CA') : '',
      reserved_time: divId === 'dining' ? '12:00' : '',
      table_number: divId === 'dining' ? 'Table 1' : '',
      delivery_method: divId === 'dining' ? '' : 'pickup',
      delivery_address: '',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      status: 'pending',
      notes: '',
      total_amount: 10,
      created_at: timestamp,
      updated_at: timestamp,
      timer_started_at: '',
      timer_ended_at: '',
      chef_confirmed_at: '',
      customer_received_at: '',
      completed_at: '',
      division: divName,
      divisionId: divId,
      // Compatibility
      orderId,
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      itemName: '',
      unitPrice: '₦10',
      quantity: 1,
      totalAmount: '₦10',
      seatNumber: divId === 'dining' ? 'Table 1' : '',
      deliveryMethod: divId === 'dining' ? '' : 'pickup',
      deliveryAddress: '',
      reservedDateTime: '',
      confirmedTime: '',
      readyTime: '',
      completedTime: '',
      placedDate: timestamp.split('T')[0],
      placedTime: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      syncedAt: timestamp
    };

    const existing = sheetsSync.getSyncedOrders();
    const updated = [newRow, ...existing];
    sheetsSync.saveSyncedOrders(updated);
    return newRow;
  },

  /**
   * Delete a specific row by row_id or order_id
   */
  deleteRow: (rowId: string): void => {
    const existing = sheetsSync.getSyncedOrders();
    const updated = existing.filter(r => r.row_id !== rowId && r.order_id !== rowId && r.orderId !== rowId);
    sheetsSync.saveSyncedOrders(updated);
  },

  /**
   * Automatically append an order entry into the Sheet using Option 1 Data Model:
   * Each individual item in the order becomes its own distinct row sharing the parent order_id.
   */
  appendOrderToSheet: async (order: CustomerOrder): Promise<void> => {
    const parentOrderId = order.orderId || order.id || `ORD-2026-${Date.now().toString().slice(-4)}`;
    const customerId = order.customerId || order.userId || 'usr_guest';
    const destination = (order.destination === 'dine-in' || order.orderType === 'dine-in') ? 'dine-in' : 'takeaway';
    const isDineIn = destination === 'dine-in';
    const isTakeaway = destination === 'takeaway';
    
    // Strict conditional rules
    const deliveryMethod = isTakeaway ? (order.deliveryMethod || 'pickup') : '';
    const isDelivery = isTakeaway && deliveryMethod === 'delivery';
    const deliveryAddress = isDelivery ? (order.deliveryAddress || order.shippingAddress || '') : '';
    const reservedDate = isDineIn ? (order.reservedDate || '') : '';
    const reservedTime = isDineIn ? (order.reservedTime || '') : '';
    const tableNumber = isDineIn ? (order.tableNumber || order.seatNumber || 'Table 1') : '';

    const items = order.items && order.items.length > 0 ? order.items : [
      { id: 'PRD-001', name: 'General Order', price: order.totalAmount || 10, quantity: 1 }
    ];

    const totalItemQty = items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0);
    const uniqueItemQty = items.length;
    const grandTotal = order.totalAmount ?? items.reduce((sum, it) => sum + ((Number(it.price) || 10) * (Number(it.quantity) || 1)), 0);

    const nowIso = new Date().toISOString();
    const createdAt = order.createdAt ? (typeof order.createdAt === 'string' ? order.createdAt : new Date(order.createdAt).toISOString()) : nowIso;
    const updatedAt = order.updatedAt ? (typeof order.updatedAt === 'string' ? order.updatedAt : new Date(order.updatedAt).toISOString()) : createdAt;

    const anyOrder = order as any;
    const chefConfirmedAt = order.chefConfirmedAt || anyOrder.chefConfirmedAt || '';
    const timerStartedAt = order.timerStartedAt || anyOrder.timerStartedAt || '';
    const timerEndedAt = order.timerEndedAt || (order.timerEndsAt ? new Date(order.timerEndsAt).toISOString() : '') || '';
    const customerReceivedAt = (isDineIn || isDelivery) ? (order.customerReceivedAt || anyOrder.customerReceivedAt || '') : '';
    const completedAt = order.completedAt || anyOrder.completedAt || '';

    const divisionName = getDivisionDisplayName(order.division);
    const divisionId = order.division || 'dining';
    const rawStatus = (order.status || 'pending').toLowerCase();

    // Option 1: Expand each item into its own row
    const newRows: SyncedSheetOrderRow[] = items.map((item, idx) => {
      const unitPrice = Number(item.price) || 10;
      const quantity = Number(item.quantity) || 1;
      const itemTotalPrice = unitPrice * quantity;
      const rowId = `${parentOrderId}_${item.id || idx}_${idx}`;

      return {
        row_id: rowId,
        order_id: parentOrderId,
        customer_id: customerId,
        item_id: item.id || `PRD-${idx + 1}`,
        name_of_item: item.name || 'Menu Item',
        item_unit_price: unitPrice,
        item_quantity: quantity,
        item_total_price: itemTotalPrice,
        total_item_quantity: totalItemQty,
        unique_item_quantity: uniqueItemQty,
        destination,
        reserved_date: reservedDate,
        reserved_time: reservedTime,
        table_number: tableNumber,
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress,
        customer_name: order.customerName || 'Guest Customer',
        customer_phone: order.customerPhone || '',
        customer_email: order.customerEmail || '',
        status: rawStatus,
        notes: order.notes || '',
        total_amount: grandTotal,
        created_at: createdAt,
        updated_at: updatedAt,
        timer_started_at: timerStartedAt,
        timer_ended_at: timerEndedAt,
        chef_confirmed_at: chefConfirmedAt,
        customer_received_at: customerReceivedAt,
        completed_at: completedAt,
        division: divisionName,
        divisionId,
        // Compatibility
        orderId: parentOrderId,
        customerName: order.customerName || 'Guest Customer',
        customerPhone: order.customerPhone || '',
        customerEmail: order.customerEmail || '',
        itemName: item.name || 'Menu Item',
        unitPrice: `₦${unitPrice}`,
        quantity,
        totalAmount: `₦${grandTotal}`,
        seatNumber: tableNumber,
        deliveryMethod,
        deliveryAddress,
        reservedDateTime: reservedDate && reservedTime ? `${reservedDate} @ ${reservedTime}` : (reservedDate || reservedTime || ''),
        confirmedTime: chefConfirmedAt ? new Date(chefConfirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        readyTime: timerEndedAt ? new Date(timerEndedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        completedTime: completedAt ? new Date(completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        placedDate: createdAt.split('T')[0],
        placedTime: new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        syncedAt: nowIso
      };
    });

    try {
      const existing = sheetsSync.getSyncedOrders();
      const filtered = existing.filter(r => r.order_id !== parentOrderId && r.orderId !== parentOrderId);
      const updated = [...newRows, ...filtered];
      safeStorage.setItem('orient_google_sheet_orders', JSON.stringify(updated));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('orient_sheets_synced', { detail: updated }));
      }
    } catch (e) {
      console.warn("Could not save to local sheet sync log:", e);
    }

    // Push to Google Sheet Webhook if configured
    const webhookUrl = sheetsSync.getGoogleSheetWebhookUrl();
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        for (const row of newRows) {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'append_row',
              ...row
            })
          });
        }
      } catch (err) {
        console.warn("[Google Sheets Webhook] Append error:", err);
      }
    }
  },

  /**
   * Update Order Status and Audit Timestamps across all item rows for this order_id
   */
  updateOrderStatusInSheet: async (
    orderId: string,
    rawStatus: string,
    timestampInfo?: { confirmedTime?: string; readyTime?: string; completedTime?: string }
  ): Promise<void> => {
    try {
      const existing = sheetsSync.getSyncedOrders();
      const normStatus = (rawStatus || 'pending').toLowerCase();
      const nowIso = new Date().toISOString();
      let hasChanges = false;

      const updated = existing.map(row => {
        if (row.order_id === orderId || row.orderId === orderId) {
          hasChanges = true;
          const isDineIn = row.destination === 'dine-in';
          const isDelivery = row.delivery_method === 'delivery';

          let chefConfirmed = row.chef_confirmed_at;
          if (timestampInfo?.confirmedTime) {
            chefConfirmed = timestampInfo.confirmedTime;
          } else if ((normStatus === 'cooking' || normStatus === 'preparing' || normStatus === 'confirmed') && !chefConfirmed) {
            chefConfirmed = nowIso;
          }

          let timerStarted = row.timer_started_at;
          if ((normStatus === 'cooking' || normStatus === 'preparing') && !timerStarted) {
            timerStarted = nowIso;
          }

          let timerEnded = row.timer_ended_at;
          if (normStatus === 'ready' && !timerEnded) {
            timerEnded = nowIso;
          }

          let completedAt = row.completed_at;
          if (normStatus === 'completed' && !completedAt) {
            completedAt = nowIso;
          }

          let customerReceived = row.customer_received_at;
          if ((normStatus === 'completed' || normStatus === 'in_transit') && !customerReceived && (isDineIn || isDelivery)) {
            customerReceived = nowIso;
          }

          return {
            ...row,
            status: normStatus,
            updated_at: nowIso,
            chef_confirmed_at: chefConfirmed,
            timer_started_at: timerStarted,
            timer_ended_at: timerEnded,
            customer_received_at: customerReceived,
            completed_at: completedAt,
            confirmedTime: chefConfirmed ? new Date(chefConfirmed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : row.confirmedTime,
            readyTime: timerEnded ? new Date(timerEnded).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : row.readyTime,
            completedTime: completedAt ? new Date(completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : row.completedTime,
          };
        }
        return row;
      });

      if (hasChanges) {
        sheetsSync.saveSyncedOrders(updated);
      }

      // Webhook update
      const webhookUrl = sheetsSync.getGoogleSheetWebhookUrl();
      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_status',
              order_id: orderId,
              status: normStatus,
              timestampInfo,
              updated_at: nowIso
            })
          });
        } catch (err) {
          console.warn("[Google Sheets Webhook] Update error:", err);
        }
      }
    } catch (e) {
      console.warn("Error updating order status in sheets sync:", e);
    }
  },

  /**
   * Export orders to CSV with the exact 28 columns.
   * If orders is empty, it exports a clean template with the 28 headers.
   */
  exportOrdersToCSV: (filename?: string, divisionOrders?: SyncedSheetOrderRow[]): void => {
    if (typeof window === 'undefined') return;

    const orders = divisionOrders || sheetsSync.getSyncedOrders();
    const headers = SHEET_COLUMNS.map(c => c.name);
    const rows = orders.map(o => 
      SHEET_COLUMNS.map(c => escapeCSV(o[c.key as keyof SyncedSheetOrderRow] ?? '')).join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    downloadBlob(csvContent, filename || 'orient_orders_sheet.csv', 'text/csv;charset=utf-8;');
  },

  /**
   * Copy the 28 column headers to clipboard for 1-click paste into Google Sheets
   */
  copyHeadersToClipboard: async (): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const tsv = SHEET_COLUMNS.map(c => c.name).join('\t');
        await navigator.clipboard.writeText(tsv);
        return true;
      }
    } catch (e) {
      console.warn("Could not copy headers to clipboard:", e);
    }
    return false;
  },

  /**
   * Master Google Apps Script Template with the 28 Exact Columns
   */
  getAppsScriptTemplate: (): string => {
    return `/**
 * ORIENT GLOBAL FLAGSHIP — MASTER OPERATIONS GOOGLE APPS SCRIPT
 * 
 * Configures the exact 28 columns with executive monochromatic styling:
 * #18181B Header, Pure White text, Zebra banding, and real-time status updates.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action || 'append_row';
    var divisionName = payload.division || "Ozzie's Restaurant";

    if (action === 'create_sheet') {
      var targetSheet = ss.getSheetByName(payload.sheetName);
      if (!targetSheet) targetSheet = ss.insertSheet(payload.sheetName);
      setupMonochromeHeaders(targetSheet);
      return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'update_status') {
      var orderId = payload.order_id || payload.orderId;
      var newStatus = payload.status;
      var sheets = ss.getSheets();
      for (var s = 0; s < sheets.length; s++) {
        var sh = sheets[s];
        var data = sh.getDataRange().getValues();
        for (var r = 1; r < data.length; r++) {
          if (String(data[r][0]).trim() === String(orderId).trim()) {
            sh.getRange(r + 1, 19).setValue(newStatus); // Column 19 is status
            sh.getRange(r + 1, 23).setValue(payload.updated_at || new Date().toISOString()); // Column 23 is updated_at
            applyMonochromeStatusStyle(sh.getRange(r + 1, 19), newStatus);
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({ result: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // ACTION: APPEND ROW (28 Columns)
    var sheet = ss.getSheetByName(divisionName);
    if (!sheet) sheet = ss.insertSheet(divisionName);
    if (sheet.getLastRow() === 0) setupMonochromeHeaders(sheet);

    sheet.appendRow([
      payload.order_id || "",
      payload.customer_id || "",
      payload.item_id || "",
      payload.name_of_item || "",
      payload.item_unit_price || 10,
      payload.item_quantity || 1,
      payload.item_total_price || 10,
      payload.total_item_quantity || 1,
      payload.unique_item_quantity || 1,
      payload.destination || "",
      payload.reserved_date || "",
      payload.reserved_time || "",
      payload.table_number || "",
      payload.delivery_method || "",
      payload.delivery_address || "",
      payload.customer_name || "",
      payload.customer_phone || "",
      payload.customer_email || "",
      payload.status || "pending",
      payload.notes || "",
      payload.total_amount || 10,
      payload.created_at || new Date().toISOString(),
      payload.updated_at || new Date().toISOString(),
      payload.timer_started_at || "",
      payload.timer_ended_at || "",
      payload.chef_confirmed_at || "",
      payload.customer_received_at || "",
      payload.completed_at || ""
    ]);

    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 28);
    rowRange.setBackground(lastRow % 2 === 0 ? "#FFFFFF" : "#F9FAFB");
    rowRange.setFontFamily("Segoe UI").setFontSize(10);
    applyMonochromeStatusStyle(sheet.getRange(lastRow, 19), payload.status || "pending");

    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: lastRow })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function setupMonochromeHeaders(sheet) {
  var headers = [
    "order_id", "customer_id", "item_id", "name_of_item", "item_unit_price",
    "item_quantity", "item_total_price", "total_item_quantity", "unique_item_quantity",
    "destination", "reserved_date", "reserved_time", "table_number", "delivery_method",
    "delivery_address", "customer_name", "customer_phone", "customer_email", "status",
    "notes", "total_amount", "created_at", "updated_at", "timer_started_at",
    "timer_ended_at", "chef_confirmed_at", "customer_received_at", "completed_at"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#18181B").setFontColor("#FFFFFF").setFontWeight("bold").setFontFamily("Segoe UI").setFontSize(10).setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 38);
}

function applyMonochromeStatusStyle(cell, status) {
  var s = String(status || '').toLowerCase();
  cell.setHorizontalAlignment("center").setFontFamily("Segoe UI").setFontWeight("bold");
  if (s === 'pending') {
    cell.setBackground("#F4F4F5").setFontColor("#3F3F46");
  } else if (s === 'cooking') {
    cell.setBackground("#71717A").setFontColor("#FFFFFF");
  } else if (s === 'ready') {
    cell.setBackground("#27272A").setFontColor("#FFFFFF");
  } else if (s === 'in_transit') {
    cell.setBackground("#18181B").setFontColor("#FFFFFF");
  } else if (s === 'completed') {
    cell.setBackground("#000000").setFontColor("#FFFFFF");
  } else if (s === 'cancelled') {
    cell.setBackground("#E4E4E7").setFontColor("#A1A1AA");
  }
}
`;
  }
};

function escapeCSV(val: any): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
