"use client";
import CustomModal from "@/components/CustomModal";
import DashboardTab from "@/components/DashboardTab";
import SelectedOptions from "@/components/SelectedOptions";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showOptions, setShowOptions] = useState("create-group");
  const [activeConversation, setActiveConversation] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { sender: "You", text: input }]);
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

  // useEffect(() => {
  //   // Handle system messages
  //   socket.on("user:joined", (data) => {
  //     console.log(`User ${data.username} has joined the room ${data.roomKey}!`);
  //     console.log(data?.allUsers, "they are in the room");
  //     // const uniqueUsers = data?.allUsers.filter(
  //     //   (value, index, self) =>
  //     //     index ===
  //     //     self.findIndex(
  //     //       (t) => t.socketId === value.socketId // Ensure uniqueness based on socketId
  //     //     )
  //     // );

  //     // setUsers(uniqueUsers);
  //   });

  //   // socket.on("reciveMessages", (data) => {
  //   //   console.log(data, "recived messages");
  //   //   setMessages(data.messages);
  //   // });

  //   return () => {
  //     socket.off("user:joined");
  //   };
  // }, [socket]);

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
              <div className="flex-grow p-4 bg-white overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center mt-4">
                    No messages yet
                  </p>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 mb-2 rounded-lg ${
                        message.sender === "You"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100"
                      }`}
                    >
                      <strong>{message.sender}</strong>: {message.text}
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-2 border-t border-gray-300">
                <form onSubmit={handleSendMessage} className="flex">
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
