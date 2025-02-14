import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserDetails } from "../utility/api/userApi";
import { useNavigate } from "react-router-dom";
import showToast from "@/services/ShowToast";

const useUpdateUserDetails = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    mutate: updateUser,
    data: successData,
    isLoading: updateLoading,
    isError: updateIsError,
    error: updateError,
  } = useMutation({
    mutationFn: ({ userID, data }) =>
      updateUserDetails({
        user_id: userID,
        data: data,
      }),
    onSuccess: () => {
      showToast("success", "✅ User details updated successfully!");
      queryClient.invalidateQueries(["usersList"]);
      navigate(-1);
    },
    onError: (error) => {
      showToast("error", `❌ Update failed: ${error.message}`);
    },
  });

  return { updateUser, successData, updateLoading, updateIsError, updateError };
};

export default useUpdateUserDetails;
