"use client";

import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { messagingPromise } from "@/services/firebaseConfig";
import { getFCM } from "@/services/helper";
import showToast from "@/services/ShowToast";
import { useSocket } from "@/services/SocketProvider";
import { onMessage } from "firebase/messaging";
import React, { useEffect } from "react";

const HighOrderComponent = ({ children }) => {
  const invalidateQuery = useInvalidateQuery();
  const socket = useSocket();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration("/firebase-messaging-sw.js")
        .then((registration) => {
          if (!registration) {
            navigator.serviceWorker
              .register("/firebase-messaging-sw.js")
              .then((reg) => console.log("Service Worker registered:", reg))
              .catch((err) =>
                console.error("Service Worker registration failed:", err)
              );
          } else {
            console.log("Service Worker already registered:", registration);
          }
        });
    }
  }, []);

  useEffect(() => {
    let unsubscribe;

    async function setupMessaging() {
      const messaging = await getFCM();

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message test received:", payload);

        // Extract title & body from notification
        const title = payload?.notification?.title || "New Notification";
        const body = payload?.notification?.body || "You have a new message";
        console.log(title, body, "jguffygf");

        // Show toast notification
        showToast("info", `${title}: ${body}`);
      });
    }

    setupMessaging();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    socket.on("receiveNotification", () => {
      invalidateQuery("groupsList");
    });
  }, [socket]);

  return <div>{children}</div>;
};

export default HighOrderComponent;
