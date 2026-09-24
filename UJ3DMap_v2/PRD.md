# 📄 PRODUCT REQUIREMENTS DOCUMENT
## UNIJOS Campus Navigator (v2) — Web Application (Phase 1)
**Version:** 2.0 | **Status:** Draft | **Package Manager:** PNPM (Workspace Monorepo)

---

## 1. PROJECT OVERVIEW

**Product Name:** UNIJOS Campus Navigator (v2)
**Platform (Phase 1):** Web Application (desktop browser + mobile browser, offline-capable PWA)
**Campuses in scope:** Main Campus + New Campus (Permanent Site)
**Client:** Independent developer (self-funded)

**One-sentence description:** A high-performance, offline-capable, and accessibility-aware interactive campus map and routing web application for the University of Jos, built using a modern PNPM monorepo workspace.

---

## 2. PROBLEM STATEMENT

The University of Jos spans multiple large campuses. Google Maps lacks detailed building data, pathways, and accessibility attributes. The client has collected ground-truth GPS data via QField/QGIS and needs an interactive platform to publish, maintain, and route users across these campuses.

---

## 3. GOALS & SUCCESS CRITERIA

| Goal | Success Metric |
| :--- | :--- |
| **Efficient Development** | Minimize storage footprint using a shared **PNPM Workspace** and shared dependency linking. |
| **Fast Loading** | Initial map loads in < 4s on a 3G network. |
| **Offline Performance** | Map visualizes and searches POIs even when offline using service workers. |
| **Multi-modal Routing** | Compute walking, vehicle, and Keke paths client-side. |
| **Language Inclusivity** | Switch UI and POIs between English, Hausa, Yoruba, and Igbo. |
| **Admin Autonomy** | Admin can upload GeoJSON files to update the campus geometry instantly. |

---

## 4. SYSTEM ARCHITECTURE & MONOREPO LAYOUT

The project is structured as a **PNPM Workspace Monorepo** inside `UJ3DMap_v2` to share build tools, reduce storage usage, and isolate the frontend and backend components.

### 4.1. Workspace Structure

```
UJ3DMap_v2/
├── pnpm-workspace.yaml       # Defines workspace packages
├── package.json              # Workspace root scripts
├── PRD.md                    # This document
├── frontend/                 # React + Vite client application
│   ├── package.json
│   ├── vite.config.ts        # Vite + Tailwind + PWA setup
│   └── src/                  # React source (MapLibre GL, routing, i18n)
└── backend/                  # Node.js + Express API server
    ├── package.json
    └── src/                  # Express routes, pg connection, auth
```

### 4.2. Workspace Configuration (`pnpm-workspace.yaml`)
```yaml
packages:
  - 'frontend'
  - 'backend'
```

---

## 5. TECHNICAL STACK & ARCHITECTURE

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Package Manager** | **PNPM Workspaces** | Content-addressable global store to save disk space and manage frontend/backend simultaneously. |
| **Map Rendering** | **MapLibre GL JS** | High-performance WebGL-based vector map renderer supporting smooth zooming and 3D buildings (Phase 2). |
| **Frontend Framework** | **React + Vite + TypeScript** | Component-driven UI, type safety, and blazing fast Vite builds. |
| **Styling** | **Tailwind CSS (v4)** | Rapid UI design using modern CSS compilation. |
| **Routing Engine** | **Client-side Dijkstra/A*** | Fully offline-capable JavaScript routing utilizing GeoJSON network graphs. |
| **Backend API** | **Node.js + Express** | Lightweight, scalable API for POI management and admin authentication. |
| **Database** | **PostgreSQL + PostGIS** | Geographic standard database to store spatial coordinates and POIs. |
| **Authentication** | **JWT** | Lightweight, stateless session management. |
| **i18n** | **react-i18next** | Multi-language translation support for UI and POI tags. |
| **Offline Capabilities** | **Vite PWA Plugin / Workbox** | Service workers caching assets and map tiles. |

---

## 6. KEY FUNCTIONAL REQUIREMENTS

### FR-01: Multimodal Map & Campus Switcher
- Render both campuses using MapLibre GL JS with custom building geometries.
- Allow toggling between Main Campus and New Campus (Permanent Site).
- Map panned and zoomed appropriately to fit the selected campus boundary on switch.

### FR-02: Offline Client-Side Routing
- Compute routing paths inside the browser using client-side graph pathfinding.
- Allow routing by:
  - **Pedestrian**: Use paths, walkways, building entrances.
  - **Vehicle/Keke**: Restrict to tarred/dirt roads suitable for vehicles.

### FR-03: Accessibility Mode
- Filter and highlight paths with wheelchair ramps and accessible building entrances.
- Toggle markers for accessible bathrooms and elevators on/off.

### FR-04: Language Switcher
- Support English, Hausa, Yoruba, and Igbo languages.
- Translate UI strings and provide localized building names when available.

### FR-05: PDF and Data Export
- Allow client-side printing of the current map view along with written directions to a PDF (offline).

### FR-06: Admin Dashboard
- Authenticated login page using JWT.
- CRUD interface for POIs (buildings, ATMs, gates).
- GeoJSON import portal to load new GIS tracks and points collected using QField/QGIS.

---

## 7. DATA PIPELINE (QField → Map)

```
[QField App on Phone] ──> [QGIS on Laptop (Clean/Export)] ──> [Admin Upload (GeoJSON)] ──> [PostgreSQL/PostGIS] ──> [Map Render]
```

Every building GeoJSON properties block must be formatted as:
```json
{
  "type": "Feature",
  "properties": {
    "id": "unijos-main-001",
    "name_en": "Faculty of Law",
    "name_ha": "Makarantar Shari'a",
    "name_yo": "Ẹka Ofin",
    "name_ig": "Ngalaba Iwu",
    "category": "academic",
    "height": 12,
    "floors": 3,
    "campus": "main",
    "accessible": true,
    "description_en": "Houses the Law faculty and moot court"
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[8.889, 9.950], ...]]
  }
}
```

---

## 8. ROADMAP & PHASES

### Phase 1 (Now): Scaffolding & Setup
- Initialize the PNPM workspace structure.
- Configure Tailwind CSS v4 and MapLibre GL JS on the frontend.
- Establish the Express API framework and PostgreSQL schemas.

### Phase 2: Offline Routing & Search
- Implement JavaScript-based Dijkstra/A* routing.
- Integrate i18n switcher.
- Cache map assets with service worker.

### Phase 3: Dashboard & GIS Uploads
- Add JWT login and POI upload functions.
- Build GeoJSON parser for QGIS compatibility.
