import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroupRequest } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useDeleteGroup = ({ setActiveConversation, setThreedot }) => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    mutate: deleteGroup,
    isPending: deleteGroupLoading,
    isSuccess: deleteGroupSuccess,
  } = useMutation({
    mutationFn: (groupKey) => deleteGroupRequest(groupKey),
    onSuccess: () => {
      showToast("success", "✅ Group deleted successfully!");
      queryClient.invalidateQueries(["groupsList"]);
      // Reset active conversation and menu state
      setActiveConversation({ type: "", data: null });
      setThreedot(false);
    },
    onError: (error) => {
      showToast("error", `❌ Delete failed: ${error?.response?.data?.message}`);

      // Ensure UI resets even if deletion fails
      setActiveConversation({ type: "", data: null });
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
