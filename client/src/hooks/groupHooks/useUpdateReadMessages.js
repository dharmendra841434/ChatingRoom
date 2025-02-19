import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllReadMsg } from "../ApiRequiests/userApi";

const useUpdateReadMessages = () => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    mutate: updateReadsMessage,
    isPending: isUpdateReadsMessagePending,
    isSuccess: isUpdateReadsMessageSuccess,
  } = useMutation({
    mutationFn: (payload) => markAllReadMsg(payload),
    onSuccess: () => {
      // showToast("success", "✅ Group deleted successfully!");
      queryClient.invalidateQueries(["groupsList"]);
    },
    onError: (error) => {},
  });

  return {
    updateReadsMessage,
    isUpdateReadsMessagePending,
    isUpdateReadsMessageSuccess,
  };
};

export default useUpdateReadMessages;
