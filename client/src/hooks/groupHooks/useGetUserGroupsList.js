import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { getAllGroups } from "../ApiRequiests/userApi";

const useGetUserGroupsList = () => {
  // Retrieve and decode the token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded._id;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  // Use the createdBy value in the query
  const {
    data: groupsList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["groupsList", { userId }], // Unique key for caching
    queryFn: () =>
      getAllGroups({
        userId,
      }), // Fetch function
    enabled: !!userId, // Prevent query execution if createdBy is null or undefined
  });

  return { groupsList, isLoading, isError, error };
};

export default useGetUserGroupsList;
