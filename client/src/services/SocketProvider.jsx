"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { createContext, useContext, useMemo } from "react";
import { ToastContainer } from "react-toastify";
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
      socket = io("https://chatingroom.onrender.com", {
        transports: ["websocket"], // Optional: Force WebSocket
      });
    }
    return socket;
  }, []);

  // Create a client
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={socketConnection}>
        {children}
        <ToastContainer />
      </SocketContext.Provider>
    </QueryClientProvider>
  );
};
