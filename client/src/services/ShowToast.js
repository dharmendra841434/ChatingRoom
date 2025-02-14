import { toast } from "react-toastify";

const showToast = (type, message) => {
  const options = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    //  theme: "colored",
    style: { fontSize: "14px", fontFamily: "sans-serif, Arial" }, // Custom font size
    icon: false,
    closeButton: false,
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "default":
    default:
      toast(message, options);
      break;
  }
};

export default showToast;
