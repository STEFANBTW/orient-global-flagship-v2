import { useEffect, useState, useRef } from 'react';
import {
  Navigation, LogOut, Plus, Pencil, Trash2, Upload, BarChart2,
  CheckCircle, XCircle, RefreshCw, X, AlertCircle, TrendingUp, Eye
} from 'lucide-react';
import {
  fetchPOIs, createPOI, updatePOI, deletePOI,
  uploadGeoJSON, fetchAnalytics
} from '../api/client';
import type { APIPOI, AnalyticsSummary } from '../api/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Tab = 'pois' | 'upload' | 'analytics';

const EMPTY_POI: Partial<APIPOI> = {
  id: '', name_en: '', name_ha: '', name_yo: '', name_ig: '',
  category: 'academic', subcategory: '', height: 6, floors: 1,
  campus: 'main', accessible: false, accessible_entrance: false,
  accessible_bathroom: false, description_en: '', image_url: '',
  open_hours: '', tags: [],
};

// ---------------------------------------------------------------------------
// Helper: small status badge
// ---------------------------------------------------------------------------
function AccessBadge({ yes }: { yes: boolean }) {
  return yes
    ? <CheckCircle className="h-4 w-4 text-emerald-500" aria-label="Yes" />
    : <XCircle className="h-4 w-4 text-red-400" aria-label="No" />;
}

// ---------------------------------------------------------------------------
// POI Form Modal
// ---------------------------------------------------------------------------
interface POIFormProps {
  initial: Partial<APIPOI>;
  onSave: (data: Partial<APIPOI>) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}

function POIForm({ initial, onSave, onClose, saving }: POIFormProps) {
  const [form, setForm] = useState<Partial<APIPOI>>(initial);
  const set = <K extends keyof APIPOI>(k: K, v: APIPOI[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  const field = (
    label: string, key: keyof APIPOI, type: string = 'text',
    placeholder?: string
  ) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={`poi-${key}`} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        id={`poi-${key}`}
        type={type}
        value={(form[key] as any) ?? ''}
        onChange={e => set(key, (type === 'number' ? Number(e.target.value) : e.target.value) as any)}
        placeholder={placeholder}
        className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
      />
    </div>
  );

  const check = (label: string, key: 'accessible' | 'accessible_entrance' | 'accessible_bathroom') => (
    <label htmlFor={`poi-${key}`} className="flex items-center gap-2 cursor-pointer">
      <input
        id={`poi-${key}`}
        type="checkbox"
        checked={!!form[key]}
        onChange={e => set(key, e.target.checked as any)}
        className="w-4 h-4 rounded accent-purple-600"
      />
      <span className="text-sm text-slate-300">{label}</span>
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-label="Edit POI"
    >
      <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-slate-900 z-10">
          <h3 className="text-lg font-bold text-white">{form.id ? 'Edit POI' : 'Add New POI'}</h3>
          <button onClick={onClose} aria-label="Close form" className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Identity */}
          <div className="grid grid-cols-2 gap-3">
            {field('ID', 'id', 'text', 'e.g. main-senate')}
            {field('Category', 'category')}
            {field('Subcategory', 'subcategory', 'text', 'e.g. faculty')}
            <div className="flex flex-col gap-1">
              <label htmlFor="poi-campus" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campus</label>
              <select
                id="poi-campus"
                value={form.campus ?? 'main'}
                onChange={e => set('campus', e.target.value as any)}
                className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
              >
                <option value="main">Main Campus</option>
                <option value="new">New Campus (Permanent Site)</option>
              </select>
            </div>
          </div>

          {/* Names */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Names (all languages)</p>
            <div className="grid grid-cols-2 gap-3">
              {field('English', 'name_en', 'text', 'Faculty of Law')}
              {field('Hausa', 'name_ha', 'text', "Makarantar Shari'a")}
              {field('Yoruba', 'name_yo', 'text', 'Ẹka Ofin')}
              {field('Igbo', 'name_ig', 'text', 'Ngalaba Iwu')}
            </div>
          </div>

          {/* Physical */}
          <div className="grid grid-cols-3 gap-3">
            {field('Height (m)', 'height', 'number')}
            {field('Floors', 'floors', 'number')}
            {field('Open Hours', 'open_hours', 'text', '08:00–18:00')}
          </div>

          {/* Accessibility */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Accessibility</p>
            {check('Wheelchair accessible', 'accessible')}
            {check('Accessible entrance', 'accessible_entrance')}
            {check('Accessible restrooms', 'accessible_bathroom')}
          </div>

          {/* Description + image */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="poi-desc" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description (English)</label>
              <textarea
                id="poi-desc"
                value={form.description_en ?? ''}
                onChange={e => set('description_en', e.target.value as any)}
                rows={3}
                className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 resize-none transition-all"
                placeholder="Describe this building or POI…"
              />
            </div>
            {field('Image URL', 'image_url', 'url', 'https://…')}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label htmlFor="poi-tags" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags (comma-separated)</label>
            <input
              id="poi-tags"
              type="text"
              value={(form.tags ?? []).join(', ')}
              onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean) as any)}
              placeholder="faculty, law, academic"
              className="bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-white/10 sticky bottom-0 bg-slate-900">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:text-white font-semibold text-sm transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.id || !form.name_en}
            aria-busy={saving}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/20"
          >
            {saving ? 'Saving…' : 'Save POI'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------
interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('pois');
  const [pois, setPOIs] = useState<APIPOI[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editPOI, setEditPOI] = useState<Partial<APIPOI> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  // GeoJSON upload
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadResult, setUploadResult] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Load POIs ─────────────────────────────────────────────────────────────
  const loadPOIs = async () => {
    setLoading(true); setError('');
    try {
      setPOIs(await fetchPOIs());
    } catch {
      setError('Could not load POIs from the backend.');
    } finally {
      setLoading(false);
    }
  };

  // ── Load Analytics ────────────────────────────────────────────────────────
  const loadAnalytics = async () => {
    try {
      setAnalytics(await fetchAnalytics(token));
    } catch {
      setAnalytics(null);
    }
  };

  useEffect(() => {
    loadPOIs();
    loadAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleSave = async (data: Partial<APIPOI>) => {
    setSaving(true);
    try {
      if (pois.find(p => p.id === data.id) && editPOI?.id === data.id) {
        const updated = await updatePOI(data.id!, data, token);
        setPOIs(prev => prev.map(p => p.id === updated.id ? updated : p));
        showToast('POI updated successfully.');
      } else {
        const created = await createPOI(data, token);
        setPOIs(prev => [...prev, created]);
        showToast('POI created successfully.');
      }
      setEditPOI(null);
    } catch (err: any) {
      showToast(err.message || 'Save failed.', 'err');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      await deletePOI(id, token);
      setPOIs(prev => prev.filter(p => p.id !== id));
      showToast('POI deleted.');
      setDeleteTarget(null);
    } catch (err: any) {
      showToast(err.message || 'Delete failed.', 'err');
    } finally {
      setSaving(false);
    }
  };

  // ── GeoJSON upload ────────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadResult('');
    try {
      const text = await file.text();
      const geojson = JSON.parse(text);
      const result = await uploadGeoJSON(geojson, token);
      setUploadResult(result.message);
      showToast(result.message);
      await loadPOIs();
    } catch (err: any) {
      const msg = err.message || 'Upload failed.';
      setUploadResult(msg);
      showToast(msg, 'err');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-screen bg-slate-950 font-sans text-white flex flex-col">

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === 'ok'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'ok'
            ? <CheckCircle className="h-4 w-4" aria-hidden="true" />
            : <AlertCircle className="h-4 w-4" aria-hidden="true" />
          }
          {toast.msg}
        </div>
      )}

      {/* POI Form Modal */}
      {editPOI !== null && (
        <POIForm
          initial={editPOI}
          onSave={handleSave}
          onClose={() => setEditPOI(null)}
          saving={saving}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Delete POI?</h3>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently remove <strong className="text-white">{deleteTarget}</strong>.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-slate-300 hover:text-white font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteTarget)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm"
              >
                {saving ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-950/90 backdrop-blur border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-600/30">
            <Navigation className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">UNIJOS Navigator</h1>
            <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">Admin Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { window.location.hash = ''; }}
            aria-label="Return to map"
            className="h-9 px-3 text-xs font-bold rounded-xl border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-all"
          >
            ← Map
          </button>
          <button
            onClick={onLogout}
            aria-label="Sign out"
            className="h-9 px-3 text-xs font-bold rounded-xl bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 transition-all flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 px-6 pt-4">
        {([
          { id: 'pois',      label: 'POI Manager',   icon: <Navigation className="h-4 w-4" /> },
          { id: 'upload',    label: 'GeoJSON Upload', icon: <Upload className="h-4 w-4" /> },
          { id: 'analytics', label: 'Analytics',      icon: <BarChart2 className="h-4 w-4" /> },
        ] as const).map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {icon}{label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-6">

        {/* ─ POI MANAGER ─────────────────────────────────────────────────── */}
        {tab === 'pois' && (
          <section aria-label="POI Manager">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Points of Interest
                <span className="ml-2 text-sm font-normal text-slate-400">({pois.length} total)</span>
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={loadPOIs}
                  aria-label="Refresh POI list"
                  className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/15 text-slate-400 hover:text-white transition-all"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setEditPOI({ ...EMPTY_POI })}
                  aria-label="Add new POI"
                  className="h-9 px-4 flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-purple-600/20"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add POI
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-40 text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" aria-hidden="true" />
                Loading…
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-xl">
                <table className="w-full text-sm" aria-label="POIs table">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {['ID', 'Name (EN)', 'Category', 'Campus', 'Floors', 'Access', 'Actions'].map(h => (
                        <th key={h} scope="col" className="px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pois.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-400">{p.id}</td>
                        <td className="px-4 py-3 font-semibold text-white max-w-[180px] truncate">{p.name_en}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-600/20 text-purple-300 border border-purple-600/20">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300 capitalize">{p.campus}</td>
                        <td className="px-4 py-3 text-slate-300">{p.floors}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5">
                            <AccessBadge yes={p.accessible} />
                            <AccessBadge yes={p.accessible_entrance} />
                            <AccessBadge yes={p.accessible_bathroom} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditPOI({ ...p })}
                              aria-label={`Edit ${p.name_en}`}
                              className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-purple-600 text-slate-300 hover:text-white transition-all"
                            >
                              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(p.id)}
                              aria-label={`Delete ${p.name_en}`}
                              className="h-7 w-7 flex items-center justify-center rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {pois.length === 0 && !loading && (
                  <p className="text-center py-10 text-slate-500">No POIs found. Add one above or upload a GeoJSON file.</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* ─ GEOJSON UPLOAD ──────────────────────────────────────────────── */}
        {tab === 'upload' && (
          <section aria-label="GeoJSON Upload" className="max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-2">GeoJSON Upload</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Upload a <code className="text-purple-400">.geojson</code> or <code className="text-purple-400">.json</code> FeatureCollection
              exported from QField / QGIS. Existing POIs with matching IDs will be updated; new ones will be created.
            </p>

            {/* Drop zone */}
            <label
              htmlFor="geojson-file"
              className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-500/50 bg-white/5 hover:bg-purple-600/5 transition-all cursor-pointer"
            >
              <Upload className="h-10 w-10 text-slate-500" aria-hidden="true" />
              <div className="text-center">
                <p className="font-semibold text-slate-300">Click to select file</p>
                <p className="text-xs text-slate-500 mt-1">Accepts: .geojson, .json</p>
              </div>
              <input
                id="geojson-file"
                ref={fileRef}
                type="file"
                accept=".geojson,.json,application/json"
                onChange={handleFileUpload}
                disabled={uploading}
                aria-label="Choose GeoJSON file to upload"
                className="sr-only"
              />
            </label>

            {uploading && (
              <div className="flex items-center gap-2 mt-4 text-sm text-purple-300">
                <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
                Uploading and processing…
              </div>
            )}

            {uploadResult && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-400 text-sm font-medium" role="status">
                ✓ {uploadResult}
              </div>
            )}

            <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Expected GeoJSON schema</p>
              <pre className="text-xs text-slate-400 overflow-x-auto leading-relaxed">{`{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "id": "main-senate",
      "name_en": "Administration Building",
      "name_ha": "Gidan Gudanarwa",
      "name_yo": "Ile Alakoso",
      "name_ig": "Ụlọ Nchịkwa",
      "category": "admin",
      "height": 15, "floors": 3,
      "campus": "main",
      "accessible": true,
      "accessible_entrance": true,
      "accessible_bathroom": false
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [[[8.892, 9.952], ...]]
    }
  }]
}`}</pre>
            </div>
          </section>
        )}

        {/* ─ ANALYTICS ────────────────────────────────────────────────────── */}
        {tab === 'analytics' && (
          <section aria-label="Analytics">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Usage Analytics</h2>
              <button
                onClick={loadAnalytics}
                aria-label="Refresh analytics"
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-white/15 text-slate-400 hover:text-white transition-all"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {!analytics ? (
              <p className="text-slate-500 text-sm">Analytics unavailable. Backend may be in in-memory mode.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Searches */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    Top Searches
                  </h3>
                  {analytics.top_searches.length === 0 ? (
                    <p className="text-slate-500 text-xs">No search data yet.</p>
                  ) : (
                    <ol className="flex flex-col gap-2">
                      {analytics.top_searches.map((s, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300 truncate max-w-[70%]">
                            <span className="text-slate-500 mr-2 text-xs">{i + 1}.</span>
                            {s.query}
                          </span>
                          <span className="text-purple-400 font-bold text-xs">{s.count}×</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Top Views */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    Most Viewed POIs
                  </h3>
                  {analytics.top_views.length === 0 ? (
                    <p className="text-slate-500 text-xs">No view data yet.</p>
                  ) : (
                    <ol className="flex flex-col gap-2">
                      {analytics.top_views.map((v, i) => (
                        <li key={i} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300 font-mono text-xs truncate max-w-[70%]">
                            <span className="text-slate-500 mr-2">{i + 1}.</span>
                            {v.poi_id}
                          </span>
                          <span className="text-purple-400 font-bold text-xs">{v.count} views</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
