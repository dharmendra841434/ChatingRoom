import { useState } from "react";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { checkUsernameRequest } from "@/hooks/ApiRequiests/userApi";
import { useMutation } from "@tanstack/react-query";

function UserNameInput({ setInput }) {
  const [userName, setUserName] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const { mutate: checkUsername } = useMutation({
    mutationFn: (payload) => checkUsernameRequest(payload), // Call the function to create a new group
    onSuccess: (data) => {
      if (data?.data?.isAvailable) {
        setIsAvailable(true);
        // alert("Username available");
        setIsChecking(false);
        setInput(userName);
      } else {
        setIsAvailable(false);
        //alert("Username not available");
        setIsChecking(false);
        setInput("");
      }
    },
    onError: (error) => {
      console.log(error, "error");
    },
  });

  const checkUserNameAvailability = async (name) => {
    setIsChecking(true);
    setTimeout(() => {
      // console.log(name, "name");
      checkUsername({ username: name });
    }, 2000);
  };

  const handleChange = (e) => {
    const name = e.target.value;
    setUserName(name);
    if (name?.length > 2) {
      checkUserNameAvailability(name);
    } else {
      setIsChecking(false);
      setIsAvailable(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-gray-700">Username</label>
      <div className="relative">
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={handleChange}
          className="w-full px-4 py-2 text-gray-900 border rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
        />
        <div className="absolute right-3 top-2.5">
          {isChecking ? (
            <svg
              className="w-5 h-5 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v3m0 9v3m5.364-11.364l-2.121 2.121m-6.486 6.486-2.121 2.121M19.5 12h-3m-9 0H4.5m11.364 5.364-2.121-2.121m-6.486-6.486L5.364 7.636"
              />
            </svg>
          ) : (
            <>
              {isAvailable !== null && (
                <>
                  {isAvailable ? (
                    <IoCheckmarkDoneCircleSharp className=" text-green-600 text-xl" />
                  ) : (
                    <IoMdCloseCircle className=" text-red-600 text-xl" />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserNameInput;
