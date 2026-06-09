export function initMap(containerId, geojson, pois) {
  const map = L.map(containerId, {
    zoomControl: false 
  }).setView([9.952, 8.892], 16);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Render network paths
  L.geoJSON(geojson, {
    style: (feature) => {
      return {
        color: feature.properties.is_indoor ? '#9333ea' : '#475569',
        weight: 3,
        opacity: 0.6,
        dashArray: feature.properties.is_indoor ? '5, 5' : ''
      };
    }
  }).addTo(map);

  // Render POIs
  const markers = {};
  L.geoJSON(pois, {
    pointToLayer: (feature, latlng) => {
      const marker = L.marker(latlng).bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.type}`);
      markers[feature.properties.name.toLowerCase()] = marker;
      return marker;
    }
  }).addTo(map);

  let currentRouteLayer = null;

  return {
    instance: map,
    flyTo: (coords, zoom) => map.flyTo(coords, zoom),
    getMarker: (name) => markers[name.toLowerCase()],
    drawRoute: (route) => {
      if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
      }
      
      if (!route) return;

      // Draw the path
      // Coordinates are [lat, lng], Leaflet expects [lat, lng] for polylines
      currentRouteLayer = L.polyline(route.coordinates, {
        color: '#10b981',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Fit map to route
      map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
    }
  };
}
