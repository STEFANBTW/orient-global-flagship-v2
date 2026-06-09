# Product Requirement Document (PRD) - UJ3DMap

## 1. Project Overview
**UJ3DMap** is an interactive, Progressive Web Application (PWA) map and routing system designed for the **University of Jos (UniJos)**, Plateau State, Nigeria. 

The application maps three core areas:
1. **Main Campus**: The oldest, first, and still fully functional campus.
2. **Permanent Site**: The new, larger campus.
3. **City Road**: The primary transit corridor connecting the two campuses, traversed by the school shuttle buses.

### Key Objectives
* Provide an interactive 2D map experience (with an eye for a future 3D extension).
* Enable fully **offline** client-side navigation and routing across different travel modes.
* Support contextual multimedia direction guides (videos and local guides).
* Integrate real-time student-crowdsourced heatmaps (Wi-Fi, power, crowds, parking).
* Offer vector-based semantic search online, falling back to fast keyword search offline.
* Allow admin data ingestion using standard GIS tools (QGIS, JOSM) via GeoJSON.

---

## 2. User Roles & Permissions
The system defines three primary user categories:

| Role | Permissions | Authentication |
| :--- | :--- | :--- |
| **Guest / Student / Visitor** | View maps, calculate routes, search POIs, download PDFs/videos, submit anonymous heatmap reports. | None (Public) |
| **Registered Helper (Crowdsourcer)** | All guest privileges + upload proposed missing areas, routes, and POIs for admin moderation. | Supabase Auth |
| **Admin** | Full system access. Upload final GIS GeoJSON, moderate and publish videos, manage registered helpers, override heatmap values. | Supabase Auth (Admin Role) |

---

## 3. Technical Architecture & Stack
The technology stack is selected for lightweight offline PWA performance and scalability:

* **Frontend Architecture**: Pure Vanilla JavaScript (ES6 Modules), HTML5, and standard CSS (no React or frontend frameworks to keep the payload absolutely minimal). Node.js is utilized for workspace tooling and Vite PWA compilation.
* **Mapping Library**: **Leaflet** (highly optimized, 2D mobile-friendly, large ecosystem of plugins for offline tiles and overlays).
* **Backend Database**: **Supabase** (PostgreSQL database with `pgvector` extension for vector embeddings, built-in Auth, and Storage buckets for videos, images, and static PDFs).
* **Offline Client Storage**: **IndexedDB** (via RxDB or local localForage) for caching the routing graph and POIs, and browser **Cache Storage API** for map tiles, static PDFs, and cached videos.
* **Offline Search Engine**: **Orama** or **FlexSearch** (client-side indexer running inside the browser on IndexedDB datasets).
* **PDF Generation**: **jsPDF** + Canvas capturing for client-side route PDF exports, combined with pre-rendered static PDFs hosted on Supabase Storage.

---

## 4. Key Functional Specifications

### 4.1. Interactive 2D Map & Layers
* **Base Map**: Leaflet base map using OSM tiles when online. For offline use, a localized tile cache covers the campus bounding box at zoom levels 14 to 19.
* **Map Views**:
  * **Day View**: Standard map color styling.
  * **Night View**: Toggles a dark-styled map theme (dark base tiles) and displays night-time photos in POI cards.
* **Points of Interest (POIs)**:
  * Categories: Faculties, Admin Blocks (ICT, Admin Building, Security, Medical), Hostels, Amenities (Sports, Banks, Eateries, Outdoor seatings, POS, Kiosks, Provision shops), Libraries, Car parks.
  * Details: Labeled popups/cards showing category, name, photo (day/night), description, amenities, floor plans, and associated video guides.

### 4.2. Routing & Direction Engine (Fully Offline)
* **Unified Graph Model**: Outdoors and building interiors are modeled as a single connected network of nodes and edges in a GeoJSON dataset.
  * **Edges** contain attributes: `allowed_modes` (pedestrian, bicycle, vehicle, indoor) and `floor_level` (integer).
  * **Transition Nodes** connect outdoor networks to indoor ground floors (entrances) and connect indoor floor layers (stairs, elevators, ramps).
* **Travel Modes**:
  1. **Pedestrian**: Walkways, paths, corridors, stairs.
  2. **Bicycle & Motorbike**: Paths, alleys, and service roads (excludes stairs and indoor corridors).
  3. **Vehicles**: Tarred/dirt roads, parking lots (excludes walkways, stairs, and indoor paths).
  4. **Indoor-only**: Guided routing inside buildings between rooms, corridors, and floors.
* **Routing Algorithm**: Client-side **Dijkstra** or **A\*** search. It filters the network graph dynamically by the selected travel mode.
* **Live Location Routing**: Routes between a GPS-live location (using Geolocation API) and a POI, or between two custom points.

### 4.3. Video Guides
* **Contextual Routing Videos**: When POI-to-POI directions are calculated, the app searches the database for a matching video guide (`start_poi_id` -> `end_poi_id`). If found, it attaches a "Play Video Guide" option to the direction steps.
* **Video Gallery Tab**: A dedicated app page listing all uploaded navigation guides, searchable by starting point, destination, or campus.
* **Offline Playback**: Users can choose to download video files (hosted in Supabase Storage). The app caches these files in the browser's Cache Storage for offline playback.

### 4.4. Hybrid Search (Semantic & Keyword)
* **Online Vector Search**: Users can type queries in natural language (e.g. *"Where is the closest place to get cash?"* or *"Fastest way to ICT"*). The query is sent to Supabase, which generates embeddings and does a cosine-similarity search using `pgvector` to return relevant POIs/routes.
* **Offline Fallback Search**: When offline, search falls back to a fast client-side query library (like Orama) indexing POI names, alternative keywords, categories, and building descriptions cached in IndexedDB.

### 4.5. Dynamic Crowdsourced Heatmaps
* **Heatmap Overlays**: Toggleable map overlays for:
  1. **Wi-Fi Strength**
  2. **Power Supply Status** (Electricity grid vs Generator vs Outage)
  3. **Crowd Density** (Student crowd sizes)
  4. **Parking Space Availability**
* **Data Loop**:
  * Guest and Registered users submit quick, single-tap status updates at their current location.
  * Supabase aggregates submissions hourly to compute localized heat intensities.
  * Leaflet renders a heatmap overlay using the aggregated data points.
  * Admins can instantly override or reset values in the dashboard to prevent spam or false reports.

### 4.6. PDF Export & Document Downloads
* **Static Campus Maps**: High-resolution pre-rendered PDFs of the Main Campus, Permanent Site, and City Road maps are hosted on Supabase and cached in the PWA.
* **Custom Route PDFs**: Generated dynamically on-the-fly in the client using `jsPDF`. It takes the routing map viewport (rendered to canvas) and embeds it alongside the text-based turn-by-turn direction instructions.

### 4.7. Admin Dashboard
* **GIS Ingestion**: Interface to upload GeoJSON files exported from QGIS/JOSM (updating nodes, edges, buildings, and POI tables).
* **Moderation Panel**: Approve, edit, or delete video guides uploaded by registered helpers.
* **User Registration**: Admin interface to invite and register Trusted Helpers (crowdsourcing users).
* **Heatmap Overriding**: Management view to monitor and override active heatmap signals.

---

## 5. Phased Implementation Roadmap
To make building this complex app fun and manageable, the project is structured in phases:

### Phase 1: Core Foundation & UI (2D Leaflet Map)
* Set up Vite + Vanilla JS + Leaflet template without frameworks.
* Configure Service Worker caching for PWA static assets.
* Establish basic layout: Sidebar navigation, Map View, Search box, and Day/Night mode toggles.
* Render mock GeoJSON layers (Main Campus buildings, Permanent Site, and City Road).

### Phase 2: Client-side Offline Routing
* Implement client-side Dijkstra/A* algorithm in JS.
* Parse test GeoJSON network (roads and walkways) into a graph.
* Build mode selection (Pedestrian, Bicycle, Vehicle) and compute/render routes on the map.
* Connect building transition nodes for multi-floor routes.

### Phase 3: Supabase Backend & Auth
* Set up Supabase schema (POI, Paths, Users, Heatmaps, Video Metadata).
* Set up pgvector for semantic search database capabilities.
* Implement Admin / Helper Authentication.
* Build the Admin Dashboard interface for GeoJSON uploads and user management.

### Phase 4: Multimedia & Exports (Videos & PDFs)
* Implement Video Gallery and attach video guides to map direction cards.
* Add Service Worker offline video and image downloader.
* Set up static PDF links and build the `jsPDF` custom route exporter.

### Phase 5: Crowdsourcing & Dynamic Heatmaps
* Implement real-time user reporting widget.
* Configure database aggregation for dynamic heatmaps.
* Integrate Leaflet heatmap rendering layer.
* Final PWA testing, audit, and offline validation.
