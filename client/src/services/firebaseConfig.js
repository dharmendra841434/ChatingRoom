import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcz-nb0gkF0QrXpnU6dzZRJ-fk4d2diKE",
  authDomain: "pingpong-8a4de.firebaseapp.com",
  projectId: "pingpong-8a4de",
  storageBucket: "pingpong-8a4de.firebasestorage.app",
  messagingSenderId: "19261653214",
  appId: "1:19261653214:web:b04dfb9d131784b1c0c24f",
  measurementId: "G-7VYEXTJJNN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize messaging only if supported
let messaging;
isSupported()
  .then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
      console.log("Firebase Messaging initialized.");
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
    }
  })
  .catch((err) =>
    console.error("Error checking Firebase Messaging support:", err)
  );

export { app, messaging };
