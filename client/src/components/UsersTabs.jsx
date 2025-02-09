import {
  acceptFriendRequest,
  cancelRecivedFriendRequest,
} from "@/hooks/ApiRequiests/userApi";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import IphoneLoader from "./loaders/IphoneLoader";
import useGetAllPeoplesChat from "@/hooks/authenticationHooks/useGetAllPeoplesChat";
import { useSocket } from "@/services/SocketProvider";

const UsersTabs = ({ userDetails, handleSelectChat, handleChangetabs }) => {
  const [activeTab, setActiveTab] = useState("connected");
  const [loading, setLoading] = useState(false);
  // console.log(userDetails, "details");
  const queryClient = useQueryClient();
  const [acceptLoader, setAcceptLoader] = useState(false);
  const [cancelLoader, setCancelLoader] = useState(false);
  const { peoplesChatLists } = useGetAllPeoplesChat();

  const handAcceptRequest = async (userId) => {
    setAcceptLoader(true);
    await acceptFriendRequest({ targetUserId: userId })
      .then((result) => {
        console.log(result);
        queryClient.invalidateQueries(["userDetails"]);

        setActiveTab("connected");
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setAcceptLoader(false));
  };

  const handCancelRequest = async (userId) => {
    setCancelLoader(true);
    await cancelRecivedFriendRequest({ targetUserId: userId })
      .then((result) => {
        console.log(result);
        queryClient.invalidateQueries(["userDetails"]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setCancelLoader(false));
  };

  //console.log(peoplesChatLists, "peoplesChatLists");

  return (
    <div className=" h-[80%]">
      {/* <h3 className=" font-bold text-gray-900">All Peoples</h3> */}
      <div className=" flex flex-row items-center relative ">
        <button
          onClick={() => {
            setActiveTab("connected");
            handleChangetabs();
          }}
          className={`absolute  w-1/2 flex items-center z-30 justify-center transition-all duration-300 ease-in-out p-3 left-0 cursor-pointer ${
            activeTab == "connected" ? "text-white" : "text-gray-400"
          }`}
        >
          Connected Peoples
        </button>
        <button
          onClick={() => {
            setActiveTab("pending");
            handleChangetabs();
          }}
          className={`absolute  w-1/2 flex items-center justify-center transition-all duration-300 ease-in-out z-30 p-3 right-0 cursor-pointer ${
            activeTab == "pending" ? "text-white" : "text-gray-400"
          }`}
        >
          Pending Requests
        </button>
        <div
          className={`bg-foreground w-1/2 p-6 transition-all duration-300 ease-in-out ${
            activeTab == "connected" ? "translate-x-0" : "translate-x-[100%]"
          }`}
        />
      </div>
      {activeTab === "connected" ? (
        <div className=" h-full">
          <h2 className=" m-3 font-semibold text-gray-900">
            All Connected Users
          </h2>
          {userDetails?.allFriends?.length === 0 ? (
            <div className=" w-full h-full  flex flex-col items-center justify-center">
              <p>You have no Any People added yet ?</p>
            </div>
          ) : (
            <div className=" h-full w-full px-3 ">
              {userDetails?.allFriends?.map((friend, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    handleSelectChat(friend);
                  }}
                  className=" flex flex-row  space-x-2 py-2 bg-white rounded-lg drop-shadow-sm p-2 cursor-pointer my-2"
                >
                  <img
                    src={friend?.profile_pic}
                    className=" h-12 w-12 rounded-full"
                  />
                  <div>
                    <h1 className=" font-medium text-gray-900 ">
                      {friend?.full_name}
                    </h1>
                    <p className=" text-xs text-gray-600">
                      {(() => {
                        const chat = peoplesChatLists?.find((item) =>
                          item?.chatKey?.split("_").includes(friend?._id)
                        );
                        const lastMessage =
                          chat?.messages?.[chat.messages.length - 1];

                        if (!lastMessage) {
                          return "No message";
                        }

                        if (
                          lastMessage.message === "" &&
                          lastMessage.mediaFile
                        ) {
                          return `${lastMessage.username}: Photo`;
                        }

                        return `${lastMessage.username}: ${lastMessage.message}`;
                      })()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className=" px-3 h-full">
          <h1 className=" m-3 font-semibold text-gray-900">
            All Pending requests
          </h1>
          {userDetails?.recivedRequestsUsers?.length === 0 ? (
            <div className=" h-full w-full flex justify-center items-center">
              <p> No Pending Requests</p>
            </div>
          ) : (
            <div className=" px-3">
              {userDetails?.recivedRequestsUsers?.map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-4 space-x-4 drop-shadow-sm w-full max-w-md bg-white rounded-lg border"
                >
                  {/* User Avatar */}
                  <img
                    src={user.profile_pic}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* User Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold capitalize">
                      {user.full_name}
                    </h2>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      className="bg-green-700 hover:bg-green-800 text-white px-5 py-1 rounded-md text-sm"
                      onClick={() => handAcceptRequest(user._id)}
                    >
                      {acceptLoader ? <IphoneLoader /> : <p>Accept</p>}
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-1 rounded-md text-sm"
                      onClick={() => handCancelRequest(user._id)}
                    >
                      {cancelLoader ? <IphoneLoader /> : <p>Reject</p>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UsersTabs;
