"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllGroups } from "../ApiRequiests/userApi";

const useGetUserGroupsList = () => {
  // Use the createdBy value in the query
  const {
    data: groupsList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["groupsList"], // Unique key for caching
    queryFn: () => getAllGroups(), // Fetch function
  });

  return { groupsList, isLoading, isError, error };
};

export default useGetUserGroupsList;
