-- Enable the pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- POIs (Points of Interest) Table
CREATE TABLE public.pois (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    floor_level INTEGER DEFAULT 0,
    photo_day_url TEXT,
    photo_night_url TEXT,
    embedding VECTOR(384), -- For semantic search (e.g., using a small model like all-MiniLM-L6-v2)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Paths Table (For Routing Edges)
CREATE TABLE public.paths (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    start_node TEXT NOT NULL, -- e.g., 'lat,lng'
    end_node TEXT NOT NULL,   -- e.g., 'lat,lng'
    distance DOUBLE PRECISION NOT NULL,
    is_indoor BOOLEAN DEFAULT FALSE,
    floor_level INTEGER,
    allowed_modes TEXT[] NOT NULL DEFAULT '{"pedestrian", "bicycle", "vehicle", "indoor"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table (Admin vs Helper)
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'helper')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Heatmaps Table (Crowdsourced data)
CREATE TABLE public.heatmaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('wifi', 'power', 'crowd', 'parking')),
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    intensity INTEGER NOT NULL CHECK (intensity BETWEEN 1 AND 10),
    reported_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Guides Metadata Table
CREATE TABLE public.video_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    start_poi_id UUID REFERENCES public.pois(id) ON DELETE CASCADE,
    end_poi_id UUID REFERENCES public.pois(id) ON DELETE CASCADE,
    video_storage_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_metadata ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Read-all for guests, Write for Admins/Helpers)
CREATE POLICY "Public read access for POIs" ON public.pois FOR SELECT USING (true);
CREATE POLICY "Public read access for paths" ON public.paths FOR SELECT USING (true);
CREATE POLICY "Public read access for approved videos" ON public.video_metadata FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read access for heatmaps" ON public.heatmaps FOR SELECT USING (true);

-- Allow authenticated users to insert heatmaps
CREATE POLICY "Auth users can insert heatmaps" ON public.heatmaps FOR INSERT WITH CHECK (auth.uid() = reported_by);
