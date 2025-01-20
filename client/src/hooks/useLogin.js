import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { loginRequest } from "./ApiRequiests/userApi";

const useLoginUser = () => {
  const navigate = useRouter();
  const {
    mutate: loginUser,
    data: successData,
    isLoading: loginLoading,
    isError: loginIsError,
    error: loginError,
  } = useMutation({
    mutationFn: ({ data }) => {
      loginRequest(data);
    },
    onSuccess: () => {
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

      navigate.replace("/dashboard");
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

  return { loginUser, successData, loginLoading, loginIsError, loginError };
};

export default useLoginUser;
