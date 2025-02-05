"use client";
import ChatImage from "@/components/ChatImage";
import CustomModal from "@/components/CustomModal";
import DashboardTab from "@/components/DashboardTab";
import SelectedOptions from "@/components/SelectedOptions";
import StartGroupChat from "@/components/StartGroupChat";
import ThreeDotOptions from "@/components/ThreeDotOptions";
import UserProfileCard from "@/components/UserProfile";
import { getUserProfile } from "@/hooks/ApiRequiests/userApi";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import useDeleteGroup from "@/hooks/groupHooks/useDeleteGroup";
import useCloudinaryUpload from "@/hooks/useCloudinary";
import useInvalidateQuery from "@/hooks/useInvalidateQuery";
import { timeAgo } from "@/services/helper";
import { useSocket } from "@/services/SocketProvider";
import React, { useEffect, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdOutlineLink } from "react-icons/md";

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
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
  const invalidateQuery = useInvalidateQuery();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const data = {
        message: input,
        groupKey: activeConversation.data?.groupKey,
        username: userDetails?.data?.username,
      };

      const newMessage = {
        username: userDetails?.data?.username,
        message: input,
        mediaFile: null,
        timestamp: new Date().toISOString(), // Use current timestamp
      };

      // Add the new message object to the state
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      socket.emit("chatMessage", data);
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

  const handleFileSelect = (event) => {
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
      username: userDetails?.data?.username,
      message: "",
      mediaFile: {
        mediaType: "image",
        url: selectedFile,
      },
      timestamp: new Date().toISOString(), // Use current timestamp
    };

    // Add the new message object to the state
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    await uploadFile(selectedFile).then((result) => {
      //console.log(result, "result");
      const data = {
        groupKey: activeConversation.data?.groupKey,
        username: userDetails?.data?.username,
        mediaFile: {
          mediaType: "image",
          url: result,
        },
      };
      socket.emit("chatMessage", data);
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
  }, [messages]);

  useEffect(() => {
    if (activeConversation?.data !== null) {
      const data = {
        groupKey: activeConversation?.data?.groupKey,
        username: userDetails?.data?.user?.username,
      };
      socket.emit("joinGroup", data);
    }

    socket.on("joinedGroup", ({ message, messages }) => {
      console.log(message);
      setMessages(messages);
    });

    socket.on("reciveMessages", ({ messages }) => {
      console.log(messages, "messages");
      setMessages(messages);
      setInput("");
    });

    socket.on("reciveNotification", (data) => {
      console.log(data, "reciveNotification");
      invalidateQuery("userDetails");
    });

    return () => {
      socket.off("joinGroup");
    };
  }, [socket, activeConversation]);

  //console.log(userDetails, "userDetails");

  return (
    <div className="flex h-screen max-w-[96rem] mx-auto ">
      <DashboardTab
        handleSelectOption={handleOptions}
        handleStartConversation={setActiveConversation}
        userDetails={userDetails?.data}
      />
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
            onClick={handleUpload}
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
        <UserProfileCard user={viewUserProfile} />
      </CustomModal>
      <div className=" w-3/4 ">
        {activeConversation?.data ? (
          <div className="w-full flex flex-col h-full  ">
            {/* Chat Section */}
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
            />
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
