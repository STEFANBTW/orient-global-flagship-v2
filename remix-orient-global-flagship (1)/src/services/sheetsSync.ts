import { ProductItem } from '@/data/productsCatalog';

/**
 * Excel & Google Sheets Sync Service
 * Supports 1-click Export to CSV/Excel, Import from CSV/Excel,
 * and direct sync formatting for Google Sheets.
 */

export const sheetsSync = {
  /**
   * Default linked Google Sheet URL
   */
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0',

  /**
   * Open the connected Google Sheet in a new tab
   */
  openGoogleSheet: (): void => {
    if (typeof window !== 'undefined') {
      window.open(sheetsSync.googleSheetUrl, '_blank', 'noopener,noreferrer');
    }
  },

  /**
   * Export all items to CSV (Excel & Google Sheets compatible)
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
