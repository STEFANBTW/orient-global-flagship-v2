# 🗺️ PRD Compliance Assessment
## UNIJOS Campus Navigator — UJ3DMap_v2
**Assessed:** 2026-06-18 | **Codebase:** `UJ3DMap_v2/` (PNPM Monorepo)

---

## TL;DR Scorecard

| Area | Status | Score |
|---|---|---|
| Infrastructure / Monorepo | ✅ Compliant | 5/5 |
| Tech Stack | ✅ Mostly Compliant | 8/10 |
| Functional Requirements | 🟡 Partial | 6/12 |
| Non-Functional Requirements | 🔴 Mostly Missing | 3/12 |
| Data Model | ✅ Compliant | 4/5 |
| Admin / Backend | 🟡 Partial | 3/5 |
| **OVERALL** | 🟡 **Phase 1 Scaffold** | **~55%** |

The project is a **well-structured scaffold** that correctly establishes the foundation. The core map renders, routing logic exists, i18n is wired up, and the backend shell is in place. But it is **not yet a shippable Phase 1 product** — the majority of the defined functional requirements are either stubbed with placeholder data or entirely absent.

---

## 1. Infrastructure & Monorepo

| Item | PRD Requirement | Status | Notes |
|---|---|---|---|
| PNPM Workspace | `pnpm-workspace.yaml` with `frontend` + `backend` | ✅ PASS | Correctly configured |
| Frontend | React + Vite + TypeScript | ✅ PASS | All present |
| Backend | Node.js + Express + TypeScript | ✅ PASS | `server.ts` is working |
| Shared workspace root | Root `package.json` + lockfile | ✅ PASS | `pnpm-lock.yaml` present |

---

## 2. Tech Stack Decisions

| Layer | PRD Says | Current State | Status |
|---|---|---|---|
| Map Library | MapLibre GL JS | ✅ `maplibre-gl@5.24` installed + used | ✅ PASS |
| Framework | React + Vite + TypeScript | ✅ React 19 + Vite 8 + TS 6 | ✅ PASS |
| Styling | Tailwind CSS v4 | ✅ `@tailwindcss/vite@4.3` installed | ✅ PASS |
| Routing Engine | Client-side Dijkstra/A* | ✅ Dijkstra implemented in `routing.ts` | ✅ PASS |
| Backend | Node.js + Express | ✅ Present | ✅ PASS |
| Database | PostgreSQL + PostGIS | 🟡 `pg` installed, graceful fallback to in-memory | 🟡 PARTIAL — no schema file, no PostGIS |
| Auth (Admin) | JWT | ✅ `jsonwebtoken` installed + middleware written | ✅ PASS |
| i18n | react-i18next | ✅ Installed + full 4-language translations in `i18n.ts` | ✅ PASS |
| Offline / PWA | Vite PWA Plugin / Workbox | ❌ **Not installed. No service worker. No PWA manifest.** | ❌ MISSING |
| PDF Export | Client-side PDF | ❌ **No library installed. No UI control for it.** | ❌ MISSING |

---

## 3. Functional Requirements

### FR-01: Map Display ✅ PASS
- MapLibre is initialized with the CartoDB Voyager tile style.
- Campus buildings rendered as **3D fill-extrusion** polygons — ahead of schedule (PRD Phase 2 feature, already working).
- POI circle markers rendered.
- Both campuses distinguished by filtering on `campus` property.

### FR-02: Campus Switcher ✅ PASS
- Toggle buttons exist in the header for `Main Campus` and `New Campus (Permanent Site)`.
- Switching destroys/recreates the map centred on hardcoded coordinates.

> ⚠️ **Minor gap:** The map center coordinates (`[8.892, 9.952]` / `[8.905, 9.965]`) are placeholders — they have not been verified against OSM. The campus switcher must be validated against the actual campus locations once you have real coordinates from QField.

### FR-03: Search ✅ PASS
- Real-time text filtering across `name_en`, `name_ha`, and `description_en`.
- Results list renders with click-to-zoom behaviour.

> ⚠️ **Gap:** Search only matches against English and Hausa fields, not `name_yo` or `name_ig`. This means Yoruba/Igbo-speaking users searching in their language won't get results even though those name fields exist on the data.

### FR-04: Routing — Pedestrian ✅ PASS
- Dijkstra's algorithm implemented, pedestrian mode filtering works.
- Route displayed as a line on the map, distance + estimated time shown.

### FR-05: Routing — Vehicle ✅ PASS
- Vehicle mode is a separate filter in the same Dijkstra implementation.
- UI toggle between walking (Footprints icon) and vehicle (Car icon) exists.

> ⚠️ **Gap:** With only 3 mock path segments, routing will fail silently for most origin/destination pairs. This is a data problem not a code problem, but the UX does not communicate "no route found" to the user — `routeInfo` just stays null with no feedback.

### FR-06: Geolocation ❌ MISSING
- The `t('findMe')` translation key exists in i18n (suggesting it was planned).
- **There is no "Find Me" / geolocation button anywhere in the UI or code.**
- `navigator.geolocation` is never called.

### FR-07: POI Info Panel ✅ PASS
- Right-side glassmorphism drawer renders when a building is clicked or a search result is selected.
- Shows: name (localized), category, floors, accessibility indicators (3 types), description.
- **Quick actions**: "Set Start" and "Set End" buttons integrate with the routing widget — this is a good UX touch.

> ⚠️ **Gap:** `image_url` and `open_hours` fields exist on the data model but are never displayed in the panel.

### FR-08: Accessibility Layer 🟡 PARTIAL
- `accessibleOnly` state exists and is passed to the routing algorithm — it correctly filters edges.
- The UI toggle button exists (wheelchair icon).
- **What's missing:** There is no dedicated map overlay for accessibility. The PRD calls for visible markers for ramps, accessible entrances, and accessible bathrooms toggled on/off as a map layer. The current implementation only filters routing paths — it doesn't visually highlight accessible buildings or show ramp icons.

### FR-09: Language Switcher ✅ PASS
- All 4 languages (EN / HA / YO / IG) are fully translated in `i18n.ts`.
- Language switcher buttons exist in the header.
- `getLocalizedName()` correctly selects the right name field for map labels.
- `react-i18next` wired into the component correctly.

> ⚠️ **Gap (noted above):** Search doesn't search `name_yo` / `name_ig` fields.

### FR-10: PDF Export ❌ MISSING
- No PDF library (`html2canvas`, `jsPDF`, etc.) is installed.
- No download button exists in the UI.

### FR-11: Share Location ❌ MISSING
- No shareable URL mechanism exists.
- No `URLSearchParams` / deep linking logic implemented.
- No "Share" button in the UI.

### FR-12: Admin Dashboard ❌ MISSING (frontend)
- The **backend API** has correct endpoints: `POST /api/auth/login`, full CRUD for `/api/pois`, and a `POST /api/geojson/upload` endpoint.
- **The frontend admin dashboard UI does not exist at all.** There is no login page, no POI management table, no GeoJSON upload form.
- Analytics endpoints are also absent from the backend.

---

## 4. Non-Functional Requirements

| ID | Requirement | Status | Notes |
|---|---|---|---|
| NFR-01 | < 4s initial load on 3G | 🟡 Untested | No performance budget enforcement. CartoDB tiles are fast but MapLibre GL JS is a large bundle. No code-splitting visible. |
| NFR-02 | < 2s search response | ✅ Likely PASS | Client-side filtering of a small array will be instant. |
| NFR-03 | Tile caching via Service Worker | ❌ MISSING | No service worker. No PWA plugin. No Workbox. This is a hard PRD requirement that is fully absent. |
| NFR-04 | PDF available offline | ❌ MISSING | PDF feature does not exist. |
| NFR-05 | Works at 360px width | 🔴 LIKELY FAIL | The sidebar is `w-96` (384px) and positioned `absolute left-6`. On a 360px screen this overflows the viewport. No responsive breakpoints detected. |
| NFR-06 | Browser support (Chrome, Firefox, Safari last 2) | 🟡 Likely OK | Standard stack, no obvious incompatibilities. WebGL required for MapLibre. |
| NFR-07 | Keyboard navigable, screen reader labels | 🔴 NOT MET | No `aria-label` attributes on map controls. Icon-only buttons (Footprints, Car, Accessibility) have no accessible labels. `title` prop on buttons is not a substitute for `aria-label`. |
| NFR-08 | JWT auth, HTTPS, no hardcoded creds | 🔴 FAIL | `server.ts` line 99: **hardcoded credentials** `admin` / `unijos2026` and line 11: hardcoded `JWT_SECRET = 'unijos-secret-key'`. This is a security risk. |
| NFR-09 | Free/low-cost hosting | ✅ Architecture PASS | Stack is compatible with Vercel + Railway/Render free tiers. |
| NFR-10 | QGIS GeoJSON consumable without transformation | 🟡 PARTIAL | The GeoJSON upload endpoint exists on the backend. The schema is correct. But the frontend still reads from `mockGeoJSON.ts` — it does not fetch from the backend API. |
| NFR-11 | `height` + `floors` in GeoJSON from day one | ✅ PASS | Both fields present in the data model and used in 3D rendering. |
| NFR-12 | Architecture supports Phase 2 (mobile/3D) | ✅ PASS | MapLibre fill-extrusion already working. React components are modular. Monorepo is extensible. |

---

## 5. Data Model

| Field | PRD GeoJSON Schema | In `mockGeoJSON.ts` | Status |
|---|---|---|---|
| `id` | ✅ | ✅ | PASS |
| `name_en/ha/yo/ig` | ✅ All 4 | ✅ All 4 | PASS |
| `category` + `subcategory` | ✅ | ✅ (`subcategory` optional) | PASS |
| `height` + `floors` | ✅ | ✅ | PASS |
| `campus` | ✅ | ✅ | PASS |
| `accessible` + `accessible_entrance` + `accessible_bathroom` | ✅ All 3 | ✅ All 3 | PASS |
| `description_en` | ✅ | ✅ | PASS |
| `image_url` | ✅ | ✅ (optional field) | PASS |
| `open_hours` | ✅ | ✅ (optional field) | PASS |
| `tags` | ✅ PRD includes tags array | ❌ **Not in the TypeScript interface** | MISSING |

> ⚠️ **Backend vs. Frontend gap:** The backend `mockPOIs` object in `server.ts` is a simpler/older schema — it's missing `name_yo`, `name_ig`, `accessible_entrance`, `accessible_bathroom`, `subcategory`, `image_url`, `open_hours`. The backend and frontend data models have **drifted apart**.

---

## 6. Backend Assessment

| Item | Status | Notes |
|---|---|---|
| `GET /api/pois` | ✅ Working | Returns mock or DB data |
| `POST /api/pois` | ✅ Working | Auth-gated, inserts to DB or mock |
| `PUT /api/pois/:id` | ✅ Working | Auth-gated, updates by ID |
| `DELETE /api/pois/:id` | ✅ Working | Auth-gated |
| `POST /api/auth/login` | ✅ Working | Returns JWT |
| `POST /api/geojson/upload` | ✅ Working | Parses FeatureCollection |
| Analytics endpoint | ❌ MISSING | PRD FR-12 requires search/view analytics |
| Database schema file | ❌ MISSING | No `schema.sql` or migration file |
| `.env.example` file | ❌ MISSING | No documentation of required env vars |
| Frontend ↔ Backend connected | ❌ NOT DONE | Frontend never calls the backend API |

---

## Priority Gap List (What to Build Next)

These are ranked by PRD impact:

### 🔴 Critical — Phase 1 Blockers
1. **Connect frontend to backend API** — `campusPOIs` must be fetched from `/api/pois`, not hardcoded in `mockGeoJSON.ts`. This is the entire point of having a backend.
2. **Admin Dashboard UI** — Login page + POI CRUD interface + GeoJSON upload form. FR-12 is fully unimplemented on the frontend.
3. **Service Worker / PWA** — Install `vite-plugin-pwa` + Workbox. NFR-03 is a core differentiator for Nigerian connectivity.
4. **Mobile responsiveness** — The `w-96` sidebar will break on phones. This needs a collapsible mobile layout.
5. **Fix hardcoded credentials** — Move to `.env` file immediately. Add `.env.example`.

### 🟡 Important — Functional Gaps
6. **Geolocation button** — FR-06 is fully missing. Add `navigator.geolocation` + pulsing marker.
7. **PDF export** — FR-10. Add `html2canvas` + `jsPDF`.
8. **Share location** — FR-11. Parse/write URL hash `#lat,lng,zoom` or `?poi=id`.
9. **"No route found" feedback** — Silent null when routing fails is bad UX. Add an error state.
10. **Fix search to cover all 4 languages** — Add `name_yo` and `name_ig` to the search filter.

### 🟢 Polish — NFR & Data
11. **Accessibility (a11y) labels** — Add `aria-label` to all icon-only buttons.
12. **Display `image_url` and `open_hours` in POI panel** — Fields exist on the data, just not rendered.
13. **Sync backend data model with frontend** — Backend `mockPOIs` is missing several fields.
14. **Add `tags` field to TypeScript interface** — It's in the PRD GeoJSON schema.
15. **Write `schema.sql`** — Document the PostgreSQL table structure with PostGIS geometry column.
