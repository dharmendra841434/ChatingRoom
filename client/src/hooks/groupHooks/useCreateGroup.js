import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroupRequest } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useCreateGroup = () => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    mutate: createGroup,
    isPending: createGroupLoading,
    isSuccess: isCreateGroupSuccess,
  } = useMutation({
    mutationFn: (payload) => createGroupRequest(payload),
    onSuccess: () => {
      showToast("success", "✅ Group created successfully!");
      queryClient.invalidateQueries(["groupsList"]);
    },
    onError: (error) => {
      showToast(
        "error",
        `❌ Group creation failed: ${error?.response?.data?.message}`
      );
    },
  });

  return {
    createGroup,
    createGroupLoading,
    isCreateGroupSuccess,
  };
};

export default useCreateGroup;
