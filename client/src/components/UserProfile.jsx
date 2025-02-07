import {
  cancelSendFriendRequest,
  sendFriendRequest,
} from "@/hooks/ApiRequiests/userApi";
import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { timeAgo } from "@/services/helper";
import { useSocket } from "@/services/SocketProvider";
import React, { useState } from "react";
import IphoneLoader from "./loaders/IphoneLoader";

const UserProfileCard = ({ user, currentUser }) => {
  const [Loader, setLoader] = useState(false);
  const socket = useSocket();
  const invalidateQuery = useInvalidateQuery();
  const handleToggleRequest = async () => {
    setLoader(true);
    if (
      currentUser?.sendedRequestsUsers?.some((item) => item?._id === user?._id)
    ) {
      await cancelSendFriendRequest({ targetUserId: user?._id })
        .then(() => invalidateQuery("userDetails"))
        .catch(console.error)
        .finally(() => setLoader(false));
    } else {
      await sendFriendRequest({ targetUserId: user?._id })
        .then(() => invalidateQuery("userDetails"))
        .catch(console.error)
        .finally(() => setLoader(false));
    }
    socket.emit("sendNotification", {
      message: `Friend request sent by ${currentUser?.user?.username}`,
    });
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="w-96 rounded-2xl shadow-lg bg-white p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.profile_pic}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 shadow-md"
          />
          <h2 className="text-xl font-bold text-gray-800">{user.full_name}</h2>
          <p className="text-gray-600">@{user.username}</p>
          <p
            className={`mt-2 text-sm font-medium px-3 py-1 rounded-full ${
              user.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>
              Joined : {timeAgo(new Date(user.createdAt).toLocaleDateString())}
            </p>
            <p>
              Last Updated :{" "}
              {timeAgo(new Date(user.updatedAt).toLocaleDateString())}
            </p>
          </div>
          {currentUser?.allFriends?.some((item) => item?._id === user?._id) ? (
            <button className="mt-6 bg-foreground hover:bg-purple-800 text-white w-full py-2 rounded-lg">
              Start Conversation
            </button>
          ) : (
            <>
              {currentUser?.user?.username !== user.username && (
                <button
                  onClick={handleToggleRequest}
                  className=" flex items-center justify-center mt-6 bg-foreground hover:bg-purple-800 text-white w-full py-2 rounded-lg"
                >
                  {Loader ? (
                    <IphoneLoader />
                  ) : (
                    <p>
                      {currentUser?.sendedRequestsUsers?.some(
                        (item) => item?._id === user?._id
                      )
                        ? "Cancel Request"
                        : "Send Request"}
                    </p>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
