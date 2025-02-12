// components/Notification.tsx
"use client";
import { useEffect, useState } from "react";
import { messaging, onMessage, getToken } from "../services/firebaseConfig";

export default function Notification() {
  const [token, setToken] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // if (typeof window !== "undefined" && "Notification" in window) {
    //   if (typeof Notification.requestPermission === "function") {
    //     Notification. Notification.requestPermission().then((permission) => {
    //       if (permission === "granted") {

    //       }
    //     });
    //   } else {
    //     console.error(
    //       "Notification.requestPermission is not available in this browser."
    //     );
    //   }
    // } else {
    //   console.error("Notifications are not supported in this browser.");
    // }

    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setToken(currentToken);
        } else {
          console.log("No registration token available.");
        }
      })
      .catch((err) =>
        console.log("An error occurred while retrieving token:", err)
      );

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received.", payload);
      setNotification({
        title: payload.notification?.title || "No Title",
        body: payload.notification?.body || "No Body",
      });
    });

    return () => unsubscribe();
  }, []);
}
