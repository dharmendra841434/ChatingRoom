import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateUserDetails } from "../utility/api/userApi";
import { useNavigate } from "react-router-dom";

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
      toast.success("User details updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      queryClient.invalidateQueries(["usersList"]);
      navigate(-1);
    },
    onError: (error) => {
      toast.error(`Update failed: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    },
  });

  return { updateUser, successData, updateLoading, updateIsError, updateError };
};

export default useUpdateUserDetails;
