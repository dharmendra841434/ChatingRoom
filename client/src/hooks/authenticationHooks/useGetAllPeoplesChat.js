"use client";

import { useQuery } from "@tanstack/react-query";
import { getPeoplesChats, getUserDetails } from "../ApiRequiests/userApi";

const useGetAllPeoplesChat = () => {
  // Use the createdBy value in the query
  const {
    data: peoplesChatLists,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["peoplesChats"], // Unique key for caching
    queryFn: () => getPeoplesChats(), // Fetch function
  });

  return { peoplesChatLists, isLoading, isError, error };
};

export default useGetAllPeoplesChat;
