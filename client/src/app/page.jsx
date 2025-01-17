"use client";

import checkRoom from "@/services/CheckRoom";
import { generateRandomString } from "@/services/helper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [roomKey, setRoomKey] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    console.log("Create Room button clicked!");
    const newRoomKey = generateRandomString(15);
    router.push(
      `/chat-room/${newRoomKey}?owner=true&username=${userName.toLocaleLowerCase()}`
    );
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    console.log("Join Room button clicked!");
    const isExist = await checkRoom(roomKey);
    if (isExist) {
      return router.push(`/chat-room/${roomKey}?username=${userName}`);
    } else {
      alert("Room does not exist. Please create a room first.");
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        {/* Tab Navigation */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("create")}
            className={`w-1/2 py-2 text-center ${
              activeTab === "create"
                ? "bg-orange-500 text-white font-bold"
                : "bg-gray-200 text-gray-600"
            } rounded-tl-lg`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`w-1/2 py-2 text-center ${
              activeTab === "join"
                ? "bg-orange-500 text-white font-bold"
                : "bg-gray-200 text-gray-600"
            } rounded-tr-lg`}
          >
            Join Room
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "create" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Create a New Room
              </h2>
              <form onSubmit={handleCreateRoom}>
                <label className="block mb-2 text-gray-700">Your Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-orange-500 outline-none mb-4"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                >
                  Create Room
                </button>
              </form>
            </div>
          )}

          {activeTab === "join" && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Join an Existing Room
              </h2>
              <form onSubmit={handleJoinRoom}>
                <label className="block mb-2 text-gray-700">Room Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-orange-500 outline-none mb-4"
                />
                <label className="block mb-2 text-gray-700">Room Code</label>
                <input
                  type="text"
                  placeholder="Enter room code"
                  onChange={(e) => setRoomKey(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-orange-500 outline-none mb-4"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
                >
                  Join Room
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
