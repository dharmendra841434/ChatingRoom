"use client";

import React, { useState } from "react";
import UserNameInput from "./UserNameInput";
import PasswordInput from "./PasswordInput";
import useLoginUser from "@/hooks/useLogin";

const LoginPage = ({ setActiveTab }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, successData, loginLoading, loginIsError, loginError } =
    useLoginUser();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({
      data: {
        username,
        password,
      },
    });
  };

  console.log(successData, "is success");

  return (
    <div>
      <div className=" mb-6">
        <h2 className="text-xl font-semibold  text-gray-700">Login Now</h2>
        <p className=" text-gray-500 text-sm ">
          Login to use this application{" "}
        </p>
      </div>
      <form onSubmit={handleLogin}>
        <UserNameInput setInput={setUsername} />
        <PasswordInput setPassword={setPassword} password={password} />
        <button
          type="submit"
          className="w-full  bg-foreground text-white py-2 rounded-md hover:bg-purple-800"
        >
          Login
        </button>
        <div className=" text-sm flex justify-center items-center pt-5 w-full space-x-2 text-gray-400">
          <span>Don't have an account </span>{" "}
          <span
            onClick={() => setActiveTab("register")}
            className=" text-purple-900 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
