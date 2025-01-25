import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { registerRequest } from "../ApiRequiests/userApi";

const useUserRegister = ({ handleSucces }) => {
  //const queryClient = useQueryClient(); // Get the query client instance
  const {
    mutate: userRegister,
    isPending: userRegisterLoading,
    isSuccess: userRegisterSuccess,
  } = useMutation({
    mutationFn: (payload) => registerRequest(payload), // Call the function to create a new group
    onSuccess: () => {
      handleSucces();
      toast.success("User Register successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      //queryClient.invalidateQueries(["groupsList"]);
    },
    onError: (error) => {
      toast.error(`Registration failed: ${error.message}`, {
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
    userRegister,
    userRegisterLoading,
    userRegisterSuccess,
  };
};

export default useUserRegister;
