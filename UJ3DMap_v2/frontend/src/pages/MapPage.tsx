import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin, Navigation, Search, Accessibility, Globe, Car, Footprints,
  Trash2, X, Building, Locate, Share2, Download, Menu, AlertCircle,
  Clock, Info
} from 'lucide-react';
import { campusPOIs, campusBuildings, campusPaths } from '../data/mockGeoJSON';
import type { POIFeature, BuildingFeature } from '../data/mockGeoJSON';
import { buildGraph, findShortestPath } from '../utils/routing';
import { fetchPOIs, logSearch, logView } from '../api/client';
import type { APIPOI } from '../api/client';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CAMPUS_CENTERS: Record<string, [number, number]> = {
  main: [8.892, 9.952],
  new: [8.905, 9.965],
};

/** Merge API attribute data onto local GeoJSON (which holds geometry) */
function mergePoiData(local: POIFeature[], api: APIPOI[]): POIFeature[] {
  if (!api.length) return local;
  const apiMap = new Map(api.map(p => [p.id, p]));
  return local.map(feat => {
    const a = apiMap.get(feat.properties.id);
    if (!a) return feat;
    return {
      ...feat,
      properties: {
        ...feat.properties,
        name_en: a.name_en,
        name_ha: a.name_ha ?? feat.properties.name_ha,
        name_yo: a.name_yo ?? feat.properties.name_yo,
        name_ig: a.name_ig ?? feat.properties.name_ig,
        category: a.category as any,
        subcategory: a.subcategory ?? undefined,
        height: a.height,
        floors: a.floors,
        accessible: a.accessible,
        accessible_entrance: a.accessible_entrance,
        accessible_bathroom: a.accessible_bathroom,
        description_en: a.description_en ?? feat.properties.description_en,
        image_url: a.image_url ?? undefined,
        open_hours: a.open_hours ?? undefined,
        tags: a.tags,
      },
    };
  });
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface MapPageProps {
  onAdminClick: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MapPage({ onAdminClick }: MapPageProps) {
  const { t, i18n } = useTranslation();

  // Read initial state from URL params (share link support)
  const initParams = new URLSearchParams(window.location.search);

  const [lang, setLang] = useState('en');
  const [campus, setCampus] = useState<'main' | 'new'>(
    (initParams.get('campus') as 'main' | 'new') ?? 'main'
  );
  const [travelMode, setTravelMode] = useState<'pedestrian' | 'vehicle'>('pedestrian');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<POIFeature[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POIFeature | null>(null);
  const [pois, setPOIs] = useState<POIFeature[]>(campusPOIs);

  // Routing
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [routeInfo, setRouteInfo] = useState<{ path: [number, number][]; distance: number } | null>(null);
  const [routeError, setRouteError] = useState(false);

  // Filters
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  // UI
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copied, setCopied] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const graph = useRef<ReturnType<typeof buildGraph> | null>(null);
  const userMarker = useRef<maplibregl.Marker | null>(null);

  // ─── Restore share-link POI ──────────────────────────────────────────────
  useEffect(() => {
    const poiId = initParams.get('poi');
    if (poiId) {
      const poi = campusPOIs.find(p => p.properties.id === poiId);
      if (poi) { setCampus(poi.properties.campus); setSelectedPOI(poi); }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch API data (merge with local geometry) ──────────────────────────
  useEffect(() => {
    fetchPOIs()
      .then(api => setPOIs(mergePoiData(campusPOIs, api)))
      .catch(() => { /* backend not running — silent fallback to local mock */ });
  }, []);

  // ─── Build routing graph ─────────────────────────────────────────────────
  useEffect(() => {
    graph.current = buildGraph(campusPaths);
  }, []);

  // ─── MapLibre initialisation (re-runs on campus change) ──────────────────
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: CAMPUS_CENTERS[campus],
      zoom: 15.5,
      pitch: 45,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.current.on('load', () => {
      if (!map.current) return;

      // ── 3-D building extrusions ────────────────────────────────────────
      map.current.addSource('buildings', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: campusBuildings.filter(b => b.properties.campus === campus),
        },
      });

      map.current.addLayer({
        id: 'buildings-3d',
        type: 'fill-extrusion',
        source: 'buildings',
        paint: {
          'fill-extrusion-color': [
            'match', ['get', 'category'],
            'academic', '#a855f7',
            'admin',    '#3b82f6',
            'amenity',  '#f59e0b',
            'hostel',   '#10b981',
            'sports',   '#ef4444',
            '#94a3b8',
          ],
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.85,
        },
      });

      // Building click → open POI panel
      map.current.on('click', 'buildings-3d', (e: any) => {
        const props = e.features?.[0]?.properties;
        if (!props) return;
        const poi = pois.find(p => p.properties.id === props.id);
        if (poi) handleSelectPOI(poi);
      });
      map.current.on('mouseenter', 'buildings-3d', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', 'buildings-3d', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // ── POI dot markers ────────────────────────────────────────────────
      map.current.addSource('pois', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: pois.filter(p => p.properties.campus === campus),
        },
      });

      map.current.addLayer({
        id: 'poi-symbols',
        type: 'circle',
        source: 'pois',
        paint: {
          'circle-radius': 8,
          'circle-color': '#4f46e5',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // ── Route line ─────────────────────────────────────────────────────
      map.current.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] } },
      });

      map.current.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#4f46e5', 'line-width': 6, 'line-opacity': 0.9 },
      });

      // ── Path network (debug dashes) ────────────────────────────────────
      map.current.addSource('network', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: campusPaths.filter(p => p.properties.campus === campus),
        },
      });

      map.current.addLayer({
        id: 'network-lines',
        type: 'line',
        source: 'network',
        paint: { 'line-color': '#e2e8f0', 'line-width': 2, 'line-dasharray': [2, 2] },
      });
    });

    return () => { map.current?.remove(); map.current = null; };
  }, [campus]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Search (all 4 languages + tags) ─────────────────────────────────────
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = pois.filter(p => {
      if (p.properties.campus !== campus) return false;
      const pr = p.properties;
      return (
        pr.name_en.toLowerCase().includes(q) ||
        (pr.name_ha ?? '').toLowerCase().includes(q) ||
        (pr.name_yo ?? '').toLowerCase().includes(q) ||
        (pr.name_ig ?? '').toLowerCase().includes(q) ||
        pr.description_en.toLowerCase().includes(q) ||
        (pr.tags ?? []).some((tag: string) => tag.toLowerCase().includes(q))
      );
    });
    setSearchResults(results);

    // Log search analytics (debounced naturally by useEffect)
    if (searchQuery.length >= 3) logSearch(searchQuery, campus);
  }, [searchQuery, campus, pois]);

  // ─── Routing ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!origin || !destination) {
      setRouteInfo(null); setRouteError(false); clearMapRoute(); return;
    }

    const from = pois.find(p => p.properties.id === origin);
    const to   = pois.find(p => p.properties.id === destination);

    if (from && to && graph.current) {
      const result = findShortestPath(
        graph.current,
        from.geometry.coordinates,
        to.geometry.coordinates,
        travelMode,
        accessibleOnly
      );

      if (result) {
        setRouteInfo(result); setRouteError(false);
        // Draw on map
        if (map.current?.getSource('route')) {
          (map.current.getSource('route') as any).setData({
            type: 'Feature', properties: {},
            geometry: { type: 'LineString', coordinates: result.path },
          });
          const bounds = result.path.reduce(
            (b, c) => b.extend(c as [number, number]),
            new maplibregl.LngLatBounds(result.path[0], result.path[0])
          );
          map.current.fitBounds(bounds, { padding: 80 });
        }
      } else {
        setRouteInfo(null); setRouteError(true); clearMapRoute();
      }
    }
  }, [origin, destination, travelMode, accessibleOnly, pois]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const clearMapRoute = () => {
    if (map.current?.getSource('route')) {
      (map.current.getSource('route') as any).setData({
        type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: [] },
      });
    }
  };

  const clearRoutes = () => {
    setOrigin(''); setDestination('');
    setRouteInfo(null); setRouteError(false);
    clearMapRoute();
  };

  const handleSelectPOI = useCallback((poi: POIFeature) => {
    setSelectedPOI(poi);
    logView(poi.properties.id);
    map.current?.flyTo({ center: poi.geometry.coordinates, zoom: 17, essential: true });
    const p = new URLSearchParams({ campus: poi.properties.campus, poi: poi.properties.id });
    window.history.replaceState(null, '', `?${p}`);
  }, []);

  const switchCampus = (c: 'main' | 'new') => {
    setCampus(c); clearRoutes(); setSelectedPOI(null); setSearchQuery('');
    window.history.replaceState(null, '', `?campus=${c}`);
  };

  const selectLang = (l: string) => { setLang(l); i18n.changeLanguage(l); };

  const name = (poi: POIFeature | BuildingFeature): string => {
    const p = poi.properties;
    if (lang === 'ha') return p.name_ha || p.name_en;
    if (lang === 'yo') return p.name_yo || p.name_en;
    if (lang === 'ig') return p.name_ig || p.name_en;
    return p.name_en;
  };

  // ─── Geolocation ──────────────────────────────────────────────────────────
  const handleLocate = () => {
    if (!navigator.geolocation) { alert('Geolocation is not supported by your browser.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setLocating(false);
        map.current?.flyTo({ center: coords, zoom: 17, essential: true });

        // Pulsing dot marker
        userMarker.current?.remove();
        const el = document.createElement('div');
        el.setAttribute('aria-label', 'Your current location');
        el.setAttribute('role', 'img');
        el.style.cssText = [
          'width:20px;height:20px;border-radius:50%;',
          'background:#4f46e5;border:3px solid white;',
          'box-shadow:0 0 0 0 rgba(79,70,229,.4);',
          'animation:pulse-loc 1.5s ease infinite;',
        ].join('');
        userMarker.current = new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map.current!);
      },
      (err) => { setLocating(false); alert(`Location error: ${err.message}`); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ─── Share ────────────────────────────────────────────────────────────────
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for Safari / http
      const ta = document.createElement('textarea');
      ta.value = url; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans text-slate-800 dark:text-slate-100 bg-slate-950">

      {/* Keyframe for user-location pulse */}
      <style>{`
        @keyframes pulse-loc{0%{box-shadow:0 0 0 0 rgba(79,70,229,.5)}70%{box-shadow:0 0 0 14px rgba(79,70,229,0)}100%{box-shadow:0 0 0 0 rgba(79,70,229,0)}}
        @media print{header,aside,footer,.print-hide{display:none!important}.maplibregl-ctrl{display:none!important}}
      `}</style>

      {/* ══════ MAP CANVAS ════════════════════════════════════════════════ */}
      <div
        className="w-full h-full"
        ref={mapContainer}
        role="application"
        aria-label="UNIJOS interactive campus map"
      />

      {/* ══════ HEADER ════════════════════════════════════════════════════ */}
      <header className="print-hide absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border border-white/20 dark:border-slate-800/30 shadow-2xl">

        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-600/30">
            <Navigation className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
              {t('appName')}
            </h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">University of Jos</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Campus switcher */}
          <div
            className="flex bg-slate-200/50 dark:bg-slate-800/50 p-0.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30"
            role="group" aria-label="Campus selection"
          >
            {(['main', 'new'] as const).map(c => (
              <button
                key={c}
                onClick={() => switchCampus(c)}
                aria-pressed={campus === c}
                className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold tracking-wide transition-all ${
                  campus === c
                    ? 'bg-white dark:bg-slate-700 shadow text-purple-600 dark:text-purple-300'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {c === 'main' ? t('campusMain') : t('campusNew')}
              </button>
            ))}
          </div>

          {/* Language switcher */}
          <div
            className="flex items-center gap-0.5 bg-slate-200/50 dark:bg-slate-800/50 p-0.5 rounded-xl border border-slate-300/30 dark:border-slate-700/30"
            role="group" aria-label="Language selection"
          >
            <Globe className="h-3.5 w-3.5 text-slate-400 ml-1.5 mr-0.5" aria-hidden="true" />
            {[
              { code: 'en', label: 'English' },
              { code: 'ha', label: 'Hausa' },
              { code: 'yo', label: 'Yoruba' },
              { code: 'ig', label: 'Igbo' },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => selectLang(code)}
                aria-pressed={lang === code}
                aria-label={`Switch to ${label}`}
                className={`w-8 h-7 rounded-[10px] text-[10px] font-bold uppercase transition-all ${
                  lang === code
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300/30 dark:hover:bg-slate-700/40'
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Find Me */}
          <button
            onClick={handleLocate}
            disabled={locating}
            aria-label={locating ? 'Locating…' : 'Find my location'}
            title="Find my location"
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 shadow-sm transition-all disabled:opacity-50"
          >
            <Locate className={`h-4 w-4 ${locating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>

          {/* Print / PDF */}
          <button
            onClick={() => window.print()}
            aria-label="Print map to PDF"
            title="Print map to PDF"
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 shadow-sm transition-all"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            aria-label={sidebarOpen ? 'Close panel' : 'Open navigation panel'}
            aria-expanded={sidebarOpen}
            aria-controls="sidebar-panel"
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 shadow-sm transition-all md:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Admin */}
          <button
            onClick={onAdminClick}
            aria-label="Open admin dashboard"
            title="Admin Dashboard"
            className="h-9 px-3 text-xs font-bold rounded-xl bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 transition-all shadow-sm"
          >
            Admin
          </button>
        </div>
      </header>

      {/* ══════ SIDEBAR (left) ════════════════════════════════════════════ */}
      {/* Desktop: fixed panel. Mobile: bottom drawer toggled by FAB */}
      <div
        className={[
          'print-hide absolute z-20 flex flex-col gap-4 overflow-y-auto pointer-events-none',
          // Desktop
          'md:left-6 md:top-28 md:bottom-6 md:w-96 md:flex',
          // Mobile
          sidebarOpen
            ? 'bottom-0 left-0 right-0 top-auto max-h-[72vh] p-4 gap-3 bg-white/97 dark:bg-slate-900/97 backdrop-blur-xl border-t border-slate-200/40 dark:border-slate-700/40 rounded-t-3xl shadow-2xl'
            : 'hidden md:flex',
        ].join(' ')}
        id="sidebar-panel"
        aria-label="Navigation panel"
      >
        {/* Mobile drag handle */}
        <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mx-auto shrink-0 md:hidden" />

        {/* ── Routing card ─────────────────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/30 rounded-2xl shadow-xl p-4 flex flex-col gap-3 pointer-events-auto shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <Navigation className="h-4 w-4 text-purple-600" aria-hidden="true" />
              {t('directions')}
            </h2>
            {(routeInfo || routeError) && (
              <button
                onClick={clearRoutes}
                aria-label="Clear route"
                className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1 transition-all"
              >
                <Trash2 className="h-3 w-3" aria-hidden="true" />
                {t('clearRoute')}
              </button>
            )}
          </div>

          {/* Origin */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/30">
            <MapPin className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
            <select
              value={origin}
              onChange={e => setOrigin(e.target.value)}
              aria-label="Select origin"
              className="w-full bg-transparent text-xs font-medium focus:outline-none"
            >
              <option value="">{t('origin')}</option>
              {pois.filter(p => p.properties.campus === campus).map(p => (
                <option key={p.properties.id} value={p.properties.id}>{name(p)}</option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/30">
            <MapPin className="h-4 w-4 text-red-500 shrink-0" aria-hidden="true" />
            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              aria-label="Select destination"
              className="w-full bg-transparent text-xs font-medium focus:outline-none"
            >
              <option value="">{t('destination')}</option>
              {pois.filter(p => p.properties.campus === campus).map(p => (
                <option key={p.properties.id} value={p.properties.id}>{name(p)}</option>
              ))}
            </select>
          </div>

          {/* Mode + accessibility toggles */}
          <div className="flex items-center justify-between gap-2 border-t border-slate-200/50 dark:border-slate-800/30 pt-2.5">
            <div
              className="flex bg-slate-100 dark:bg-slate-950/60 p-0.5 rounded-xl border border-slate-200 dark:border-slate-800/40"
              role="group" aria-label="Travel mode"
            >
              <button
                onClick={() => setTravelMode('pedestrian')}
                aria-pressed={travelMode === 'pedestrian'}
                aria-label="Walking mode"
                title={t('routeWalking')}
                className={`p-2 rounded-[10px] transition-all ${
                  travelMode === 'pedestrian'
                    ? 'bg-white dark:bg-slate-800 shadow text-purple-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Footprints className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => setTravelMode('vehicle')}
                aria-pressed={travelMode === 'vehicle'}
                aria-label="Vehicle / Keke mode"
                title={t('routeVehicle')}
                className={`p-2 rounded-[10px] transition-all ${
                  travelMode === 'vehicle'
                    ? 'bg-white dark:bg-slate-800 shadow text-purple-600'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Car className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <button
              onClick={() => setAccessibleOnly(v => !v)}
              aria-pressed={accessibleOnly}
              aria-label="Show accessible routes only"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                accessibleOnly
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400'
                  : 'bg-white border-slate-200 text-slate-500 dark:bg-slate-900 dark:border-slate-800/50'
              }`}
            >
              <Accessibility className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{t('accessibleOnly')}</span>
            </button>
          </div>

          {/* Route found */}
          {routeInfo && (
            <div
              className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl"
              role="status" aria-live="polite"
            >
              <p className="text-[9px] uppercase font-bold tracking-wider opacity-75 mb-1">Route Found</p>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">
                  {routeInfo.distance > 1000
                    ? `${(routeInfo.distance / 1000).toFixed(2)} km`
                    : `${Math.round(routeInfo.distance)} ${t('meters')}`}
                </span>
                <span className="text-xs opacity-80">
                  · ~{Math.max(1, Math.round(routeInfo.distance / 1.4 / 60))} {t('mins')}
                </span>
              </div>
            </div>
          )}

          {/* No route error */}
          {routeError && (
            <div
              className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-start gap-2 text-red-600 dark:text-red-400"
              role="alert"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-xs font-medium leading-relaxed">
                No connected route found. Try switching travel mode or choosing different points.
              </p>
            </div>
          )}
        </div>

        {/* ── Search card ──────────────────────────────────────────────── */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/30 rounded-2xl shadow-xl p-4 flex flex-col gap-3 pointer-events-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/40 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/30 focus-within:ring-2 focus-within:ring-purple-500/25">
            <Search className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
            <input
              id="poi-search"
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search buildings, faculties, and facilities"
              className="w-full bg-transparent text-xs font-medium focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                <X className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <ul
              className="max-h-52 overflow-y-auto flex flex-col gap-0.5 -mr-1 pr-1"
              role="listbox"
              aria-label="Search results"
            >
              {searchResults.map(poi => (
                <li key={poi.properties.id} role="option">
                  <button
                    onClick={() => { handleSelectPOI(poi); setSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-xs hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
                  >
                    <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 shrink-0">
                      <Building className="h-3.5 w-3.5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{name(poi)}</p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {poi.properties.category} · {poi.properties.floors} floor{poi.properties.floors !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ══════ POI DETAIL PANEL (right) ══════════════════════════════════ */}
      {selectedPOI && (
        <aside
          className="print-hide absolute right-6 top-28 bottom-6 z-20 w-96 flex flex-col pointer-events-none max-md:right-4 max-md:left-4 max-md:w-auto max-md:top-auto max-md:bottom-4 max-md:max-h-[60vh]"
          aria-label="Building details"
        >
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/20 dark:border-slate-800/30 rounded-2xl shadow-2xl p-5 flex flex-col gap-4 pointer-events-auto overflow-y-auto">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold tracking-wider text-purple-600 dark:text-purple-400 block mb-0.5">
                  {selectedPOI.properties.category}
                  {selectedPOI.properties.subcategory ? ` › ${selectedPOI.properties.subcategory}` : ''}
                </span>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {name(selectedPOI)}
                </h2>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <button
                  onClick={handleShare}
                  aria-label={copied ? 'Link copied to clipboard' : 'Copy share link'}
                  title={copied ? 'Copied!' : 'Share location'}
                  className={`p-1.5 rounded-lg transition-all ${
                    copied ? 'text-emerald-500' : 'text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => {
                    setSelectedPOI(null);
                    window.history.replaceState(null, '', `?campus=${campus}`);
                  }}
                  aria-label="Close building details"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Photo */}
            {selectedPOI.properties.image_url && (
              <div className="h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={selectedPOI.properties.image_url}
                  alt={`Photo of ${selectedPOI.properties.name_en}`}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }}
                />
              </div>
            )}

            {/* Meta grid */}
            <div className="flex flex-col gap-2 text-xs">
              {/* Open hours */}
              {selectedPOI.properties.open_hours && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-950/30">
                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                  <span className="text-slate-500">Hours:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedPOI.properties.open_hours}</span>
                </div>
              )}

              {/* Floors */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950/30">
                <span className="text-slate-500">{t('floors')}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPOI.properties.floors}</span>
              </div>

              {/* Accessibility */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/30 flex flex-col gap-1.5">
                <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">{t('accessibility')}</span>
                {[
                  { key: 'accessible',           label: 'Wheelchair accessible' },
                  { key: 'accessible_entrance',   label: 'Accessible entrance' },
                  { key: 'accessible_bathroom',   label: 'Accessible restrooms' },
                ].map(({ key, label }) => {
                  const val = (selectedPOI.properties as any)[key] as boolean;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${val ? 'bg-emerald-500' : 'bg-red-400'}`} aria-hidden="true" />
                      <span className="text-slate-700 dark:text-slate-300">{label}</span>
                      <span className="sr-only">: {val ? 'Yes' : 'No'}</span>
                    </div>
                  );
                })}
              </div>

              {/* Description */}
              {selectedPOI.properties.description_en && (
                <div className="flex flex-col gap-1.5 border-t border-slate-200/50 dark:border-slate-800/30 pt-3">
                  <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">{t('description')}</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedPOI.properties.description_en}</p>
                </div>
              )}

              {/* Quick routing actions */}
              <div className="flex gap-2 border-t border-slate-200/50 dark:border-slate-800/30 pt-3">
                <button
                  onClick={() => setOrigin(selectedPOI.properties.id)}
                  aria-label={`Set ${selectedPOI.properties.name_en} as start point`}
                  className="flex-1 py-2 rounded-xl font-bold text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200 transition-all"
                >
                  Set Start
                </button>
                <button
                  onClick={() => setDestination(selectedPOI.properties.id)}
                  aria-label={`Set ${selectedPOI.properties.name_en} as destination`}
                  className="flex-1 py-2 rounded-xl font-bold text-xs bg-purple-600 text-white shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all"
                >
                  Set End
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* ══════ FOOTER ════════════════════════════════════════════════════ */}
      <footer className="print-hide absolute bottom-4 right-4 z-10 px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/20 dark:border-slate-800/30 shadow-lg flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">UNIJOS Navigator v2 · Phase 1</span>
      </footer>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
