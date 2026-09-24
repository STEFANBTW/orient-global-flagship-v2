# Product Requirements Document — UJ3DMap MVP
## Project 1 of the UJ3DMap Curriculum

**Version**: 1.0 — MVP
**Date**: July 2026
**Scope**: Minimum Viable Product — Static Offline-First PWA

---

## 1. Problem Statement

Students and visitors at the University of Jos (UniJos), Nigeria, have no reliable digital tool for navigating the campus. The campus has poor and inconsistent internet connectivity. A web app that depends on a live server is not viable in this environment.

---

## 2. Solution

A **Progressive Web Application (PWA)** that:
- Loads once from the internet
- Caches all assets locally in the browser
- Operates completely offline after the first load
- Computes walking routes on the device (no server required)

---

## 3. MVP Functional Requirements

| ID | Requirement | Acceptance Criterion |
|----|-------------|----------------------|
| FR-01 | Display an interactive 2D map of the campus | Leaflet.js renders OSM tiles; user can zoom and pan |
| FR-02 | Display 30–50 Points of Interest (POIs) on the map | Markers appear at correct GPS coordinates from `pois.json` |
| FR-03 | Compute a walking route between two points | A* algorithm returns a path; a polyline renders on the map |
| FR-04 | Basic keyword search for POIs | Typing in the search box filters the POI list in real time |
| FR-05 | Full offline capability | All features work with the network tab set to "Offline" in DevTools |

---

## 4. MVP Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Offline-first after first load | Service Worker caches 100% of static assets |
| NFR-02 | Zero backend server | No Node.js server, no database, no API server |
| NFR-03 | Initial JS payload (gzipped) | < 150 KB |
| NFR-04 | App shell load from Service Worker cache | < 1.5 seconds on a mid-range Android device |

---

## 5. Out of Scope for MVP

The following features are **explicitly excluded** from this MVP:

| Feature | Reason for Exclusion |
|---------|----------------------|
| Supabase / PostgreSQL backend | Requires a live server; violates zero-backend constraint |
| Vector / semantic search (pgvector) | Requires an embedding model and database; not needed for < 100 POIs |
| Crowdsourced heatmaps | Requires real-time database writes and aggregation cron jobs |
| Video navigation guides | Requires large binary storage and streaming infrastructure |
| User authentication | Requires a session management backend |
| Admin dashboard | Requires auth; data is managed by editing JSON files directly |
| Multi-floor indoor routing | Requires a more complex graph schema; deferred to V2 |
| PDF export | Not core to navigation; deferred to V2 |

---

## 6. File Architecture

```
project-1-uj3dmap-mvp/
├── prd.md                                  ← This file
├── manuals/
│   ├── Chapter_0_Preworkout.md
│   ├── Chapter_1_Foundation.md
│   ├── Chapter_2_DataLayer.md
│   ├── Chapter_3_Search.md
│   ├── Chapter_4_RoutingEngine.md
│   ├── Chapter_5_PWA_ServiceWorker.md
│   ├── Chapter_6_Testing.md
│   ├── Chapter_7_Documentation.md
│   └── Chapter_8_Deployment.md
├── explanations/
│   ├── Chapter_0_Preworkout_Explanation.md
│   ├── Chapter_1_Foundation_Explanation.md
│   ├── Chapter_2_DataLayer_Explanation.md
│   ├── Chapter_3_Search_Explanation.md
│   ├── Chapter_4_RoutingEngine_Explanation.md
│   ├── Chapter_5_PWA_ServiceWorker_Explanation.md
│   ├── Chapter_6_Testing_Explanation.md
│   ├── Chapter_7_Documentation_Explanation.md
│   └── Chapter_8_Deployment_Explanation.md
└── visualizations/
    ├── project-1-pwa-concept-ch0-interactive.html
    ├── project-1-static-site-architecture-ch0-interactive.html
    ├── project-1-browser-rendering-model-ch0-interactive.html
    ├── project-1-vite-build-tool-ch1-interactive.html
    ├── project-1-es6-modules-ch1-interactive.html
    ├── project-1-leaflet-map-init-ch1-interactive.html
    ├── project-1-osm-tile-system-ch1-interactive.html
    ├── project-1-geojson-layer-render-ch1-interactive.html
    ├── project-1-json-schema-ch2-interactive.html
    ├── project-1-adjacency-list-ch2-interactive.html
    ├── project-1-geojson-standard-ch2-interactive.html
    ├── project-1-string-includes-ch3-interactive.html
    ├── project-1-on-linear-search-ch3-interactive.html
    ├── project-1-dom-event-listeners-ch3-interactive.html
    ├── project-1-graph-traversal-ch4-interactive.html
    ├── project-1-haversine-formula-ch4-interactive.html
    ├── project-1-priority-queue-ch4-interactive.html
    ├── project-1-astar-algorithm-ch4-interactive.html
    ├── project-1-path-reconstruction-ch4-interactive.html
    ├── project-1-sw-lifecycle-ch5-interactive.html
    ├── project-1-cache-storage-api-ch5-interactive.html
    ├── project-1-fetch-interception-ch5-interactive.html
    ├── project-1-web-app-manifest-ch5-interactive.html
    └── project-1-lighthouse-audit-ch6-interactive.html
```

---

## 7. Technology Stack

| Layer | Technology | Version | Reason |
|-------|-----------|---------|--------|
| Build Tool | Vite | 6.x | Fast ESM-native bundler with PWA plugin |
| Language | Vanilla JavaScript | ES2022 | Zero framework overhead |
| Mapping | Leaflet.js | 1.9.x | Lightweight, offline-capable, mobile-first |
| Routing Algorithm | Custom A* (JS) | — | Client-side, no server dependency |
| PWA | vite-plugin-pwa + Workbox | 0.21.x | Service Worker generation |
| Hosting | Cloudflare Pages | — | Free global CDN, zero backend cost |

---

## 8. Deliverables

1. **Live deployed URL** on Cloudflare Pages
2. **GitHub Repository** with professional README.md
3. **Postman Collection** — not applicable for a zero-API static app; replaced by a **Lighthouse Audit Report** (PWA score ≥ 90)
4. **Interactive App** accessible at the deployed URL

---

*Gap Note: This PRD covers approximately 80% of a full PRD standard. The remaining 20% includes: formal user story mapping, acceptance test matrices, risk register, stakeholder sign-off section, and SLA definitions. Study "Writing Effective PRDs" by Gibson Biddle (Medium) and the Google Product Excellence documentation to fill this gap.*
