"use client";

import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { useSocket } from "@/services/SocketProvider";
import React, { useEffect } from "react";

const HighOrderComponent = ({ children }) => {
  const socket = useSocket();
  const invalidateQuery = useInvalidateQuery();
  useEffect(() => {
    const handleNotification = (data) => {
      console.log(data, "reciveNotification on HOC");
      invalidateQuery("userDetails");
      invalidateQuery("groupsList");
    };
    socket.on("receiveNotification", handleNotification);
    return () => {
      socket.off("receiveNotification");
    };
  }, [socket]);
  return <div>{children}</div>;
};

export default HighOrderComponent;
