import React, { useState } from "react";
import UserNameInput from "./UserNameInput";
import PasswordInput from "./PasswordInput";
import useUserRegister from "@/hooks/authenticationHooks/useUserRegister";

const RegisterPage = ({ setActiveTab }) => {
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState("");
  const [fullnameError, setFullnameError] = useState(false);
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [passError, setPassError] = useState(false);
  const [resPassError, setResPassError] = useState(false);
  const [isMatched, setIsMatched] = useState(true);

  const handleRegister = (e) => {
    e.preventDefault();
    if (fullname === "") {
      setFullnameError(true);
      return;
    }
    if (password === "") {
      setPassError(true);
      return;
    }
    if (rePassword === "") {
      setResPassError(true);
      return;
    }
    if (password !== rePassword) {
      setIsMatched(false);
      return;
    }
    setIsMatched(true);
    userRegister({
      username: username,
      full_name: fullname,
      password: password,
      profile_pic:
        "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
      isActive: true,
    });
  };

  const handleReset = () => {
    setUsername("");
    setFullname("");
    setPassword("");
    setRePassword("");
    setActiveTab("login");
  };

  const { userRegister, userRegisterLoading, userRegisterSuccess } =
    useUserRegister({ handleSucces: handleReset });
  return (
    <div>
      <div className=" mb-6">
        <h2 className="text-xl font-semibold  text-gray-700">Register Now</h2>
        <p className=" text-gray-500 text-sm ">
          First register to use this application{" "}
        </p>
      </div>
      <form onSubmit={handleRegister}>
        <UserNameInput setInput={setUsername} />
        {username === "" && (
          <p className="text-red-500 text-[13px] -mt-3 mb-2">
            someone already has that username. Try another?
          </p>
        )}
        <label className="block mb-2 text-gray-700">Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setFullname(e.target.value)}
          onFocus={() => {
            setFullnameError(false);
          }}
          className="w-full px-4 py-2 border text-gray-900 rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
        />
        {fullnameError && (
          <p className="text-red-500 text-[13px] -mt-3 mb-2">
            fullname is required
          </p>
        )}
        <PasswordInput
          onFocus={() => {
            setPassError(false);
          }}
          setPassword={setPassword}
          password={password}
        />
        {passError && (
          <p className="text-red-500 text-[13px] -mt-3 mb-2">
            password is required
          </p>
        )}
        <PasswordInput
          title="Confirm password"
          onFocus={() => {
            setPassError(false);
          }}
          setPassword={setRePassword}
          password={rePassword}
        />
        {resPassError && (
          <p className="text-red-500 text-[13px] -mt-3 mb-2">
            rePassword is required
          </p>
        )}
        {!isMatched && (
          <p className="text-red-500 text-[13px] -mt-3 mb-2">
            password does not match
          </p>
        )}
        <button
          type="submit"
          disabled={userRegisterLoading}
          className="w-full  bg-foreground text-white py-2 rounded-md hover:bg-purple-800"
        >
          {userRegisterLoading ? "Registering..." : "Register"}
        </button>
        <div className=" text-sm flex justify-center items-center pt-5 w-full space-x-2 text-gray-400">
          <span>Already have an account </span>{" "}
          <span
            onClick={() => setActiveTab("login")}
            className=" text-purple-900 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
