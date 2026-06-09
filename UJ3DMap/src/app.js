import { initMap } from './map.js';
import { initSidebar } from './sidebar.js';
import { initSearch } from './search.js';
import { buildGraph } from './utils/routing.js';
import { campusGeoJSON, campusPOIs } from './utils/mockGeoJSON.js';

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('UJ3DMap Initializing...');
  
  // Build routing graph
  const routingGraph = buildGraph(campusGeoJSON.features);
  
  // Initialize Modules
  const mapInstance = initMap('map', campusGeoJSON, campusPOIs);
  initSidebar();
  initSearch(mapInstance, routingGraph, campusPOIs);
  
  // Setup App State
  window.appState = {
    theme: 'light',
    travelMode: 'pedestrian',
    map: mapInstance,
    graph: routingGraph
  };
});
