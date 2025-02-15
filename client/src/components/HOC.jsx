"use client";

import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { messaging } from "@/services/firebaseConfig";
import { useSocket } from "@/services/SocketProvider";
import { onMessage } from "firebase/messaging";
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
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message BY HOC received:", payload);
      // Extract title & body from notification
      const title = payload?.notification?.title || "New Notification";
      const body = payload?.notification?.body || "You have a new message";
      // Show toast notification
      showToast("info", `${title}: ${body}`);
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
