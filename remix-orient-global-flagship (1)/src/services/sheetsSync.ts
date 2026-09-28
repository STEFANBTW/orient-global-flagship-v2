import { ProductItem } from '@/data/productsCatalog';
import { CustomerOrder } from './orderService';

/**
 * Excel & Google Sheets Sync Service
 * 
 * Supports:
 * - One Master Google Sheet Workbook containing 6 Division tabs:
 *   1. Ozzie's Restaurant
 *   2. Ozzie's Bakery
 *   3. Orville Water
 *   4. Orient Games
 *   5. Orient Supermarket
 *   6. Orient Lounge
 * - Automated status tracking (Pending -> Cooking -> Ready -> In Transit -> Completed)
 * - Automatic background syncing when chef clicks kitchen buttons (zero typing required)
 * - Dedicated columns: Unit Price, Quantity, Total Amount, Timestamps, Destination, etc.
 * - Monochromatic design system (Charcoal/Black headers, Crisp White text, Zebra rows, Monochromatic status pills)
 * - Live in-dashboard embedded sheet view so users never leave the Orient site
 */

const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0';

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
    return;
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

export type MonochromaticOrderStatus = 'Pending' | 'Cooking' | 'Ready' | 'In Transit' | 'Completed' | 'Cancelled';

export function normalizeSheetStatus(rawStatus?: string, isDelivery = false): MonochromaticOrderStatus {
  const s = (rawStatus || '').toLowerCase().trim();
  if (s === 'cooking' || s === 'preparing' || s === 'in_preparation') return 'Cooking';
  if (s === 'ready' || s === 'ready_for_pickup') return 'Ready';
  if (s === 'in_transit' || s === 'transit' || s === 'dispatched' || s === 'on_the_way') {
    return isDelivery ? 'In Transit' : 'Ready';
  }
  if (s === 'completed' || s === 'finished' || s === 'delivered' || s === 'paid') return 'Completed';
  if (s === 'cancelled' || s === 'rejected') return 'Cancelled';
  return 'Pending';
}

export interface SyncedSheetOrderRow {
  orderId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  placedDate: string;
  placedTime: string;
  reservedDate: string;
  reservedTime: string;
  reservedDateTime: string;
  destination: string;
  deliveryMethod: string;
  deliveryAddress: string;
  seatNumber: string;
  itemName: string;
  unitPrice: string;
  quantity: number | string;
  totalAmount: string;
  status: MonochromaticOrderStatus;
  confirmedTime: string;
  readyTime: string;
  completedTime: string;
  notes: string;
  division: string;
  divisionId: string;
  createdAt: string;
  syncedAt: string;
}

export const sheetsSync = {
  /**
   * Get connected Google Sheet URL
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
   * Get Google Apps Script Webhook URL (for direct HTTP POST row injection & status updates)
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
   * Get configured division sheet tabs within the master document
   */
  getActiveDivisionSheets: (): string[] => {
    try {
      const raw = safeStorage.getItem('orient_active_division_sheets');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    // Default: initialize with Ozzie's Restaurant
    return ["Ozzie's Restaurant"];
  },

  /**
   * Add a division sheet tab to the Master document
   */
  addDivisionSheet: async (divisionName: string): Promise<boolean> => {
    try {
      const current = sheetsSync.getActiveDivisionSheets();
      if (!current.includes(divisionName)) {
        const updated = [...current, divisionName];
        safeStorage.setItem('orient_active_division_sheets', JSON.stringify(updated));
      }

      // If webhook is available, tell Apps Script to create the tab with monochrome styling
      const webhookUrl = sheetsSync.getGoogleSheetWebhookUrl();
      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create_sheet',
              sheetName: divisionName
            })
          });
        } catch (e) {
          console.warn("Could not create division sheet via webhook:", e);
        }
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('orient_sheets_config_changed'));
      }
      return true;
    } catch (err) {
      console.error("Failed to add division sheet:", err);
      return false;
    }
  },

  /**
   * Open the connected Google Sheet in a new browser tab
   */
  openGoogleSheet: (): void => {
    if (typeof window !== 'undefined') {
      window.open(sheetsSync.getGoogleSheetUrl(), '_blank', 'noopener,noreferrer');
    }
  },

  /**
   * Retrieve all synced orders from local persistent log
   */
  getSyncedOrders: (): SyncedSheetOrderRow[] => {
    try {
      const raw = safeStorage.getItem('orient_google_sheet_orders');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
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
   * Automatically append an order entry into the Google Sheet
   * Called automatically as soon as an order is placed.
   * Status defaults to 'Pending'.
   */
  appendOrderToSheet: async (order: CustomerOrder): Promise<void> => {
    const isTakeaway = order.destination === 'takeaway';
    const isDelivery = isTakeaway && order.deliveryMethod === 'delivery';
    const items = order.items || [];

    // Detailed item breakdown with unit prices and quantities
    const itemNames = items.map(it => it.name).join(', ') || 'General Order';
    const unitPrices = items.map(it => `₦${it.price || 10}`).join(', ') || '₦10';
    const totalQty = items.reduce((sum, it) => sum + (it.quantity || 1), 0);
    const divisionName = getDivisionDisplayName(order.division);
    const initialStatus = normalizeSheetStatus(order.status || 'pending', isDelivery);

    const placedDate = order.placedDate || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA'));
    const placedTime = order.placedTime || (order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const reservedDateTime = (order.reservedDate && order.reservedTime)
      ? `${order.reservedDate} @ ${order.reservedTime}`
      : (order.reservedDate || order.reservedTime || 'Immediate Order');

    const row: SyncedSheetOrderRow = {
      orderId: order.orderId || order.id,
      userId: order.userId || order.customerId || 'Guest',
      customerName: order.customerName || 'Guest User',
      customerPhone: order.customerPhone || 'N/A',
      customerEmail: order.customerEmail || 'N/A',
      placedDate,
      placedTime,
      reservedDate: order.reservedDate || 'N/A',
      reservedTime: order.reservedTime || 'N/A',
      reservedDateTime,
      destination: order.destination === 'dine-in' ? 'Dine-In' : 'Takeaway',
      deliveryMethod: isTakeaway ? (order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup') : 'N/A',
      deliveryAddress: isDelivery ? (order.deliveryAddress || order.shippingAddress || 'N/A') : 'N/A',
      seatNumber: order.destination === 'dine-in' ? (order.seatNumber || order.tableNumber || 'Table 1') : 'N/A',
      itemName: itemNames,
      unitPrice: unitPrices,
      quantity: totalQty,
      totalAmount: `₦${order.totalAmount || (totalQty * 10)}`,
      status: initialStatus,
      confirmedTime: order.chefConfirmedAt ? new Date(order.chefConfirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      readyTime: '',
      completedTime: '',
      notes: order.notes || 'None',
      division: divisionName,
      divisionId: order.division || 'dining',
      createdAt: order.createdAt || new Date().toISOString(),
      syncedAt: new Date().toISOString()
    };

    // 1. Save to local Google Sheet persistent log
    try {
      const existing = sheetsSync.getSyncedOrders();
      const updated = [row, ...existing.filter(o => o.orderId !== row.orderId)];
      safeStorage.setItem('orient_google_sheet_orders', JSON.stringify(updated));

      // Also ensure this division sheet is marked active
      const activeDivs = sheetsSync.getActiveDivisionSheets();
      if (!activeDivs.includes(divisionName)) {
        safeStorage.setItem('orient_active_division_sheets', JSON.stringify([...activeDivs, divisionName]));
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('orient_sheets_synced', { detail: updated }));
      }
    } catch (e) {
      console.warn("Could not save to local sheet sync log:", e);
    }

    // 2. If Google Apps Script Webhook URL is configured, POST to live Google Sheet
    const webhookUrl = sheetsSync.getGoogleSheetWebhookUrl();
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'append_order',
            orderId: row.orderId,
            placedDate: row.placedDate,
            placedTime: row.placedTime,
            customerName: row.customerName,
            customerPhone: row.customerPhone,
            customerEmail: row.customerEmail,
            itemName: row.itemName,
            unitPrice: row.unitPrice,
            quantity: row.quantity,
            totalAmount: row.totalAmount,
            destination: row.destination,
            deliveryMethod: row.deliveryMethod,
            deliveryAddress: row.deliveryAddress,
            seatNumber: row.seatNumber,
            reservedDateTime: row.reservedDateTime,
            status: row.status,
            confirmedTime: row.confirmedTime,
            readyTime: row.readyTime,
            completedTime: row.completedTime,
            notes: row.notes,
            division: row.division
          })
        });
        console.log(`[Google Sheets] Order #${row.orderId} successfully posted to ${row.division} sheet.`);
      } catch (err) {
        console.warn("[Google Sheets] Webhook POST error:", err);
      }
    }
  },

  /**
   * Update Order Status in Google Sheet automatically when chef clicks kitchen buttons
   * Chef clicks existing buttons (e.g. "Confirm and Start", "Ready", "In Transit", "Finish")
   * and this triggers hands-free in the background. Zero manual typing.
   */
  updateOrderStatusInSheet: async (
    orderId: string,
    rawStatus: string,
    timestampInfo?: { confirmedTime?: string; readyTime?: string; completedTime?: string }
  ): Promise<void> => {
    try {
      const existing = sheetsSync.getSyncedOrders();
      const targetIndex = existing.findIndex(o => o.orderId === orderId);
      if (targetIndex === -1) return;

      const current = existing[targetIndex];
      const isDelivery = current.deliveryMethod === 'Delivery';
      const newStatus = normalizeSheetStatus(rawStatus, isDelivery);
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const updatedRow: SyncedSheetOrderRow = {
        ...current,
        status: newStatus,
        confirmedTime: timestampInfo?.confirmedTime 
          ? new Date(timestampInfo.confirmedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : (newStatus === 'Cooking' && !current.confirmedTime ? nowTimeStr : current.confirmedTime),
        readyTime: timestampInfo?.readyTime
          ? new Date(timestampInfo.readyTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : (newStatus === 'Ready' && !current.readyTime ? nowTimeStr : current.readyTime),
        completedTime: timestampInfo?.completedTime
          ? new Date(timestampInfo.completedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : (newStatus === 'Completed' && !current.completedTime ? nowTimeStr : current.completedTime),
        syncedAt: new Date().toISOString()
      };

      existing[targetIndex] = updatedRow;
      safeStorage.setItem('orient_google_sheet_orders', JSON.stringify(existing));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('orient_sheets_synced', { detail: existing }));
      }

      // If Google Apps Script Webhook is active, update the row in Google Sheets
      const webhookUrl = sheetsSync.getGoogleSheetWebhookUrl();
      if (webhookUrl && webhookUrl.startsWith('http')) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'update_status',
              orderId: updatedRow.orderId,
              status: updatedRow.status,
              confirmedTime: updatedRow.confirmedTime,
              readyTime: updatedRow.readyTime,
              completedTime: updatedRow.completedTime,
              division: updatedRow.division
            })
          });
          console.log(`[Google Sheets] Order #${orderId} status updated to ${newStatus} in Google Sheet.`);
        } catch (err) {
          console.warn("[Google Sheets] Failed to update status in Google Sheet via Webhook:", err);
        }
      }
    } catch (e) {
      console.warn("Error updating order status in Google Sheet buffer:", e);
    }
  },

  /**
   * Export all synced orders to CSV formatted with the exact monochromatic column structure
   */
  exportOrdersToCSV: (filename = 'orient_master_operations.csv'): void => {
    if (typeof window === 'undefined') return;

    const orders = sheetsSync.getSyncedOrders();
    const headers = [
      'Order ID',
      'Placed Date',
      'Placed Time',
      'Customer Name',
      'Phone',
      'Email',
      'Items Ordered',
      'Unit Price (₦)',
      'Quantity',
      'Total Amount (₦)',
      'Destination',
      'Delivery Method',
      'Delivery Address',
      'Seat / Table #',
      'Reserved Date & Time',
      'Status',
      'Time Confirmed',
      'Time Ready',
      'Time Finished',
      'Special Notes',
      'Division'
    ];

    const rows = orders.map(o => [
      escapeCSV(o.orderId),
      escapeCSV(o.placedDate),
      escapeCSV(o.placedTime),
      escapeCSV(o.customerName),
      escapeCSV(o.customerPhone),
      escapeCSV(o.customerEmail),
      escapeCSV(o.itemName),
      escapeCSV(o.unitPrice),
      o.quantity,
      escapeCSV(o.totalAmount),
      escapeCSV(o.destination),
      escapeCSV(o.deliveryMethod),
      escapeCSV(o.deliveryAddress),
      escapeCSV(o.seatNumber),
      escapeCSV(o.reservedDateTime),
      escapeCSV(o.status),
      escapeCSV(o.confirmedTime),
      escapeCSV(o.readyTime),
      escapeCSV(o.completedTime),
      escapeCSV(o.notes),
      escapeCSV(o.division)
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Master Google Apps Script Template
   * Provisions all 6 division sheets inside ONE master document with executive monochromatic styling:
   * - Jet black / Deep Charcoal headers (#18181B) with Crisp White bold text (#FFFFFF)
   * - Soft Pearl Gray alternating zebra rows (#F9FAFB)
   * - Monochromatic status formatting (Pending: Silver, Cooking: Slate, Ready: Dark Charcoal, In Transit: Jet, Completed: Black)
   */
  getAppsScriptTemplate: (): string => {
    return `/**
 * ORIENT GLOBAL FLAGSHIP — MASTER OPERATIONS GOOGLE APPS SCRIPT
 * 
 * Supports:
 * - One Master Google Sheet with 6 Division Tabs:
 *   1. Ozzie's Restaurant
 *   2. Ozzie's Bakery
 *   3. Orville Water
 *   4. Orient Games
 *   5. Orient Supermarket
 *   6. Orient Lounge
 * - Automated Chef Status Lifecycle (Pending -> Cooking -> Ready -> In Transit -> Completed)
 * - Monochromatic Executive Styling (#18181B Header, Pure White text, Zebra banding, Monochromatic Status Chips)
 * - Zero manual typing required: automatically updates when kitchen buttons are clicked.
 * 
 * Setup Instructions:
 * 1. In your Google Sheet, click 'Extensions' > 'Apps Script'
 * 2. Delete all existing code and paste this entire code
 * 3. Click 'Deploy' > 'New deployment'
 * 4. Select type: 'Web app'
 * 5. Execute as: 'Me' | Who has access: 'Anyone'
 * 6. Click 'Deploy' and paste the resulting Web App URL into your Orient Dashboard!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action || 'append_order';
    var divisionName = payload.division || "Ozzie's Restaurant";

    // 1. ACTION: CREATE DIVISION SHEET (Within same document)
    if (action === 'create_sheet') {
      var targetSheet = ss.getSheetByName(payload.sheetName);
      if (!targetSheet) {
        targetSheet = ss.insertSheet(payload.sheetName);
      }
      setupMonochromeHeaders(targetSheet);
      return ContentService.createTextOutput(JSON.stringify({ result: "success", sheet: payload.sheetName }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. ACTION: UPDATE ORDER STATUS (Chef clicks "Confirm and Start", "Ready", "In Transit", "Finish")
    if (action === 'update_status') {
      var orderId = payload.orderId;
      var newStatus = payload.status;
      var sheets = ss.getSheets();
      var found = false;

      for (var s = 0; s < sheets.length; s++) {
        var sh = sheets[s];
        var data = sh.getDataRange().getValues();
        for (var r = 1; r < data.length; r++) {
          if (String(data[r][0]).trim() === String(orderId).trim()) {
            // Found row! Column 16 is Status
            sh.getRange(r + 1, 16).setValue(newStatus);
            if (payload.confirmedTime) sh.getRange(r + 1, 17).setValue(payload.confirmedTime);
            if (payload.readyTime) sh.getRange(r + 1, 18).setValue(payload.readyTime);
            if (payload.completedTime) sh.getRange(r + 1, 19).setValue(payload.completedTime);
            applyMonochromeStatusStyle(sh.getRange(r + 1, 16), newStatus);
            found = true;
            break;
          }
        }
        if (found) break;
      }
      return ContentService.createTextOutput(JSON.stringify({ result: "success", found: found }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. ACTION: APPEND NEW ORDER (Automatic when customer places order)
    var sheet = ss.getSheetByName(divisionName);
    if (!sheet) {
      sheet = ss.insertSheet(divisionName);
    }
    if (sheet.getLastRow() === 0) {
      setupMonochromeHeaders(sheet);
    }

    sheet.appendRow([
      payload.orderId || "",
      payload.placedDate || "",
      payload.placedTime || "",
      payload.customerName || "",
      payload.customerPhone || "",
      payload.customerEmail || "",
      payload.itemName || "",
      payload.unitPrice || "₦10",
      payload.quantity || 1,
      payload.totalAmount || "",
      payload.destination || "",
      payload.deliveryMethod || "",
      payload.deliveryAddress || "",
      payload.seatNumber || "",
      payload.reservedDateTime || "",
      payload.status || "Pending",
      payload.confirmedTime || "",
      payload.readyTime || "",
      payload.completedTime || "",
      payload.notes || "",
      payload.division || divisionName
    ]);

    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, 21);
    
    // Monochromatic Zebra Banding
    if (lastRow % 2 === 0) {
      rowRange.setBackground("#FFFFFF");
    } else {
      rowRange.setBackground("#F9FAFB");
    }
    rowRange.setFontFamily("Segoe UI").setFontSize(10);
    applyMonochromeStatusStyle(sheet.getRange(lastRow, 16), payload.status || "Pending");

    return ContentService.createTextOutput(JSON.stringify({ result: "success", row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function setupMonochromeHeaders(sheet) {
  var headers = [
    "Order ID", "Placed Date", "Placed Time", "Customer Name", "Phone", "Email",
    "Items Ordered", "Unit Price (₦)", "Quantity", "Total Amount (₦)",
    "Destination", "Delivery Method", "Delivery Address", "Seat / Table #", "Reserved Date & Time",
    "Status", "Time Confirmed", "Time Ready", "Time Finished", "Special Notes", "Division"
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#18181B"); // Jet black / Charcoal
  headerRange.setFontColor("#FFFFFF");  // Crisp Pure White
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Segoe UI");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 38);
}

function applyMonochromeStatusStyle(cell, status) {
  var s = String(status || '').toLowerCase();
  cell.setHorizontalAlignment("center").setFontFamily("Segoe UI").setFontWeight("bold");
  if (s === 'pending') {
    cell.setBackground("#F4F4F5").setFontColor("#3F3F46"); // Light Silver Gray
  } else if (s === 'cooking') {
    cell.setBackground("#71717A").setFontColor("#FFFFFF"); // Medium Graphite Slate
  } else if (s === 'ready') {
    cell.setBackground("#27272A").setFontColor("#FFFFFF"); // Dark Charcoal
  } else if (s === 'in transit' || s === 'in_transit') {
    cell.setBackground("#18181B").setFontColor("#FFFFFF"); // Jet Charcoal
  } else if (s === 'completed') {
    cell.setBackground("#000000").setFontColor("#FFFFFF"); // Solid Pitch Black
  } else if (s === 'cancelled') {
    cell.setBackground("#E4E4E7").setFontColor("#A1A1AA").setFontLine("line-through"); // Ash Gray
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
