import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { IoMdClose } from "react-icons/io";
import UserSearch from "./UserSearch";
import { useSocket } from "@/services/SocketProvider";
import useJoinGroup from "@/hooks/groupHooks/useJoinGroup";
import useCreateGroup from "@/hooks/groupHooks/useCreateGroup";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import {
  acceptFriendRequest,
  cancelRecivedFriendRequest,
} from "@/hooks/ApiRequiests/userApi";
import { useQueryClient } from "@tanstack/react-query";

const SelectedOptions = ({ show, handleClose }) => {
  const socket = useSocket();
  const [groupName, setGroupName] = useState("");
  const [groupKey, setGroupKey] = useState("");
  const { createGroup, createGroupLoading, createGroupSuccess } =
    useCreateGroup();
  const { joinGroup, joinGroupLoading, joinGroupSuccess } = useJoinGroup();
  const { userDetails, isLoading, isError, error } = useGetUserDetails();
  const queryClient = useQueryClient();

  const handleCreateGroup = (e) => {
    // e.preventDefault();
    createGroup({ groupName });
    handleClose();
    setGroupName("");
  };

  const handleJoinGroup = (e) => {
    // e.preventDefault();
    joinGroup({ groupKey: groupKey });
    handleClose();
    setGroupKey("");
  };

  const handAcceptRequest = async (userId) => {
    await acceptFriendRequest({ targetUserId: userId })
      .then((result) => {
        console.log(result);
        queryClient.invalidateQueries(["userDetails"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handCancelRequest = async (userId) => {
    await cancelRecivedFriendRequest({ targetUserId: userId })
      .then((result) => {
        console.log(result);
        queryClient.invalidateQueries(["userDetails"]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(userDetails, "asdjgsa");

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
      {show === "revieved-requist" && (
        <div>
          <button
            onClick={handleClose}
            className=" absolute top-2 right-2 cursor-pointer"
          >
            <IoMdClose className=" text-3xl transition-all duration-300 ease-in-out hover:scale-105" />
          </button>
          <div className=" w-[25rem] h-[30rem] overflow-y-scroll">
            {userDetails?.data?.recivedRequestsUsers?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p> You have no any request yet</p>
              </div>
            ) : (
              <>
                {" "}
                {userDetails?.data?.recivedRequestsUsers?.map((user) => (
                  <div className=" w-full bg-white border my-3 border-gray-200 rounded-lg shadow-md p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={user.profile_pic}
                        alt={`${user.username}'s profile`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="text-xl font-semibold">
                          {user.full_name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handAcceptRequest(user?._id)}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handCancelRequest(user?._id)}
                        className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedOptions;
