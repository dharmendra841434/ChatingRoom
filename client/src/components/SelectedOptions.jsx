import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { IoMdClose } from "react-icons/io";
import UserSearch from "./UserSearch";
import { useSocket } from "@/services/SocketProvider";
import useJoinGroup from "@/hooks/groupHooks/useJoinGroup";
import useCreateGroup from "@/hooks/groupHooks/useCreateGroup";

const SelectedOptions = ({ show, handleClose }) => {
  const socket = useSocket();
  const [groupName, setGroupName] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const { createGroup, createGroupLoading, createGroupSuccess } =
    useCreateGroup();
  const { joinGroup, joinGroupLoading, joinGroupSuccess } = useJoinGroup();

  const handleCreateGroup = (e) => {
    e.preventDefault();
    // console.log("Create Group", groupName);
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      createGroup({ groupName, userId: decoded.id });
      handleClose();
      setGroupName("");
    }
  };

  const handleJoinGroup = (e) => {
    e.preventDefault();
    joinGroup({ groupKey: groupKey });
    handleClose();
    setGroupKey("");
  };

  return (
    <div>
      {show === "create-group" && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Create Group
          </h2>
          <button
            onClick={handleClose}
            className=" absolute top-2 right-2 cursor-pointer"
          >
            <IoMdClose className=" text-3xl transition-all duration-300 ease-in-out hover:scale-105" />
          </button>
          <form onSubmit={handleCreateGroup}>
            <label className="block mb-2 text-gray-700">Group Name</label>
            <input
              type="text"
              placeholder="Enter group name"
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
            />

            <button
              type="submit"
              className="w-full mt-6 bg-foreground text-white py-2 rounded-md hover:bg-purple-900"
            >
              Create Now
            </button>
          </form>
        </div>
      )}
      {show === "join-group" && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Join an Existing Group
          </h2>
          <button
            onClick={handleClose}
            className=" absolute top-2 right-2 cursor-pointer"
          >
            <IoMdClose className=" text-3xl transition-all duration-300 ease-in-out hover:scale-105" />
          </button>
          <form onSubmit={handleJoinGroup}>
            <label className="block mb-2 text-gray-700">Group Code</label>
            <input
              type="text"
              placeholder="Enter group code"
              onChange={(e) => setGroupKey(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-1 focus:ring-foreground outline-none mb-4"
            />

            <button
              type="submit"
              className="w-full mt-6 bg-foreground text-white py-2 rounded-md hover:bg-purple-900"
            >
              Join Now
            </button>
          </form>
        </div>
      )}
      {show === "find-people" && (
        <div>
          <button
            onClick={handleClose}
            className=" absolute top-2 right-2 cursor-pointer"
          >
            <IoMdClose className=" text-3xl transition-all duration-300 ease-in-out hover:scale-105" />
          </button>
          <UserSearch />
        </div>
      )}
    </div>
  );
};

export default SelectedOptions;
