"use client";

import { useQuery } from "@tanstack/react-query";
import { getSingleGroup } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useGetSingleGroup = (groupKey) => {
  const {
    data: group,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["singleGroup", groupKey], // Unique query key for each group
    queryFn: () => getSingleGroup(groupKey),
    enabled: !!groupKey, // Prevents query execution if groupKey is empty
    onError: (error) => {
      showToast(
        "error",
        `❌ Failed to fetch group: ${error?.response?.data?.message}`
      );
    },
  });

  return { group, isLoading, isError, error };
};

export default useGetSingleGroup;
