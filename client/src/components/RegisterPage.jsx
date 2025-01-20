import React from "react";
import UserNameInput from "./UserNameInput";
import PasswordInput from "./PasswordInput";

const RegisterPage = ({ setActiveTab }) => {
  const handleRegister = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className=" mb-6">
        <h2 className="text-xl font-semibold  text-gray-700">Register Now</h2>
        <p className=" text-gray-500 text-sm ">
          First register to use this application{" "}
        </p>
      </div>
      <form onSubmit={handleRegister}>
        <UserNameInput />
        <label className="block mb-2 text-gray-700">Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          //onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
        />
        <PasswordInput />
        <PasswordInput title="Confirm password" />
        <button
          type="submit"
          className="w-full  bg-foreground text-white py-2 rounded-md hover:bg-purple-800"
        >
          Register now
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
