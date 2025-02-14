"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllGroups } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useGetUserGroupsList = () => {
  const {
    data: groupsList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["groupsList"],
    queryFn: () => getAllGroups(),
    onError: (error) => {
      showToast(
        "error",
        `❌ Failed to fetch groups: ${error?.response?.data?.message}`
      );
    },
  });

  return { groupsList, isLoading, isError, error };
};

export default useGetUserGroupsList;
