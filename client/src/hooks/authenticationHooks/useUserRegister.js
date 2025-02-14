import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useUserRegister = ({ handleSucces }) => {
  const {
    mutate: userRegister,
    isPending: userRegisterLoading,
    isSuccess: userRegisterSuccess,
  } = useMutation({
    mutationFn: (payload) => registerRequest(payload),
    onSuccess: () => {
      handleSucces();
      showToast("success", "✅ User registered successfully!");
    },
    onError: (error) => {
      showToast(
        "error",
        `❌ Registration failed:${error?.response?.data?.message}`
      );
    },
  });

  return {
    userRegister,
    userRegisterLoading,
    userRegisterSuccess,
  };
};

export default useUserRegister;
