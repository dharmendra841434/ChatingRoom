import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinGroupRequest } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useJoinGroup = ({ handleClose }) => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    mutate: joinGroup,
    isPending: joinGroupLoading,
    isSuccess: joinGroupSuccess,
  } = useMutation({
    mutationFn: (payload) => joinGroupRequest(payload),
    onSuccess: () => {
      showToast("success", "🎉 User joined successfully!");
      queryClient.invalidateQueries(["groupsList"]);
      handleClose();
    },
    onError: (error) => {
      showToast("error", `❌ Join failed: ${error?.response?.data?.message}`);
    },
  });

  return {
    joinGroup,
    joinGroupLoading,
    joinGroupSuccess,
  };
};

export default useJoinGroup;
