import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { joinGroupRequest } from "../ApiRequiests/userApi";

const useJoinGroup = () => {
  const queryClient = useQueryClient(); // Get the query client instance
  const {
    mutate: joinGroup,
    isPending: joinGroupLoading,
    isSuccess: joinGroupSuccess,
  } = useMutation({
    mutationFn: (payload) => joinGroupRequest(payload), // Call the function to create a new group
    onSuccess: () => {
      toast.success("User joined successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      queryClient.invalidateQueries(["groupsList"]);
    },
    onError: (error) => {
      toast.error(`Joined failed: ${error.message}`, {
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
    joinGroup,
    joinGroupLoading,
    joinGroupSuccess,
  };
};

export default useJoinGroup;
