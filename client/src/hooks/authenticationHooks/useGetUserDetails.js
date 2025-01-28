"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "../ApiRequiests/userApi";

const useGetUserDetails = () => {
  // Use the createdBy value in the query
  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userDetails"], // Unique key for caching
    queryFn: () => getUserDetails(), // Fetch function
  });

  return { userDetails, isLoading, isError, error };
};

export default useGetUserDetails;
