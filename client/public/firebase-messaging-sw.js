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

  if (!self.registration) {
    console.error("Service worker registration not found!");
    return;
  }

  const { title, body } = payload.notification || {
    title: "Default Title",
    body: "Default Body",
  };

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    requireInteraction: true,
    actions: [{ action: "open_app", title: "Open App" }],
  });
});
