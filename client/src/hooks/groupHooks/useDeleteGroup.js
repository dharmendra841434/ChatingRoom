import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteGroupRequest } from "../ApiRequiests/userApi";

const useDeleteGroup = ({ setActiveConversation, setThreedot }) => {
  const queryClient = useQueryClient(); // Get the query client instance
  const {
    mutate: deleteGroup,
    isPending: deleteGroupLoading,
    isSuccess: deleteGroupSuccess,
  } = useMutation({
    mutationFn: (groupKey) => deleteGroupRequest(groupKey), // Call the function to delete a group
    onSuccess: () => {
      toast.success("Group deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        //theme: "colored",
      });
      queryClient.invalidateQueries(["groupsList"]);
      setActiveConversation({
        type: "",
        data: null,
      });
      setThreedot(false);
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setActiveConversation({
        type: "",
        data: null,
      });
      setThreedot(false);
    },
  });

  return {
    deleteGroup,
    deleteGroupLoading,
    deleteGroupSuccess,
  };
};

export default useDeleteGroup;
