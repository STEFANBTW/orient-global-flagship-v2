import { findNearestNode, findShortestPath } from './utils/routing.js';

export function initSearch(mapController, graph, pois) {
  const modeWalk = document.getElementById('mode-walk');
  const modeBike = document.getElementById('mode-bike');
  const modeDrive = document.getElementById('mode-drive');
  
  const searchInput = document.getElementById('search-input');

  const modes = [
    { btn: modeWalk, id: 'pedestrian' },
    { btn: modeBike, id: 'bicycle' },
    { btn: modeDrive, id: 'vehicle' }
  ];

  // Default coordinates (User location mock: Main Gate)
  const userLocation = [8.8890, 9.9480]; // [lng, lat]

  function calculateAndDrawRoute(destinationLngLat, destName) {
    const mode = window.appState.travelMode || 'pedestrian';
    
    // Find nearest nodes to user and destination
    const startNode = findNearestNode(graph, userLocation[1], userLocation[0]);
    const endNode = findNearestNode(graph, destinationLngLat[1], destinationLngLat[0]);
    
    if (startNode && endNode) {
      const route = findShortestPath(graph, startNode, endNode, mode);
      if (route) {
        console.log(`Route to ${destName}:`, route.steps);
        mapController.drawRoute(route);
        // We could render the route steps in the sidebar here
      } else {
        alert(`No route found to ${destName} using mode: ${mode}`);
        mapController.drawRoute(null);
      }
    }
  }

  function setActiveMode(button, modeStr) {
    modes.forEach(m => {
      m.btn.classList.remove('btn-primary');
      m.btn.classList.add('btn-secondary');
    });
    button.classList.remove('btn-secondary');
    button.classList.add('btn-primary');
    
    if (window.appState) {
      window.appState.travelMode = modeStr;
    }
    console.log(`Travel mode changed to: ${modeStr}`);
    
    // Recalculate route if there's a search term
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
      const destFeature = pois.features.find(f => f.properties.name.toLowerCase().includes(query));
      if (destFeature) {
        calculateAndDrawRoute(destFeature.geometry.coordinates, destFeature.properties.name);
      }
    }
  }

  modeWalk.addEventListener('click', () => setActiveMode(modeWalk, 'pedestrian'));
  modeBike.addEventListener('click', () => setActiveMode(modeBike, 'bicycle'));
  modeDrive.addEventListener('click', () => setActiveMode(modeDrive, 'vehicle'));

  // Default Mode UI
  setActiveMode(modeWalk, 'pedestrian');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      mapController.drawRoute(null);
      return;
    }

    const destFeature = pois.features.find(f => f.properties.name.toLowerCase().includes(query));
    if (destFeature) {
      const coords = destFeature.geometry.coordinates; // [lng, lat]
      const marker = mapController.getMarker(destFeature.properties.name);
      if (marker) marker.openPopup();
      
      calculateAndDrawRoute(coords, destFeature.properties.name);
    }
  });
}
