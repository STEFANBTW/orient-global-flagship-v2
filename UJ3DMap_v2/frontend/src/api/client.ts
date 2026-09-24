// API client for UNIJOS Campus Navigator backend
// Falls back gracefully if the backend is unreachable.

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:5000';
const TIMEOUT_MS = 4000;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface APIPOI {
  id: string;
  name_en: string;
  name_ha: string | null;
  name_yo: string | null;
  name_ig: string | null;
  category: 'academic' | 'admin' | 'amenity' | 'hostel' | 'sports' | 'gate' | 'other';
  subcategory: string | null;
  height: number;
  floors: number;
  campus: 'main' | 'new';
  accessible: boolean;
  accessible_entrance: boolean;
  accessible_bathroom: boolean;
  description_en: string | null;
  image_url: string | null;
  open_hours: string | null;
  tags: string[];
}

export interface AnalyticsSummary {
  top_searches: { query: string; count: number }[];
  top_views: { poi_id: string; count: number }[];
}

// ---------------------------------------------------------------------------
// Core fetch helper
// ---------------------------------------------------------------------------
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as any).error ?? `HTTP ${res.status}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// POI endpoints
// ---------------------------------------------------------------------------
export async function fetchPOIs(campus?: string): Promise<APIPOI[]> {
  const qs = campus ? `?campus=${campus}` : '';
  return apiFetch<APIPOI[]>(`/api/pois${qs}`);
}

export async function createPOI(data: Partial<APIPOI>, token: string): Promise<APIPOI> {
  return apiFetch<APIPOI>('/api/pois', { method: 'POST', body: JSON.stringify(data) }, token);
}

export async function updatePOI(id: string, data: Partial<APIPOI>, token: string): Promise<APIPOI> {
  return apiFetch<APIPOI>(`/api/pois/${id}`, { method: 'PUT', body: JSON.stringify(data) }, token);
}

export async function deletePOI(id: string, token: string): Promise<void> {
  await apiFetch<void>(`/api/pois/${id}`, { method: 'DELETE' }, token);
}

export async function uploadGeoJSON(
  geojson: object,
  token: string
): Promise<{ message: string; total: number }> {
  return apiFetch('/api/geojson/upload', {
    method: 'POST',
    body: JSON.stringify({ geojson }),
  }, token);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function login(
  username: string,
  password: string
): Promise<{ token: string; message: string }> {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await apiFetch('/api/auth/verify', {}, token);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------
export async function fetchAnalytics(token: string): Promise<AnalyticsSummary> {
  return apiFetch<AnalyticsSummary>('/api/analytics', {}, token);
}

/** Fire-and-forget — never throws */
export function logSearch(query: string, campus: string, result_id?: string): void {
  apiFetch('/api/analytics/search', {
    method: 'POST',
    body: JSON.stringify({ query, campus, result_id: result_id ?? null }),
  }).catch(() => {});
}

/** Fire-and-forget — never throws */
export function logView(poi_id: string): void {
  apiFetch('/api/analytics/view', {
    method: 'POST',
    body: JSON.stringify({ poi_id }),
  }).catch(() => {});
}
