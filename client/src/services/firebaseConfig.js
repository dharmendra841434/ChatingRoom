// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging/sw";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STRONG_BUCKET,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_FIREBASE_MESSANGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

//console.log(firebaseConfig, "ASDHAJS");

const app = initializeApp(firebaseConfig);
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(app);
    }
    console.log("Firebase not supported this browser");
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();

//console.log(messaging, "hfyffyfy");

export { messaging };
