// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

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
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const { title, body } = payload?.notification || {
    title: "Default Title",
    body: "Default Body",
  };

  const notificationOptions = {
    body,
    icon: "/logo.png",
    requireInteraction: true,
    actions: [{ action: "open_app", title: "Open App" }],
    data: { url: "https://chating-room.vercel.app/" }, // Set your actual domain
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
