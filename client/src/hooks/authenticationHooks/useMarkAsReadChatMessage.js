import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markasAllReadChatMsg } from "../ApiRequiests/userApi";

const useMarkAsReadChatMessage = () => {
  const queryClient = useQueryClient(); // Get the query client instance

  const {
    mutate: updateChatReadsMessage,
    isPending: isUpdateChatReadsMessagePending,
    isSuccess: isUpdateChatReadsMessageSuccess,
  } = useMutation({
    mutationFn: (payload) => markasAllReadChatMsg(payload),
    onSuccess: () => {
      // showToast("success", "✅ Group deleted successfully!");
      queryClient.invalidateQueries(["peoplesChats"]);
    },
    onError: (error) => {},
  });

  return {
    updateChatReadsMessage,
    isUpdateChatReadsMessagePending,
    isUpdateChatReadsMessageSuccess,
  };
};

export default useMarkAsReadChatMessage;
