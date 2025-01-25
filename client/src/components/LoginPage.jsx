"use client";

import React, { useState } from "react";
import UserNameInput from "./UserNameInput";
import PasswordInput from "./PasswordInput";
import useLoginUser from "@/hooks/authenticationHooks/useLogin";

const LoginPage = ({ setActiveTab }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, success, isLoading, LoginError } = useLoginUser();

  const handleLogin = (e) => {
    e.preventDefault();
    // console.log(isLoading, "is success");
    loginUser({
      data: {
        username,
        password,
      },
    });
    console.log(success, "success");
  };

  return (
    <div>
      <div className=" mb-6">
        <h2 className="text-xl font-semibold  text-gray-700">Login Now</h2>
        <p className=" text-gray-500 text-sm ">
          Login to use this application{" "}
        </p>
      </div>
      <form onSubmit={handleLogin}>
        <label className="block mb-2 text-gray-700">Username</label>
        <input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border text-gray-900 rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
        />
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
