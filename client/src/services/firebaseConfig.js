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
const messagingPromise = isSupported()
  .then((supported) => {
    if (supported) {
      console.log("Firebase Messaging is supported.");
      return getMessaging(app);
    } else {
      console.warn("Firebase Messaging is not supported in this browser.");
      return null;
    }
  })
  .catch((err) => {
    console.error("Error checking Firebase Messaging support:", err);
    return null;
  });

export { app, messagingPromise };
