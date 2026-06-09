/**
 * UJ3DMap IndexedDB Manager
 * Handles local offline storage for POIs, routing networks, video metadata, and saved routes.
 */

const DB_NAME = 'uj3dmap_local_db'
const DB_VERSION = 1

export function initDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error('IndexedDB failed to open:', event.target.error)
      reject(event.target.error)
    }

    request.onsuccess = (event) => {
      resolve(event.target.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Store POIs
      if (!db.objectStoreNames.contains('pois')) {
        db.createObjectStore('pois', { keyPath: 'id' })
      }

      // Store GeoJSON path segments
      if (!db.objectStoreNames.contains('paths')) {
        db.createObjectStore('paths', { keyPath: 'id', autoIncrement: true })
      }

      // Store Video Guides Metadata
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos', { keyPath: 'id' })
      }

      // Store Heatmap points
      if (!db.objectStoreNames.contains('heatmaps')) {
        db.createObjectStore('heatmaps', { keyPath: 'key' })
      }

      // Store Saved Routes
      if (!db.objectStoreNames.contains('saved_routes')) {
        db.createObjectStore('saved_routes', { keyPath: 'id' })
      }
    }
  })
}

// Save an item to a specific object store
export function saveItem(storeName, item) {
  return initDb().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(item)

      request.onsuccess = () => resolve(true)
      request.onerror = (e) => reject(e.target.error)
    })
  })
}

// Save bulk items
export function saveBulkItems(storeName, items) {
  return initDb().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      
      items.forEach(item => {
        store.put(item)
      })

      transaction.oncomplete = () => resolve(true)
      transaction.onerror = (e) => reject(e.target.error)
    })
  })
}

// Fetch all items from a store
export function getAllItems(storeName) {
  return initDb().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (e) => reject(e.target.error)
    })
  })
}

// Clear a store
export function clearStore(storeName) {
  return initDb().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve(true)
      request.onerror = (e) => reject(e.target.error)
    })
  })
}
