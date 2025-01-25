import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { checkUsernameRequest } from "../ApiRequiests/userApi";

const useCheckUsername = () => {
  //const queryClient = useQueryClient(); // Get the query client instance
  const {
    mutate: checkUsername,
    isPending: checkUsernameLoading,
    isSuccess: checkUsernameSuccess,
    data: checkUsernameData,
  } = useMutation({
    mutationFn: (payload) => checkUsernameRequest(payload), // Call the function to create a new group
    onSuccess: (data) => {
      if (data?.data?.isAvailable) {
        toast.success("This username available", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(`Username not available`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      //queryClient.invalidateQueries(["groupsList"]);
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

  return {
    checkUsername,
    checkUsernameLoading,
    checkUsernameSuccess,
    checkUsernameData,
  };
};

export default useCheckUsername;
