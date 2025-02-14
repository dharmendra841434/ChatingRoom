import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { loginRequest } from "../ApiRequiests/userApi";
import showToast from "@/services/ShowToast";

const useLoginUser = () => {
  const router = useRouter();

  const {
    mutate: loginUser,
    data: success,
    isPending: isLoading,
    error: LoginError,
  } = useMutation({
    mutationFn: ({ data }) => loginRequest(data),
    onSuccess: (data) => {
      showToast("success", "✅ User logged in successfully!");

      localStorage.setItem("token", data?.data?.token);
      Cookies.set("accessToken", data?.data?.token, { expires: 7 });

      router.push("/dashboard");
    },
    onError: (error) => {
      console.log(error, "sdkwei");
      showToast("error", `❌ Login failed: ${error?.response?.data?.message}`);
    },
  });

  return { loginUser, success, isLoading, LoginError };
};

export default useLoginUser;
