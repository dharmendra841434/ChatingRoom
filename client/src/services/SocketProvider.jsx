"use client";

import React, { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

let socket; // Singleton socket instance

const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};

export const SocketProvider = ({ children }) => {
  const socketConnection = useMemo(() => {
    if (!socket) {
      socket = io("http://localhost:8000", {
        transports: ["websocket"], // Optional: Force WebSocket
      });
    }
    return socket;
  }, []);

  return (
    <SocketContext.Provider value={socketConnection}>
      {children}
    </SocketContext.Provider>
  );
};
