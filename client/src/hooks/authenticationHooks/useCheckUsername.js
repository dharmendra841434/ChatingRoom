import { useMutation } from "@tanstack/react-query";
import { checkUsernameRequest } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useCheckUsername = () => {
  const {
    mutate: checkUsername,
    isPending: checkUsernameLoading,
    isSuccess: checkUsernameSuccess,
    data: checkUsernameData,
  } = useMutation({
    mutationFn: (payload) => checkUsernameRequest(payload),
    onSuccess: (data) => {
      if (data?.data?.isAvailable) {
        showToast("success", "✅ This username is available!");
      } else {
        showToast("error", "❌ Username not available!");
      }
    },
    onError: (error) => {
      showToast("error", `⚠️ Update failed: ${error.message}`);
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
