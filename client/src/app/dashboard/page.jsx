"use client";
import CustomModal from "@/components/CustomModal";
import DashboardTab from "@/components/DashboardTab";
import SelectedOptions from "@/components/SelectedOptions";
import StartGroupChat from "@/components/StartGroupChat";
import StartUserChat from "@/components/StartUserChat";
import UserProfileCard from "@/components/UserProfile";
import { getUserProfile } from "@/hooks/ApiRequiests/userApi";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import useDeleteGroup from "@/hooks/groupHooks/useDeleteGroup";
import useCloudinaryUpload from "@/hooks/useCloudinary";
import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { sendNotificationToUsers } from "@/services/helper";
import { useSocket } from "@/services/SocketProvider";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { MdGroups, MdKeyboardDoubleArrowRight } from "react-icons/md";

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [userChatMessages, setUserChatMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showOptions, setShowOptions] = useState("create-group");
  const [activeConversation, setActiveConversation] = useState({
    type: "",
    data: null,
  });
  const socket = useSocket();
  const { userDetails } = useGetUserDetails();
  const [selectedFile, setSelectedFile] = useState(null);
  const { progress, uploadFile } = useCloudinaryUpload();
  const [isOpenMediaPopup, setIsOpenMediaPopup] = useState(false);
  const chatContainerRef = useRef(null);
  const [viewUserProfile, setViewUserProfile] = useState(null);
  const [threedot, setThreedot] = useState(false);
  const { deleteGroup, deleteGroupSuccess } = useDeleteGroup({
    setActiveConversation: setActiveConversation,
    setThreedot: setThreedot,
  });

  const [isExpand, setIsExpand] = useState(true);
  const invalidateQuery = useInvalidateQuery();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const data = {
        message: input,
        groupKey: activeConversation.data?.groupKey,
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

      // Add the new message object to the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("chatMessage", data);
      socket.emit("sendNotification", { message: "sending message" });
      setInput("");
      await sendNotificationToUsers(
        userDetails,
        input,
        activeConversation.data?.usersDeviceToken
      );
    }
  };

  const handleSendUserMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const data = {
        message: input,
        chatKey: activeConversation.data?.chatKey,
        username: userDetails?.data?.user?.username,
      };

      const newMessage = {
        username: userDetails?.data?.user?.username,
        message: input,
        mediaFile: null,
        timestamp: new Date().toISOString(), // Use current timestamp
      };

      // Add the new message object to the state
      setUserChatMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("sendUserMessage", data);

      //console.log("query runnnn");
      setInput("");
    }
  };
  const handleOptions = (option) => {
    setIsOpenModal(true);
    setShowOptions(option);
  };

  const onClose = () => {
    setIsOpenModal(false);
    setShowOptions("create-group");
  };

  const handleFileSelect = async (event) => {
    setIsOpenMediaPopup(true);
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        // 10MB limit
        setSelectedFile(file);
        // alert(`Selected file: ${file.name}`);
      } else {
        alert("File size exceeds 10MB. Please select a smaller file.");
      }
    }
  };

  const handleUpload = async () => {
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
        groupKey: activeConversation.data?.groupKey,
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
        activeConversation.data?.usersDeviceToken
      );
    });
  };

  const handleUserChatUpload = async () => {
    setIsOpenMediaPopup(false);
    const newMessage = {
      username: userDetails?.data?.user?.username,
      message: "",
      mediaFile: {
        mediaType: "image",
        url: selectedFile,
      },
      timestamp: new Date().toISOString(), // Use current timestamp
    };

    // console.log(newMessage, "newjghg");

    // Add the new message object to the state
    setUserChatMessages((prevMessages) => [...prevMessages, newMessage]);
    await uploadFile(selectedFile).then((result) => {
      //console.log(result, "result");
      const data = {
        chatKey: activeConversation.data?.chatKey,
        username: userDetails?.data?.user?.username,
        mediaFile: {
          mediaType: "image",
          url: result,
        },
      };
      socket.emit("sendUserMessage", data);
    });
  };

  const handleViewProfile = async (username) => {
    const profile = await getUserProfile(username);
    setViewUserProfile(profile);
  };

  const handleDelete = async () => {
    deleteGroup(activeConversation?.data?.groupKey);
  };

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, userChatMessages]);

  const handleSelectChat = async (chat) => {
    // console.log(chat, "asjdguafdy");
    setActiveConversation({
      type: "user",
      data: chat,
    });
  };

  const handleExpand = () => {
    setIsExpand(!isExpand);
  };

  useEffect(() => {
    if (!activeConversation?.data || !userDetails?.data?.user?.username) return;

    if (activeConversation.type === "group") {
      //console
      // .log("data changes");
      const data = {
        groupKey: activeConversation.data.groupKey,
        username: userDetails.data.user.username,
        userId: userDetails.data.user._id,
      };
      socket.emit("joinGroup", data);
      socket.emit("sendNotification", { message: "sending message" });
    }

    if (activeConversation.type === "user") {
      const data = {
        chatKey: activeConversation.data.chatKey,
        username: userDetails.data.user.username,
      };
      socket.emit("joinChat", data);
    }

    const handleReciveUserMessages = ({ messages }) => {
      setUserChatMessages(messages);
      invalidateQuery("peoplesChats");
      setInput("");
    };
    const handleReciveGroupMessages = ({ messages }) => {
      //console.log(messages, "recived group messages");
      setMessages(messages);
      invalidateQuery("groupsList");
      setInput("");
    };

    socket.on("joinedGroup", ({ message, messages }) => {
      setMessages(messages);
      invalidateQuery("groupsList");
    });
    socket.on("joinedChat", ({ message, messages }) => {
      console.log(message);
      setUserChatMessages(messages);
    });

    socket.on("receiveMessages", handleReciveGroupMessages);
    socket.on("receiveUserMessages", handleReciveUserMessages);

    return () => {
      // Clean up all event listeners
      socket.off("joinedGroup");
      socket.off("receiveMessages");
      socket.off("receiveUserMessages");

      socket.off("joinedChat");
    };
  }, [socket, activeConversation, userDetails]);

  return (
    <div className="flex h-screen max-w-[96rem] mx-auto ">
      {isExpand ? (
        <DashboardTab
          handleSelectOption={handleOptions}
          handleStartConversation={setActiveConversation}
          userDetails={userDetails?.data}
          handleSelectChat={handleSelectChat}
          handleChangeUserstabs={() =>
            setActiveConversation({
              type: "",
              data: null,
            })
          }
          handleExpand={handleExpand}
        />
      ) : (
        <div className=" w-[6%] bg-gray-200 h-full relative">
          <button
            onClick={handleExpand}
            className=" absolute -right-3 bg-purple-800 top-8 cursor-pointer"
          >
            <MdKeyboardDoubleArrowRight className=" text-3xl text-white" />
          </button>
          <div className=" h-full w-full flex flex-col items-center pt-5 ">
            <Image
              src="/logo.png"
              className=" h-16 w-16 mr-5 "
              width={180}
              height={180}
              alt="logo"
            />
            <div
              onClick={handleExpand}
              className=" bg-white rounded-lg p-2 mt-12 cursor-pointer"
            >
              <MdGroups className=" text-5xl" />
            </div>
            <div
              onClick={handleExpand}
              className=" bg-white rounded-lg p-2 mt-12 cursor-pointer"
            >
              <div className={`border border-gray-800 rounded-full p-1`}>
                <div className={`border border-gray-800 rounded-full p-1`}>
                  <HiOutlineUserGroup className=" text-3xl" />
                </div>
              </div>
            </div>
            <div
              onClick={handleExpand}
              className=" bg-white rounded-lg p-2 mt-12 absolute bottom-5 cursor-pointer "
            >
              <img
                src={userDetails?.data?.user?.profile_pic}
                alt="dp"
                className=" h-12 w-12 rounded-full "
              />
            </div>
          </div>
        </div>
      )}
      <CustomModal isOpen={isOpenModal} onClose={setIsOpenModal}>
        <div className=" p-6">
          <SelectedOptions show={showOptions} handleClose={onClose} />
        </div>
      </CustomModal>
      <CustomModal isOpen={isOpenMediaPopup} onClose={setIsOpenMediaPopup}>
        <div className=" flex flex-col items-center p-6 bg-white">
          {selectedFile && (
            <div className=" flex flex-col items-center mb-4 p-2 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-700">
                Selected File: {selectedFile.name}
              </p>
              {selectedFile.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Selected Media"
                  className="mt-2 w-36 h-36 rounded-lg"
                />
              )}
            </div>
          )}
          <button
            onClick={() => {
              if (activeConversation?.type === "group") {
                handleUpload();
              } else {
                handleUserChatUpload();
              }
            }}
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
      <div className={`${isExpand ? "w-3/4" : " w-[94%]"}`}>
        {activeConversation?.data ? (
          <div className="w-full flex flex-col h-full  ">
            {/* Chat Section */}
            {activeConversation?.type === "group" ? (
              <StartGroupChat
                chatContainerRef={chatContainerRef}
                chatData={activeConversation?.data}
                handleFileSelect={handleFileSelect}
                handleSendMessage={handleSendMessage}
                handleViewProfile={handleViewProfile}
                messages={messages}
                setInput={setInput}
                userDetails={userDetails}
                handleDelete={handleDelete}
                setThreedot={setThreedot}
                threedot={threedot}
                input={input}
                progress={progress}
              />
            ) : (
              <StartUserChat
                chatContainerRef={chatContainerRef}
                chatData={activeConversation?.data}
                handleFileSelect={handleFileSelect}
                handleSendMessage={handleSendUserMessage}
                handleViewProfile={handleViewProfile}
                messages={userChatMessages}
                setInput={setInput}
                userDetails={userDetails}
                handleDelete={handleDelete}
                setThreedot={setThreedot}
                threedot={threedot}
                input={input}
                progress={progress}
              />
            )}
          </div>
        ) : (
          <div className=" h-full flex flex-col items-center justify-center bg-white">
            <img src="logo.png" alt="" className=" h-36 w-36" />
            <h4 className=" text-3xl font-bold text-foreground my-4">
              Start Convertation
            </h4>
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardPage;
