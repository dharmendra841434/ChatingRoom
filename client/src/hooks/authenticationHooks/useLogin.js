import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginRequest } from "../ApiRequiests/userApi";

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
      toast.success("User logged in successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log(data, "data");
      localStorage.setItem("token", data?.data?.token);
      //cookies.set("accessToken", data?.data?.token);
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(`login failed: ${error.message}`, {
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
  //console.log(mutated, "mutate");

  return { loginUser, success, isLoading, LoginError };
};

export default useLoginUser;
