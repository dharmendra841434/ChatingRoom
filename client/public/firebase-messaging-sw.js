// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBcz-nb0gkF0QrXpnU6dzZRJ-fk4d2diKE",
  authDomain: "pingpong-8a4de.firebaseapp.com",
  projectId: "pingpong-8a4de",
  storageBucket: "pingpong-8a4de.firebasestorage.app",
  messagingSenderId: "19261653214",
  appId: "1:19261653214:web:b04dfb9d131784b1c0c24f",
  measurementId: "G-7VYEXTJJNN",
});

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  // console.log("Received background message:", payload);

  // Check if Firebase automatically handles the notification
  if (payload?.notification) return; // Don't manually show it if FCM does

  const { title, body } = payload.data || {
    title: "Default Title",
    body: "Default Body",
  };

  const notificationOptions = {
    body,
    icon: "/logo.png",
    requireInteraction: true,
    actions: [{ action: "open_app", title: "Open App" }],
    data: { url: "https://chating-room.vercel.app" },
  };

  self.registration.showNotification(title, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

// Ensure the latest service worker is active
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    clients.claim().then(() => {
      return self.registration.pushManager
        .getSubscription()
        .then((subscription) => {
          if (!subscription) {
            //console.log("No active subscription found.");
          }
        });
    })
  );
});
