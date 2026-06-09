// Mock GeoJSON for UJ3DMap testing

export const campusGeoJSON = {
  type: "FeatureCollection",
  features: [
    // Main Entrance Road (Vehicle & Walk)
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [8.8890, 9.9480], // Entrance
          [8.8910, 9.9500],
          [8.8920, 9.9520]  // Roundabout
        ]
      },
      properties: {
        name: "Main Campus Road",
        allowed_modes: ["pedestrian", "bicycle", "vehicle"],
        is_indoor: false
      }
    },
    // Walkway to ICT Building (Pedestrian Only)
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [8.8920, 9.9520], // Roundabout
          [8.8935, 9.9525],
          [8.8940, 9.9530]  // ICT Entrance
        ]
      },
      properties: {
        name: "ICT Walkway",
        allowed_modes: ["pedestrian", "bicycle"],
        is_indoor: false
      }
    },
    // Indoor ICT Corridors
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [8.8940, 9.9530], // ICT Entrance (Ground Floor)
          [8.8942, 9.9532], // Main Hall
          [8.8945, 9.9535]  // Lab 1
        ]
      },
      properties: {
        name: "ICT Ground Floor Corridor",
        allowed_modes: ["indoor", "pedestrian"],
        is_indoor: true,
        floor_level: 0,
        building_id: "bld-ict"
      }
    },
    // Road to Hostel (Vehicle & Walk)
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [8.8920, 9.9520], // Roundabout
          [8.8900, 9.9540],
          [8.8880, 9.9550]  // Hostel Block A
        ]
      },
      properties: {
        name: "Hostel Drive",
        allowed_modes: ["pedestrian", "bicycle", "vehicle"],
        is_indoor: false
      }
    }
  ]
};

// Points of Interest (POIs)
export const campusPOIs = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [8.8890, 9.9480] },
      properties: { name: "Main Gate", type: "entrance" }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [8.8940, 9.9530] },
      properties: { name: "ICT Building", type: "faculty" }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [8.8880, 9.9550] },
      properties: { name: "Hostel Block A", type: "hostel" }
    }
  ]
};
