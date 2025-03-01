"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import ThreeDotOptions from "@/components/ThreeDotOptions";
import { MdOutlineLink } from "react-icons/md";
import ProfileIcon from "@/components/ProfileIcon";
import { sendNotificationToUsers, timeAgo } from "@/services/helper";
import ChatImage from "@/components/ChatImage";
import showToast from "@/services/ShowToast";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import useDeleteGroup from "@/hooks/groupHooks/useDeleteGroup";
import { useSocket } from "@/services/SocketProvider";
import useCloudinaryUpload from "@/hooks/useCloudinary";
import { getUserProfile } from "@/hooks/ApiRequiests/userApi";
import useUpdateReadMessages from "@/hooks/groupHooks/useUpdateReadMessages";
import CustomModal from "@/components/CustomModal";
import UserProfileCard from "@/components/UserProfile";
import { IoMdClose } from "react-icons/io";
import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import useGetSingleGroup from "@/hooks/groupHooks/useGetSingleGroup";

const StartGroupChat = ({ params }) => {
  const paramsData = use(params);
  const [isOpenMediaPopup, setIsOpenMediaPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { userDetails } = useGetUserDetails();
  const chatContainerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [threedot, setThreedot] = useState(false);
  const { deleteGroup, deleteGroupSuccess } = useDeleteGroup({
    setActiveConversation: () => {
      console.log("setActiveConversation");
    },
    setThreedot: setThreedot,
  });
  const { progress, uploadFile } = useCloudinaryUpload();
  const { updateReadsMessage } = useUpdateReadMessages();
  const [viewUserProfile, setViewUserProfile] = useState(null);
  const { group } = useGetSingleGroup(paramsData.key);
  const invalidateQuery = useInvalidateQuery();

  const socket = useSocket();

  const handleFileSelect = async (event) => {
    setIsOpenMediaPopup(true);
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        setSelectedFile(file);
        // alert(`Selected file: ${file.name}`);
      } else {
        showToast(
          "warning",
          "File size exceeds 10MB. Please select a smaller file."
        );
        // alert("File size exceeds 10MB. Please select a smaller file.");
      }
    }
  };

  const handleViewProfile = async (username) => {
    const profile = await getUserProfile(username);
    setViewUserProfile(profile);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const data = {
        message: input,
        groupKey: group?.data?.groupKey,
        username: userDetails?.data?.user?.username,
        userId: userDetails?.data?.user?._id,
      };

      const newMessage = {
        username: userDetails?.data?.user?.username,
        message: input,
        mediaFile: null,
        timestamp: new Date().toISOString(), // Use current timestamp
        read: [userDetails?.data?.user?._id],
      };

      // console.log(activeConversation?.data?.usersDeviceToken, "this is active");

      // Add the new message object to the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("chatMessage", data);
      socket.emit("sendNotification", { message: "sending message" });
      setInput("");
      await sendNotificationToUsers(
        userDetails,
        input,
        group?.data?.usersDeviceToken
      );
    }
  };

  const handleSendMedia = async () => {
    setIsOpenMediaPopup(false);
    const newMessage = {
      username: userDetails?.data?.user?.username,
      message: "",
      mediaFile: {
        mediaType: "image",
        url: selectedFile,
      },
      read: [userDetails?.data?.user?._id],
      timestamp: new Date().toISOString(), // Use current timestamp
    };

    // Add the new message object to the state
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    await uploadFile(selectedFile).then(async (result) => {
      const data = {
        groupKey: group.data?.groupKey,
        username: userDetails?.data?.user?.username,
        mediaFile: {
          mediaType: "image",
          url: result,
        },
        userId: userDetails?.data?.user?._id,
      };
      //console.log(data, "result");
      socket.emit("chatMessage", data);
      socket.emit("sendNotification", { message: "sending file" });
      await sendNotificationToUsers(
        userDetails,
        "Sent Media File",
        group?.data?.usersDeviceToken
      );
    });
  };

  const handleDelete = async () => {
    deleteGroup(group?.data?.groupKey);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (group !== null) {
      const data = {
        groupKey: group?.data?.groupKey,
        username: userDetails?.data?.user?.username,
        userId: userDetails?.data?.user?._id,
      };
      socket.emit("joinGroup", data);
      socket.emit("sendNotification", { message: "sending message" });
    }
    const handleJoinedGroup = ({ message, messages }) => {
      console.log("user joined group", message);
      setMessages(messages);
      invalidateQuery("groupsList");
    };

    const handleReceiveGroupMessages = ({ messages, groupKey }) => {
      console.log(groupKey, " groupKey");
      if (groupKey === group?.data?.groupKey) {
        updateReadsMessage({
          groupId: group?.data?.groupKey,
          userId: userDetails?.data?.user?._id,
        });
        setMessages(messages);
        setInput("");
      }
    };

    socket.on("joinedGroup", handleJoinedGroup);
    socket.on("receiveMessages", handleReceiveGroupMessages);

    return () => {
      socket.off("joinedGroup", handleJoinedGroup);
      socket.off("receiveMessages", handleReceiveGroupMessages);
    };
  }, [socket, group]);

  return (
    <div className="w-full flex flex-col h-full">
      <CustomModal isOpen={isOpenMediaPopup} onClose={setIsOpenMediaPopup}>
        <div className=" flex flex-col items-center w-[35rem] h-[35rem] bg-white p-3">
          {selectedFile && (
            <div className=" flex flex-col items-center mb-4 p-2 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">
                Selected File: {selectedFile.name}
              </p>
              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Media"
                  className="mt-2 h-[25rem] w-[25rem] rounded-lg"
                />
              )}
            </div>
          )}
          <button
            onClick={handleSendMedia}
            className=" mt-5 bg-foreground rounded-lg px-5 py-2 text-white hover:bg-purple-900"
          >
            Send File
          </button>
          <button
            onClick={() => setIsOpenMediaPopup(false)}
            className=" absolute top-2 right-2 cursor-pointer"
          >
            <IoMdClose className=" text-3xl transition-all duration-300 ease-in-out hover:scale-105" />
          </button>
        </div>
      </CustomModal>
      <CustomModal
        isOpen={viewUserProfile !== null}
        onClose={() => {
          setViewUserProfile(null);
        }}
      >
        <UserProfileCard
          user={viewUserProfile}
          currentUser={userDetails?.data}
        />
      </CustomModal>
      <div className=" flex flex-row justify-between items-center py-3 px-8 bg-purple-50 border-b border-b-gray-200">
        <div className=" flex items-center space-x-3 ">
          <ProfileIcon
            fullName={group?.data?.groupName}
            color={group?.groupIconColor}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 capitalize ">
              {group?.data?.groupName}
            </h2>
            <p className="text-sm text-gray-600">
              <span className="">Invite By Group ID:</span>{" "}
              {group?.data?.groupKey}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Total Users:</span>{" "}
              {group?.data?.allUsers?.length}
            </p>
          </div>
        </div>
        <div>
          <button onClick={() => setThreedot(true)}>
            <BsThreeDotsVertical className=" text-foreground text-lg" />
          </button>
        </div>
        <ThreeDotOptions
          userId={userDetails?.data?.user?._id}
          groupOwnerId={group?.data?.owner}
          isOpen={threedot}
          setIsOpen={setThreedot}
          handleDelete={handleDelete}
        />
      </div>
      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-grow px-3 py-1  overflow-auto "
      >
        {messages?.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">No messages yet</p>
        ) : (
          <div className="  flex flex-col justify-end w-full ">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={`flex   ${
                  message?.username === userDetails?.data?.user?.username
                    ? " flex-row-reverse "
                    : " flex-row "
                }   mb-1 p-2 rounded-lg w-full`}
              >
                <button
                  onClick={() => {
                    handleViewProfile(message?.username);
                  }}
                >
                  {/* <img
                    src={
                      message?.username === userDetails?.data?.user?.username
                        ? "/defaultDp.webp"
                        : "/user.png"
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    title={userDetails?.data?.user?.username}
                  /> */}
                  <ProfileIcon
                    fullName={
                      message?.username === userDetails?.data?.user?.username
                        ? userDetails?.data?.user?.username
                        : message?.username
                    }
                  />
                </button>
                {message?.message !== "" ? (
                  <div
                    className={`flex flex-col mx-3  ${
                      message?.username === userDetails?.data?.user?.username
                        ? "bg-purple-100 rounded-tr-none "
                        : " bg-gray-100 rounded-tl-none"
                    } w-1/3 pl-5 pr-10 py-3 rounded-xl `}
                  >
                    <p className="text-sm text-gray-700">{message.message}</p>
                    <span className=" text-gray-500 text-xs">
                      {timeAgo(message.timestamp)}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`flex flex-col mx-3  ${
                      message?.username === userDetails?.data?.user?.username
                        ? "bg-purple-100 rounded-tr-none "
                        : " bg-gray-100 rounded-tl-none"
                    } w-1/3 pl-5 pr-10 py-3 rounded-xl `}
                  >
                    <ChatImage mediaFile={message?.mediaFile.url} />
                    <span className=" text-gray-500 text-xs">
                      {timeAgo(message.timestamp)}
                    </span>

                    {typeof message?.mediaFile.url !== "string" && (
                      <p>{progress}%</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className=" flex flex-row items-center p-2 space-x-3 border-t border-gray-300">
        <label className="flex items-center space-x-2 p-2 bg-foreground text-white rounded-lg shadow hover:bg-purple-900 cursor-pointer">
          <MdOutlineLink className="w-5 h-5" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,video/*" // Restricts to image and video files
          />
        </label>
        <form onSubmit={handleSendMessage} className="flex w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <button
            type="submit"
            className="px-2 py-2.5 bg-foreground text-white rounded-r-lg hover:bg-purple-900 border border-foreground"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartGroupChat;
