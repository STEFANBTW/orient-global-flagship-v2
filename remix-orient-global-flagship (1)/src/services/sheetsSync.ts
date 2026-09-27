import { ProductItem } from '@/data/productsCatalog';
import { CustomerOrder, getDisplayStatus } from './orderService';

/**
 * Excel & Google Sheets Sync Service
 * Supports:
 * - Automatic background syncing of placed orders to Google Sheets
 * - Configurable Google Sheet URL & Google Apps Script Webhook
 * - Real-time local sync log & offline persistence
 * - 1-Click CSV export for Orders & Product Catalog
 * - Google Apps Script code generator for 30-second automated webhook deployment
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
  }
};

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
  destination: string;
  deliveryMethod: string;
  deliveryAddress: string;
  seatNumber: string;
  status: string;
  items: string;
  totalAmount: string;
  notes: string;
  division: string;
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
   * Get Google Apps Script Webhook URL (for direct HTTP POST row injection)
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
   * Open the connected Google Sheet in a new browser tab
   */
  openGoogleSheet: (): void => {
    if (typeof window !== 'undefined') {
      window.open(sheetsSync.getGoogleSheetUrl(), '_blank', 'noopener,noreferrer');
    }
  },

  /**
   * Retrieve all synced orders from the local log
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
   * Called as soon as any order is placed in the application.
   */
  appendOrderToSheet: async (order: CustomerOrder): Promise<void> => {
    const isTakeaway = order.destination === 'takeaway';
    const isDelivery = isTakeaway && order.deliveryMethod === 'delivery';

    const itemsSummary = (order.items || [])
      .map(it => `${it.quantity}x ${it.name} (₦${(it.price || 10) * it.quantity})`)
      .join('; ');

    const row: SyncedSheetOrderRow = {
      orderId: order.orderId || order.id,
      userId: order.userId || order.customerId || 'Guest',
      customerName: order.customerName || 'Guest User',
      customerPhone: order.customerPhone || 'N/A',
      customerEmail: order.customerEmail || 'N/A',
      placedDate: order.placedDate || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')),
      placedTime: order.placedTime || (order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      reservedDate: order.reservedDate || 'N/A',
      reservedTime: order.reservedTime || 'N/A',
      destination: order.destination === 'dine-in' ? 'Dine-In' : 'Takeaway',
      deliveryMethod: isTakeaway ? (order.deliveryMethod === 'delivery' ? 'Delivery' : 'Pickup') : 'N/A',
      deliveryAddress: isDelivery ? (order.deliveryAddress || order.shippingAddress || 'N/A') : 'N/A',
      seatNumber: order.destination === 'dine-in' ? (order.seatNumber || order.tableNumber || 'N/A') : 'N/A',
      status: getDisplayStatus(order.status),
      items: itemsSummary,
      totalAmount: `₦${order.totalAmount}`,
      notes: order.notes || 'None',
      division: order.division || 'dining',
      createdAt: order.createdAt || new Date().toISOString(),
      syncedAt: new Date().toISOString()
    };

    // 1. Save to local Google Sheet cache
    try {
      const existing = sheetsSync.getSyncedOrders();
      const updated = [row, ...existing.filter(o => o.orderId !== row.orderId)];
      safeStorage.setItem('orient_google_sheet_orders', JSON.stringify(updated));

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
          mode: 'no-cors', // Standard for Google Apps Script Web App webhooks
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: row.orderId,
            userId: row.userId,
            customerName: row.customerName,
            customerPhone: row.customerPhone,
            customerEmail: row.customerEmail,
            placedDate: row.placedDate,
            placedTime: row.placedTime,
            reservedDate: row.reservedDate,
            reservedTime: row.reservedTime,
            destination: row.destination,
            deliveryMethod: row.deliveryMethod,
            deliveryAddress: row.deliveryAddress,
            seatNumber: row.seatNumber,
            status: row.status,
            items: row.items,
            totalAmount: row.totalAmount,
            notes: row.notes,
            division: row.division,
            createdAt: row.createdAt
          })
        });
        console.log(`[Google Sheets] Order #${row.orderId} successfully posted to Webhook.`);
      } catch (err) {
        console.warn("[Google Sheets] Webhook POST error:", err);
      }
    } else {
      console.log(`[Google Sheets] Order #${row.orderId} recorded in Google Sheet sync buffer.`);
    }
  },

  /**
   * Export all synced orders to CSV formatted specifically for Google Sheets
   */
  exportOrdersToCSV: (filename = 'orient_orders_google_sheet.csv'): void => {
    if (typeof window === 'undefined') return;

    const orders = sheetsSync.getSyncedOrders();
    const headers = [
      'Order ID',
      'User ID',
      'Customer Name',
      'Phone',
      'Email',
      'Placed Date',
      'Placed Time',
      'Reserved Date',
      'Reserved Time',
      'Destination',
      'Delivery Method',
      'Delivery Address',
      'Seat Number',
      'Status',
      'Items Summary',
      'Total Amount',
      'Notes',
      'Division',
      'Created At',
      'Synced At'
    ];

    const rows = orders.map(o => [
      escapeCSV(o.orderId),
      escapeCSV(o.userId),
      escapeCSV(o.customerName),
      escapeCSV(o.customerPhone),
      escapeCSV(o.customerEmail),
      escapeCSV(o.placedDate),
      escapeCSV(o.placedTime),
      escapeCSV(o.reservedDate),
      escapeCSV(o.reservedTime),
      escapeCSV(o.destination),
      escapeCSV(o.deliveryMethod),
      escapeCSV(o.deliveryAddress),
      escapeCSV(o.seatNumber),
      escapeCSV(o.status),
      escapeCSV(o.items),
      escapeCSV(o.totalAmount),
      escapeCSV(o.notes),
      escapeCSV(o.division),
      escapeCSV(o.createdAt),
      escapeCSV(o.syncedAt)
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
   * Export products to CSV (Catalog inventory)
   */
  exportToCSV: (products: ProductItem[], filename = 'orient_store_catalog.csv'): void => {
    if (typeof window === 'undefined') return;

    const headers = [
      'ID',
      'Name',
      'Division',
      'Category',
      'Price',
      'Discount',
      'Stock',
      'Unit',
      'PrepTimeMinutes',
      '3D_Model_URL',
      'Description',
      'Primary_Image',
      'All_Images',
      'All_Videos'
    ];

    const rows = products.map(p => {
      const allImages = (p.images && p.images.length > 0 ? p.images : [p.image || '']).join(' | ');
      const allVideos = (p.videos || []).join(' | ');

      return [
        escapeCSV(p.id),
        escapeCSV(p.name),
        escapeCSV(p.division),
        escapeCSV(p.category),
        p.price || 10,
        p.discount || 0,
        p.stock ?? 5,
        escapeCSV(p.unit || 'piece'),
        p.prepTimeMinutes || 15,
        escapeCSV(p.model3d || ''),
        escapeCSV(p.description || ''),
        escapeCSV(p.image || ''),
        escapeCSV(allImages),
        escapeCSV(allVideos)
      ].join(',');
    });

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
   * Parse uploaded CSV file content into product items
   */
  parseCSV: (csvText: string): Partial<ProductItem>[] => {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) return [];

    const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
    const items: Partial<ProductItem>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length === 0) continue;

      const record: any = {};
      headers.forEach((header, index) => {
        const val = cols[index]?.trim() || '';
        if (header === 'id') record.id = val;
        else if (header === 'name') record.name = val;
        else if (header === 'division') record.division = val.toLowerCase();
        else if (header === 'category') record.category = val;
        else if (header === 'price') record.price = Number(val) || 10;
        else if (header === 'discount') record.discount = Number(val) || 0;
        else if (header === 'stock') record.stock = Math.max(0, parseInt(val) || 0);
        else if (header === 'unit') record.unit = val || 'unit';
        else if (header === 'preptimeminutes') record.prepTimeMinutes = parseInt(val) || 15;
        else if (header === '3d_model_url' || header === 'model3d') record.model3d = val;
        else if (header === 'description') record.description = val;
        else if (header === 'primary_image' || header === 'image') record.image = val;
        else if (header === 'all_images') {
          record.images = val.split('|').map(s => s.trim()).filter(Boolean);
        } else if (header === 'all_videos') {
          record.videos = val.split('|').map(s => s.trim()).filter(Boolean);
        }
      });

      if (record.name) {
        items.push(record);
      }
    }

    return items;
  },

  /**
   * Ready-to-use Google Apps Script code snippet for the user's Google Sheet
   */
  getAppsScriptTemplate: (): string => {
    return `/**
 * ORIENT RESTAURANT & CMS - AUTOMATIC GOOGLE SHEET WEBHOOK
 * 
 * Instructions:
 * 1. In your Google Sheet, click 'Extensions' > 'Apps Script'
 * 2. Delete any existing code and paste this entire script
 * 3. Click 'Deploy' > 'New Deployment'
 * 4. Choose type: 'Web app'
 * 5. Set 'Execute as': 'Me'
 * 6. Set 'Who has access': 'Anyone'
 * 7. Click 'Deploy' and copy the Web App URL into your Orient Dashboard!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Order ID", "User ID", "Customer Name", "Phone", "Email",
        "Placed Date", "Placed Time", "Reserved Date", "Reserved Time",
        "Destination", "Delivery Method", "Delivery Address", "Seat Number",
        "Status", "Items Summary", "Total Amount", "Notes", "Division", "Created At"
      ]);
      sheet.getRange(1, 1, 1, 19).setFontWeight("bold").setBackground("#f3f4f6");
    }

    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.orderId || "",
      data.userId || "",
      data.customerName || "",
      data.customerPhone || "",
      data.customerEmail || "",
      data.placedDate || "",
      data.placedTime || "",
      data.reservedDate || "",
      data.reservedTime || "",
      data.destination || "",
      data.deliveryMethod || "",
      data.deliveryAddress || "",
      data.seatNumber || "",
      data.status || "",
      data.items || "",
      data.totalAmount || "",
      data.notes || "",
      data.division || "",
      data.createdAt || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
  }
};

function escapeCSV(val: string): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
