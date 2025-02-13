"use client";

import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { messaging } from "@/services/firebaseConfig";
import { useSocket } from "@/services/SocketProvider";
import { getToken, onMessage } from "firebase/messaging";
import React, { useEffect } from "react";

const HighOrderComponent = ({ children }) => {
  const invalidateQuery = useInvalidateQuery();
  const socket = useSocket();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) =>
          console.log("Service Worker registered:", registration)
        )
        .catch((error) =>
          console.error("Service Worker registration failed:", error)
        );
    }
  }, []);

  useEffect(() => {
    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log("FCM Token:", currentToken);
          //setToken(currentToken);
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

  useEffect(() => {
    socket.on("receiveNotification", () => {
      invalidateQuery("groupsList");
    });
  }, [socket]);

  return <div>{children}</div>;
};

export default HighOrderComponent;
