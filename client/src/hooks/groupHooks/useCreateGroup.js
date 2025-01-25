import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createGroupRequest } from "../ApiRequiests/userApi";

const useCreateGroup = () => {
  const queryClient = useQueryClient(); // Get the query client instance
  const {
    mutate: createGroup,
    isPending: createGroupLoading,
    isSuccess: createGroupSuccess,
  } = useMutation({
    mutationFn: (payload) => createGroupRequest(payload), // Call the function to create a new group
    onSuccess: () => {
      toast.success("Group created successfully!", {
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
      toast.error(`Group failed: ${error.message}`, {
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
    createGroup,
    createGroupLoading,
    createGroupSuccess,
  };
};

export default useCreateGroup;
