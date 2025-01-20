"use client";

import LoginPage from "@/components/LoginPage";
import RegisterPage from "@/components/RegisterPage";
import React, { useState } from "react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("register");
  // const [roomKey, setRoomKey] = useState("");
  // const [userName, setUserName] = useState("");
  // const router = useRouter();

  // const handleCreateRoom = (e) => {
  //   e.preventDefault();
  //   console.log("Create Room button clicked!");
  //   const newRoomKey = generateRandomString(15);
  //   router.push(
  //     `/chat-room/${newRoomKey}?owner=true&username=${userName.toLocaleLowerCase()}`
  //   );
  // };

  // //console.log(process.env.NEXT_PUBLIC_BASE_URL, "NEXT_PUBLIC_BASE_URL");

  // const handleJoinRoom = async (e) => {
  //   e.preventDefault();
  //   console.log("Join Room button clicked!");
  //   const isExist = await checkRoom(roomKey);
  //   if (isExist) {
  //     return router.push(`/chat-room/${roomKey}?username=${userName}`);
  //   } else {
  //     alert("Room does not exist. Please create a room first.");
  //   }
  // };

  return (
    <div className=" min-h-screen max-w-[80rem] mx-auto">
      <div className=" py-2">
        <img src="ChatingApp.webp" alt="logo" className=" w-44" />
      </div>
      <div className="  flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md">
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "register" ? (
              <RegisterPage setActiveTab={setActiveTab} />
            ) : (
              <LoginPage setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
