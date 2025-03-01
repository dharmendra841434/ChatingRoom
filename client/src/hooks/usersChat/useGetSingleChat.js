"use client";

import { useQuery } from "@tanstack/react-query";
import showToast from "@/services/ShowToast";
import { getSingleChat } from "../ApiRequiests/userApi";

const useGetSingleChat = (chatKey) => {
  const {
    data: chatData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["singleChat", chatKey], // Unique query key for each group
    queryFn: () => getSingleChat(chatKey),
    enabled: !!chatKey, // Prevents query execution if groupKey is empty
    onError: (error) => {
      showToast(
        "error",
        `❌ Failed to fetch group: ${error?.response?.data?.message}`
      );
    },
  });

  return { chatData, isLoading, isError, error };
};

export default useGetSingleChat;
