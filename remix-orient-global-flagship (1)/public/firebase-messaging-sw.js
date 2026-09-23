// Firebase Cloud Messaging Service Worker
// This enables background push notifications when the app tab is closed or minimized.
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCdJsVjIRBk7e5R5gHxmRlvGVWGXXd9rRA",
  authDomain: "gen-lang-client-0481978893.firebaseapp.com",
  projectId: "gen-lang-client-0481978893",
  storageBucket: "gen-lang-client-0481978893.appspot.com",
  messagingSenderId: "1043954745474",
  appId: "1:1043954745474:web:80fd3886b74edcf6d5f49b"
});

const messaging = firebase.messaging();

// Handle background push messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'Orient Global', {
    body: body || 'You have a new notification.',
    icon: icon || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  });
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
