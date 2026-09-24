import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pg from 'pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate required environment variables on startup
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Set it in your .env file.');
  process.exit(1);
}
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  console.error('FATAL: ADMIN_USERNAME and ADMIN_PASSWORD must be set in your .env file.');
  process.exit(1);
}

// Middlewares
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  }
}));
app.use(express.json({ limit: '10mb' })); // Allow large GeoJSON uploads

// Setup PostgreSQL client pool (graceful fallback if DB env vars not present)
let dbEnabled = false;
let pool: pg.Pool | null = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    // Test connection
    pool.query('SELECT 1').then(() => {
      dbEnabled = true;
      console.log('✅ PostgreSQL + PostGIS connected.');
    }).catch((err) => {
      console.warn('⚠️  PostgreSQL connection test failed. Falling back to in-memory mode.', err.message);
    });
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err);
  }
} else {
  console.log('ℹ️  No DATABASE_URL set. Running in in-memory fallback mode (not for production).');
}

// ---------------------------------------------------------------------------
// In-Memory Data Store — Full PRD-compliant schema
// ---------------------------------------------------------------------------
let mockPOIs: any[] = [
  {
    id: 'main-senate',
    name_en: 'Main Campus Administration Building',
    name_ha: 'Gidan Gudanarwa na Main Campus',
    name_yo: 'Ikọlu Alakoso Main Campus',
    name_ig: 'Ụlọ Nchịkwa Main Campus',
    category: 'admin',
    subcategory: null,
    height: 15,
    floors: 3,
    campus: 'main',
    accessible: true,
    accessible_entrance: true,
    accessible_bathroom: true,
    description_en: 'Houses the Principal Offices and Admin departments of Main Campus.',
    image_url: null,
    open_hours: '08:00-17:00',
    tags: ['admin', 'offices', 'main-campus']
  },
  {
    id: 'main-law',
    name_en: 'Faculty of Law',
    name_ha: "Makarantar Shari'a",
    name_yo: 'Ẹka Ofin',
    name_ig: 'Ngalaba Iwu',
    category: 'academic',
    subcategory: 'faculty',
    height: 12,
    floors: 2,
    campus: 'main',
    accessible: true,
    accessible_entrance: true,
    accessible_bathroom: false,
    description_en: 'The prestigious Faculty of Law, housing classrooms and a moot court.',
    image_url: null,
    open_hours: '08:00-18:00',
    tags: ['faculty', 'law', 'academic']
  },
  {
    id: 'main-bank',
    name_en: 'Main Campus Microfinance Bank',
    name_ha: 'Bankin Microfinance',
    name_yo: 'Ile-ifowopamọ Microfinance',
    name_ig: 'Microfinance Bank',
    category: 'amenity',
    subcategory: 'bank',
    height: 6,
    floors: 1,
    campus: 'main',
    accessible: false,
    accessible_entrance: false,
    accessible_bathroom: false,
    description_en: 'Provides financial services and ATMs on campus.',
    image_url: null,
    open_hours: '09:00-16:00',
    tags: ['bank', 'atm', 'finance']
  },
  {
    id: 'new-library',
    name_en: 'Main Library (Permanent Site)',
    name_ha: 'Babban Dakin Karatu',
    name_yo: 'Ile-ikawe Nla',
    name_ig: 'Nnukwu Ọ́bá Akwụkwọ',
    category: 'academic',
    subcategory: 'library',
    height: 18,
    floors: 4,
    campus: 'new',
    accessible: true,
    accessible_entrance: true,
    accessible_bathroom: true,
    description_en: 'The multi-floor academic library with computing labs and reading rooms.',
    image_url: null,
    open_hours: '08:00-22:00',
    tags: ['library', 'books', 'computer-lab']
  },
  {
    id: 'new-stadium',
    name_en: 'UniJos Sports Stadium',
    name_ha: "Filin Wasa na Jami'a",
    name_yo: 'Gbangan Ere-idaraya',
    name_ig: "Ama Egwuregwu Jami'a",
    category: 'sports',
    subcategory: null,
    height: 10,
    floors: 1,
    campus: 'new',
    accessible: true,
    accessible_entrance: true,
    accessible_bathroom: false,
    description_en: 'Multi-purpose sports arena for athletics and football.',
    image_url: null,
    open_hours: '06:00-20:00',
    tags: ['sports', 'stadium', 'football', 'athletics']
  },
  {
    id: 'new-naraguta',
    name_en: 'Naraguta Hostel Block A',
    name_ha: 'Naraguta Masaukin Dalibai A',
    name_yo: 'Naraguta Ile Agbejoro A',
    name_ig: 'Ụlọ Naraguta A',
    category: 'hostel',
    subcategory: null,
    height: 12,
    floors: 3,
    campus: 'new',
    accessible: true,
    accessible_entrance: true,
    accessible_bathroom: true,
    description_en: 'Student residence halls near the academic area.',
    image_url: null,
    open_hours: null,
    tags: ['hostel', 'student', 'accommodation']
  }
];

// Analytics in-memory store
const searchLogs: { query: string; campus: string; result_id: string | null; ts: string }[] = [];
const viewLogs: { poi_id: string; ts: string }[] = [];

// ---------------------------------------------------------------------------
// Auth Middleware
// ---------------------------------------------------------------------------
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required.' });
    return;
  }

  jwt.verify(token, JWT_SECRET!, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Invalid or expired token.' });
      return;
    }
    (req as any).user = user;
    next();
  });
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Healthcheck
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'UNIJOS Campus Navigator API',
    version: '2.0',
    database_connected: dbEnabled,
    mode: dbEnabled ? 'postgresql' : 'in-memory'
  });
});

// Admin Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET!, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
  } else {
    // Consistent response time to prevent timing attacks
    setTimeout(() => {
      res.status(401).json({ error: 'Invalid credentials' });
    }, 300);
  }
});

// Verify token (used by frontend to check session on page load)
app.get('/api/auth/verify', authenticateToken, (req: Request, res: Response) => {
  res.json({ valid: true, user: (req as any).user });
});

// ---------------------------------------------------------------------------
// POI Endpoints
// ---------------------------------------------------------------------------

// GET all POIs (optionally filtered by campus)
app.get('/api/pois', async (req: Request, res: Response) => {
  const { campus } = req.query;

  if (dbEnabled && pool) {
    try {
      const query = campus
        ? 'SELECT * FROM pois WHERE campus = $1 ORDER BY name_en'
        : 'SELECT * FROM pois ORDER BY name_en';
      const values = campus ? [campus] : [];
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err: any) {
      res.status(500).json({ error: 'Database query failed', details: err.message });
    }
  } else {
    const filtered = campus ? mockPOIs.filter(p => p.campus === campus) : mockPOIs;
    res.json(filtered);
  }
});

// GET single POI
app.get('/api/pois/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (dbEnabled && pool) {
    try {
      const result = await pool.query('SELECT * FROM pois WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'POI not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Database query failed', details: err.message });
    }
  } else {
    const poi = mockPOIs.find(p => p.id === id);
    if (!poi) {
      res.status(404).json({ error: 'POI not found' });
    } else {
      res.json(poi);
    }
  }
});

// POST create POI (admin only)
app.post('/api/pois', authenticateToken, async (req: Request, res: Response) => {
  const p = req.body;

  if (dbEnabled && pool) {
    try {
      const query = `
        INSERT INTO pois (
          id, name_en, name_ha, name_yo, name_ig,
          category, subcategory, height, floors, campus,
          accessible, accessible_entrance, accessible_bathroom,
          description_en, image_url, open_hours, tags
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10,
          $11, $12, $13,
          $14, $15, $16, $17
        ) RETURNING *
      `;
      const values = [
        p.id, p.name_en, p.name_ha, p.name_yo, p.name_ig,
        p.category, p.subcategory, p.height, p.floors, p.campus,
        p.accessible, p.accessible_entrance, p.accessible_bathroom,
        p.description_en, p.image_url, p.open_hours, p.tags
      ];
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to insert POI', details: err.message });
    }
  } else {
    p.id = p.id || `poi-${Date.now()}`;
    mockPOIs.push(p);
    res.status(201).json(p);
  }
});

// PUT update POI (admin only)
app.put('/api/pois/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const p = req.body;

  if (dbEnabled && pool) {
    try {
      const query = `
        UPDATE pois SET
          name_en = $1, name_ha = $2, name_yo = $3, name_ig = $4,
          category = $5, subcategory = $6, height = $7, floors = $8, campus = $9,
          accessible = $10, accessible_entrance = $11, accessible_bathroom = $12,
          description_en = $13, image_url = $14, open_hours = $15, tags = $16
        WHERE id = $17 RETURNING *
      `;
      const values = [
        p.name_en, p.name_ha, p.name_yo, p.name_ig,
        p.category, p.subcategory, p.height, p.floors, p.campus,
        p.accessible, p.accessible_entrance, p.accessible_bathroom,
        p.description_en, p.image_url, p.open_hours, p.tags, id
      ];
      const result = await pool.query(query, values);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'POI not found' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update POI', details: err.message });
    }
  } else {
    const idx = mockPOIs.findIndex(poi => poi.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'POI not found' });
    } else {
      mockPOIs[idx] = { ...mockPOIs[idx], ...p, id };
      res.json(mockPOIs[idx]);
    }
  }
});

// DELETE POI (admin only)
app.delete('/api/pois/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  if (dbEnabled && pool) {
    try {
      const result = await pool.query('DELETE FROM pois WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'POI not found' });
      } else {
        res.json({ message: 'POI deleted successfully', deleted: result.rows[0] });
      }
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete POI', details: err.message });
    }
  } else {
    const idx = mockPOIs.findIndex(poi => poi.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'POI not found' });
    } else {
      const deleted = mockPOIs.splice(idx, 1);
      res.json({ message: 'POI deleted successfully', deleted: deleted[0] });
    }
  }
});

// ---------------------------------------------------------------------------
// GeoJSON Upload (admin only) — ingest QField / QGIS exports
// ---------------------------------------------------------------------------
app.post('/api/geojson/upload', authenticateToken, async (req: Request, res: Response) => {
  const { geojson } = req.body;

  if (!geojson || geojson.type !== 'FeatureCollection') {
    res.status(400).json({ error: 'Invalid GeoJSON: must be a FeatureCollection.' });
    return;
  }

  const features = geojson.features || [];
  let upserted = 0;
  let skipped = 0;

  for (const feature of features) {
    const props = feature.properties || {};
    if (!props.id) { skipped++; continue; }

    const poi = {
      id: props.id,
      name_en: props.name_en || 'Unnamed',
      name_ha: props.name_ha || null,
      name_yo: props.name_yo || null,
      name_ig: props.name_ig || null,
      category: props.category || 'amenity',
      subcategory: props.subcategory || null,
      height: props.height || 6,
      floors: props.floors || 1,
      campus: props.campus || 'main',
      accessible: props.accessible || false,
      accessible_entrance: props.accessible_entrance || false,
      accessible_bathroom: props.accessible_bathroom || false,
      description_en: props.description_en || null,
      image_url: props.image_url || null,
      open_hours: props.open_hours || null,
      tags: props.tags || []
    };

    if (dbEnabled && pool) {
      try {
        const geomWkt = feature.geometry
          ? `ST_GeomFromGeoJSON('${JSON.stringify(feature.geometry)}')`
          : 'NULL';
        await pool.query(`
          INSERT INTO pois (
            id, name_en, name_ha, name_yo, name_ig, category, subcategory,
            height, floors, campus, accessible, accessible_entrance, accessible_bathroom,
            description_en, image_url, open_hours, tags, geometry
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,${geomWkt}
          )
          ON CONFLICT (id) DO UPDATE SET
            name_en = EXCLUDED.name_en, name_ha = EXCLUDED.name_ha,
            name_yo = EXCLUDED.name_yo, name_ig = EXCLUDED.name_ig,
            category = EXCLUDED.category, subcategory = EXCLUDED.subcategory,
            height = EXCLUDED.height, floors = EXCLUDED.floors,
            campus = EXCLUDED.campus, accessible = EXCLUDED.accessible,
            accessible_entrance = EXCLUDED.accessible_entrance,
            accessible_bathroom = EXCLUDED.accessible_bathroom,
            description_en = EXCLUDED.description_en, image_url = EXCLUDED.image_url,
            open_hours = EXCLUDED.open_hours, tags = EXCLUDED.tags,
            geometry = EXCLUDED.geometry
        `, [
          poi.id, poi.name_en, poi.name_ha, poi.name_yo, poi.name_ig,
          poi.category, poi.subcategory, poi.height, poi.floors, poi.campus,
          poi.accessible, poi.accessible_entrance, poi.accessible_bathroom,
          poi.description_en, poi.image_url, poi.open_hours, poi.tags
        ]);
        upserted++;
      } catch (err: any) {
        console.error(`Failed to upsert POI ${poi.id}:`, err.message);
        skipped++;
      }
    } else {
      const idx = mockPOIs.findIndex(p => p.id === poi.id);
      if (idx !== -1) {
        mockPOIs[idx] = poi;
      } else {
        mockPOIs.push(poi);
      }
      upserted++;
    }
  }

  res.json({
    message: `GeoJSON ingested. ${upserted} features upserted, ${skipped} skipped.`,
    total: mockPOIs.length
  });
});

// ---------------------------------------------------------------------------
// Analytics Endpoints (admin only)
// ---------------------------------------------------------------------------

// Log a search event
app.post('/api/analytics/search', async (req: Request, res: Response) => {
  const { query, campus, result_id } = req.body;
  const entry = { query, campus, result_id: result_id || null, ts: new Date().toISOString() };

  if (dbEnabled && pool) {
    try {
      await pool.query(
        'INSERT INTO search_logs (query, campus, result_id, created_at) VALUES ($1, $2, $3, NOW())',
        [query, campus, result_id]
      );
    } catch { /* non-critical */ }
  } else {
    searchLogs.push(entry);
  }
  res.status(204).end();
});

// Log a POI view event
app.post('/api/analytics/view', async (req: Request, res: Response) => {
  const { poi_id } = req.body;
  const entry = { poi_id, ts: new Date().toISOString() };

  if (dbEnabled && pool) {
    try {
      await pool.query('INSERT INTO view_logs (poi_id, created_at) VALUES ($1, NOW())', [poi_id]);
    } catch { /* non-critical */ }
  } else {
    viewLogs.push(entry);
  }
  res.status(204).end();
});

// GET analytics summary (admin only)
app.get('/api/analytics', authenticateToken, async (_req: Request, res: Response) => {
  if (dbEnabled && pool) {
    try {
      const [topSearches, topViews] = await Promise.all([
        pool.query(`
          SELECT query, COUNT(*) as count
          FROM search_logs
          GROUP BY query
          ORDER BY count DESC
          LIMIT 10
        `),
        pool.query(`
          SELECT poi_id, COUNT(*) as count
          FROM view_logs
          GROUP BY poi_id
          ORDER BY count DESC
          LIMIT 10
        `)
      ]);
      res.json({ top_searches: topSearches.rows, top_views: topViews.rows });
    } catch (err: any) {
      res.status(500).json({ error: 'Analytics query failed', details: err.message });
    }
  } else {
    // Aggregate in-memory
    const searchCounts: Record<string, number> = {};
    searchLogs.forEach(l => { searchCounts[l.query] = (searchCounts[l.query] || 0) + 1; });
    const viewCounts: Record<string, number> = {};
    viewLogs.forEach(l => { viewCounts[l.poi_id] = (viewCounts[l.poi_id] || 0) + 1; });

    const top_searches = Object.entries(searchCounts)
      .sort(([, a], [, b]) => b - a).slice(0, 10)
      .map(([query, count]) => ({ query, count }));
    const top_views = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a).slice(0, 10)
      .map(([poi_id, count]) => ({ poi_id, count }));

    res.json({ top_searches, top_views });
  }
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 UNIJOS Navigator API running → http://localhost:${PORT}`);
});
