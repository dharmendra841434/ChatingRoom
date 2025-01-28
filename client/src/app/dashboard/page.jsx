"use client";
import ChatImage from "@/components/ChatImage";
import CustomModal from "@/components/CustomModal";
import DashboardTab from "@/components/DashboardTab";
import SelectedOptions from "@/components/SelectedOptions";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import useCloudinaryUpload from "@/hooks/useCloudinary";
import useCloudinary from "@/hooks/useCloudinary";
import { timeAgo } from "@/services/helper";
import { useSocket } from "@/services/SocketProvider";
import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { MdOutlineLink } from "react-icons/md";

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showOptions, setShowOptions] = useState("create-group");
  const [activeConversation, setActiveConversation] = useState(null);
  const socket = useSocket();
  const { userDetails, isLoading, isError, error } = useGetUserDetails();
  const [selectedFile, setSelectedFile] = useState(null);
  const { url, loading, progress, uploadFile } = useCloudinaryUpload();
  const [isOpenMediaPopup, setIsOpenMediaPopup] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const data = {
        message: input,
        groupKey: activeConversation.groupKey,
        username: userDetails?.data?.username,
      };
      socket.emit("chatMessage", data);

      // setMessages((prev) => [...prev, { sender: userDetails.username, text: input }]);
      // setInput("");
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
        groupKey: activeConversation.groupKey,
        username: userDetails?.data?.username,
        mediaFile: {
          mediaType: "image",
          url: result,
        },
      };
      socket.emit("chatMessage", data);
    });
  };

  const handleSendFile = () => {
    if (selectedFile !== null) {
      const data = new FormData();
      data.append("file", selectedFile);

      console.log("====================================");
      console.log(data);
      console.log("====================================");
      socket.emit("sendFiles", {
        groupKey: activeConversation.groupKey,
        filedata: data,
        username: userDetails?.data?.username,
      });
    }
  };

  useEffect(() => {
    if (activeConversation !== null) {
      const data = {
        groupKey: activeConversation?.groupKey,
        username: "You",
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

    socket.on("reciveFiles", (data) => {
      console.log(data, "data");
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
      <div className=" w-3/4 ">
        {activeConversation ? (
          <div className="w-full flex flex-col h-full  ">
            {/* Chat Section */}
            <div className="w-full flex flex-col h-full">
              <div className=" flex flex-row justify-between items-center py-3 px-8 bg-purple-50 border-b border-b-gray-200">
                <div className=" flex items-center space-x-3 ">
                  <img
                    src="/groupIcon.webp"
                    alt="icon"
                    className=" h-10 w-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 capitalize ">
                      {activeConversation?.groupName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      <span className="">Invite By Group ID:</span>{" "}
                      {activeConversation.groupKey}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total Users:</span>{" "}
                      {activeConversation?.allUsers?.length}
                    </p>
                  </div>
                </div>
                <div>
                  <button>
                    <BsThreeDotsVertical className=" text-foreground text-lg" />
                  </button>
                </div>
              </div>
              {/* Messages */}
              <div className="flex-grow px-3 py-1  overflow-auto ">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center mt-4">
                    No messages yet
                  </p>
                ) : (
                  <div className="  flex flex-col justify-end w-full ">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex   ${
                          message?.username === userDetails?.data?.username
                            ? " flex-row-reverse "
                            : " flex-row "
                        }   mb-1 p-2 rounded-lg w-full`}
                      >
                        <img
                          src={
                            message?.username === userDetails?.data?.username
                              ? "/defaultDp.webp"
                              : "/user.png"
                          }
                          alt="User Avatar"
                          className="w-10 h-10 rounded-full cursor-pointer"
                          title={useGetUserDetails?.data?.username}
                        />
                        {message?.message !== "" ? (
                          <div
                            className={`flex flex-col mx-3  ${
                              message?.username === userDetails?.data?.username
                                ? "bg-purple-100 rounded-tr-none "
                                : " bg-gray-100 rounded-tl-none"
                            } w-1/3 pl-5 pr-10 py-3 rounded-xl `}
                          >
                            <p className="text-sm text-gray-700">
                              {message.message}
                            </p>
                            <span className=" text-gray-500 text-xs">
                              {timeAgo(message.timestamp)}
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`flex flex-col mx-3  ${
                              message?.username === userDetails?.data?.username
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
