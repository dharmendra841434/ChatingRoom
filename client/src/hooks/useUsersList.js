import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import { fetchUserList } from "../utility/api/userApi";

const useUsersList = ({ page, size, isParams = true }) => {
  // Retrieve and decode the token
  const token = localStorage.getItem("token");
  let createdBy = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // createdBy = decoded.createdBy;

      //console.log("Decoded token:", decoded);
      // console.log("createdBy:", createdBy);

      createdBy = "6ae3a816-ddc1-4ee4-9862-4ce448eded03";
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  // Use the createdBy value in the query
  const {
    data: usersList,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["usersList", { createdBy, page, size }], // Unique key for caching
    queryFn: () =>
      fetchUserList({
        createdBy,
        page,
        size,
        isParam: isParams,
      }), // Fetch function
    enabled: !!createdBy, // Prevent query execution if createdBy is null or undefined
  });

  return { usersList, isLoading, isError, error };
};

export default useUsersList;
