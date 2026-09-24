-- =============================================================
-- UNIJOS Campus Navigator — PostgreSQL + PostGIS Schema
-- Run once against your database to initialise tables.
-- Requires: CREATE EXTENSION IF NOT EXISTS postgis;
-- =============================================================

CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------------
-- Admin Users
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id          SERIAL PRIMARY KEY,
  username    VARCHAR(64)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Points of Interest (POIs)
-- Includes both Point POIs and Polygon buildings.
-- geometry column stores the feature's actual GIS geometry.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pois (
  id                   VARCHAR(128) PRIMARY KEY,
  name_en              VARCHAR(255) NOT NULL,
  name_ha              VARCHAR(255),
  name_yo              VARCHAR(255),
  name_ig              VARCHAR(255),
  category             VARCHAR(64)  NOT NULL CHECK (category IN ('academic','admin','amenity','hostel','sports','gate','other')),
  subcategory          VARCHAR(64),
  height               NUMERIC(6,2) DEFAULT 6,
  floors               INTEGER      DEFAULT 1,
  campus               VARCHAR(16)  NOT NULL CHECK (campus IN ('main','new')),
  accessible           BOOLEAN      NOT NULL DEFAULT FALSE,
  accessible_entrance  BOOLEAN      NOT NULL DEFAULT FALSE,
  accessible_bathroom  BOOLEAN      NOT NULL DEFAULT FALSE,
  description_en       TEXT,
  image_url            TEXT,
  open_hours           VARCHAR(64),
  tags                 TEXT[],
  geometry             GEOMETRY(Geometry, 4326),  -- WGS84; Point or Polygon
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Spatial index for fast map-tile queries
CREATE INDEX IF NOT EXISTS pois_geometry_idx ON pois USING GIST (geometry);
CREATE INDEX IF NOT EXISTS pois_campus_idx   ON pois (campus);

-- ---------------------------------------------------------------
-- Routing Edges (road / path network graph)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS routing_edges (
  id             VARCHAR(128) PRIMARY KEY,
  name           VARCHAR(255),
  campus         VARCHAR(16)  NOT NULL CHECK (campus IN ('main','new')),
  allowed_modes  TEXT[]       NOT NULL DEFAULT ARRAY['pedestrian'],
  accessible     BOOLEAN      NOT NULL DEFAULT FALSE,
  geometry       GEOMETRY(LineString, 4326) NOT NULL,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS routing_edges_geometry_idx ON routing_edges USING GIST (geometry);
CREATE INDEX IF NOT EXISTS routing_edges_campus_idx   ON routing_edges (campus);

-- ---------------------------------------------------------------
-- Analytics — Search Logs
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS search_logs (
  id         SERIAL PRIMARY KEY,
  query      TEXT        NOT NULL,
  campus     VARCHAR(16),
  result_id  VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Analytics — POI View Logs
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS view_logs (
  id         SERIAL PRIMARY KEY,
  poi_id     VARCHAR(128) REFERENCES pois(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Helper: auto-update updated_at on pois
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER pois_updated_at
  BEFORE UPDATE ON pois
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
