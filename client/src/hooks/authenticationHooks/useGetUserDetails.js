"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useGetUserDetails = () => {
  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userDetails"], // Unique key for caching
    queryFn: () => getUserDetails(),
    onError: (err) => {
      showToast("error", `⚠️ Failed to fetch user details: ${err.message}`);
    },
  });

  return { userDetails, isLoading, isError, error };
};

export default useGetUserDetails;
