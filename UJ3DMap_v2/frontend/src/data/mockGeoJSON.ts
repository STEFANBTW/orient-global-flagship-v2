export interface POIProperties {
  id: string;
  name_en: string;
  name_ha: string;
  name_yo: string;
  name_ig: string;
  category: 'academic' | 'admin' | 'amenity' | 'hostel' | 'sports';
  subcategory?: string;
  height: number;
  floors: number;
  campus: 'main' | 'new';
  accessible: boolean;
  accessible_entrance: boolean;
  accessible_bathroom: boolean;
  description_en: string;
  image_url?: string;
  open_hours?: string;
  tags?: string[];
}

export interface POIFeature {
  type: 'Feature';
  properties: POIProperties;
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

export interface BuildingFeature {
  type: 'Feature';
  properties: POIProperties;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

export interface RoutingEdgeProperties {
  id: string;
  name: string;
  allowed_modes: ('pedestrian' | 'vehicle')[];
  campus: 'main' | 'new';
  accessible: boolean;
}

export interface RoutingEdgeFeature {
  type: 'Feature';
  properties: RoutingEdgeProperties;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
}

export const campusPOIs: POIFeature[] = [
  // Main Campus POIs
  {
    type: 'Feature',
    properties: {
      id: 'main-senate',
      name_en: 'Main Campus Administration',
      name_ha: 'Gidan Gudanarwa na Main Campus',
      name_yo: 'Ikọlu Alakoso Main Campus',
      name_ig: 'Ụlọ Nchịkwa Main Campus',
      category: 'admin',
      height: 15,
      floors: 3,
      campus: 'main',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: true,
      description_en: 'Houses the Principal Offices and Admin departments of Main Campus.'
    },
    geometry: {
      type: 'Point',
      coordinates: [8.8925, 9.9525]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'main-law',
      name_en: 'Faculty of Law',
      name_ha: 'Makarantar Shari\'a',
      name_yo: 'Ẹka Ofin',
      name_ig: 'Ngalaba Iwu',
      category: 'academic',
      height: 12,
      floors: 2,
      campus: 'main',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: false,
      description_en: 'The prestigious faculty of Law classrooms and moot court.'
    },
    geometry: {
      type: 'Point',
      coordinates: [8.8910, 9.9530]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'main-bank',
      name_en: 'Main Campus Microfinance Bank',
      name_ha: 'Bankin Microfinance',
      name_yo: 'Ile-ifowopamọ Microfinance',
      name_ig: 'Microfinance Bank',
      category: 'amenity',
      subcategory: 'bank',
      height: 6,
      floors: 1,
      campus: 'main',
      accessible: false,
      accessible_entrance: false,
      accessible_bathroom: false,
      description_en: 'Provides financial services and ATMs on campus.'
    },
    geometry: {
      type: 'Point',
      coordinates: [8.8935, 9.9515]
    }
  },

  // New Campus (Permanent Site) POIs
  {
    type: 'Feature',
    properties: {
      id: 'new-library',
      name_en: 'Main Library (Permanent Site)',
      name_ha: 'Babban Dakin Karatu',
      name_yo: 'Ile-ikawe Nla',
      name_ig: 'Nnukwu Ọ́bá Akwụkwọ',
      category: 'academic',
      subcategory: 'library',
      height: 18,
      floors: 4,
      campus: 'new',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: true,
      description_en: 'The multi-floor academic library with computing labs.'
    },
    geometry: {
      type: 'Point',
      coordinates: [8.9050, 9.9650]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'new-stadium',
      name_en: 'UniJos Sports Stadium',
      name_ha: 'Filin Wasa na Jami\'a',
      name_yo: 'Gbangan Ere-idaraya',
      name_ig: 'Ama Egwuregwu Jami\'a',
      category: 'sports',
      height: 10,
      floors: 1,
      campus: 'new',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: false,
      description_en: 'Multi-purpose sports arena for athletics and football games.'
    },
    geometry: {
      type: 'Point',
      coordinates: [8.9070, 9.9670]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'new-naraguta',
      name_en: 'Naraguta Hostel Block A',
      name_ha: 'Naraguta Masaukin Dalibai A',
      name_yo: 'Naraguta Ile Agbejoro A',
      name_ig: 'Ụlọ Naraguta A',
      category: 'hostel',
      height: 12,
      floors: 3,
      campus: 'new',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: true,
      description_en: 'Student residence halls near the academic area.'
    },
    geometry: {
      type: 'Point',
      coordinates: [8.9030, 9.9630]
    }
  }
];

export const campusBuildings: BuildingFeature[] = [
  // Main Campus Buildings
  {
    type: 'Feature',
    properties: {
      id: 'main-senate',
      name_en: 'Main Campus Administration Building',
      name_ha: 'Gidan Gudanarwa na Main Campus',
      name_yo: 'Ikọlu Alakoso Main Campus',
      name_ig: 'Ụlọ Nchịkwa Main Campus',
      category: 'admin',
      height: 15,
      floors: 3,
      campus: 'main',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: true,
      description_en: 'Houses the Principal Offices and Admin departments of Main Campus.'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [8.8920, 9.9520],
        [8.8930, 9.9520],
        [8.8930, 9.9530],
        [8.8920, 9.9530],
        [8.8920, 9.9520]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'main-law',
      name_en: 'Faculty of Law Building',
      name_ha: 'Makarantar Shari\'a',
      name_yo: 'Ẹka Ofin',
      name_ig: 'Ngalaba Iwu',
      category: 'academic',
      height: 12,
      floors: 2,
      campus: 'main',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: false,
      description_en: 'The prestigious faculty of Law classrooms and moot court.'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [8.8905, 9.9525],
        [8.8915, 9.9525],
        [8.8915, 9.9535],
        [8.8905, 9.9535],
        [8.8905, 9.9525]
      ]]
    }
  },

  // New Campus Buildings
  {
    type: 'Feature',
    properties: {
      id: 'new-library',
      name_en: 'Main Library Building',
      name_ha: 'Babban Dakin Karatu',
      name_yo: 'Ile-ikawe Nla',
      name_ig: 'Nnukwu Ọ́bá Akwụkwọ',
      category: 'academic',
      height: 18,
      floors: 4,
      campus: 'new',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: true,
      description_en: 'The multi-floor academic library with computing labs.'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [8.9045, 9.9645],
        [8.9055, 9.9645],
        [8.9055, 9.9655],
        [8.9045, 9.9655],
        [8.9045, 9.9645]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'new-naraguta',
      name_en: 'Naraguta Hostel Block A',
      name_ha: 'Naraguta Masaukin Dalibai A',
      name_yo: 'Naraguta Ile Agbejoro A',
      name_ig: 'Ụlọ Naraguta A',
      category: 'hostel',
      height: 12,
      floors: 3,
      campus: 'new',
      accessible: true,
      accessible_entrance: true,
      accessible_bathroom: true,
      description_en: 'Student residence halls near the academic area.'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [8.9025, 9.9625],
        [8.9035, 9.9625],
        [8.9035, 9.9635],
        [8.9025, 9.9635],
        [8.9025, 9.9625]
      ]]
    }
  }
];

export const campusPaths: RoutingEdgeFeature[] = [
  // Main Campus Paths
  {
    type: 'Feature',
    properties: {
      id: 'main-road-1',
      name: 'Main Campus Drive',
      allowed_modes: ['pedestrian', 'vehicle'],
      campus: 'main',
      accessible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [8.8910, 9.9530],
        [8.8925, 9.9525],
        [8.8935, 9.9515]
      ]
    }
  },
  {
    type: 'Feature',
    properties: {
      id: 'main-walk-1',
      name: 'Senate Office Walkway',
      allowed_modes: ['pedestrian'],
      campus: 'main',
      accessible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [8.8925, 9.9525],
        [8.8925, 9.9540]
      ]
    }
  },

  // New Campus Paths
  {
    type: 'Feature',
    properties: {
      id: 'new-road-1',
      name: 'Naraguta Access Road',
      allowed_modes: ['pedestrian', 'vehicle'],
      campus: 'new',
      accessible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [8.9030, 9.9630],
        [8.9050, 9.9650],
        [8.9070, 9.9670]
      ]
    }
  }
];
