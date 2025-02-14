"use client";

import { useQuery } from "@tanstack/react-query";
import { getPeoplesChats } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useGetAllPeoplesChat = () => {
  const {
    data: peoplesChatLists,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["peoplesChats"], // Unique key for caching
    queryFn: () => getPeoplesChats(),
    onError: (err) => {
      showToast("error", `⚠️ Failed to fetch chats: ${err.message}`);
    },
  });

  return { peoplesChatLists, isLoading, isError, error };
};

export default useGetAllPeoplesChat;
