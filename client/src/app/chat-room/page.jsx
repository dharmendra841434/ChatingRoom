"use client";

import { useSocket } from "@/services/SocketProvider";
import React, { useEffect, useState } from "react";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const socket = useSocket();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { sender: "You", text: input }]);
      setInput("");
      // socket.emit("sendMessage", {
      //   room: roomName,
      //   message: messages,
      //   sender: "demo user",
      // });
    }
  };

  return (
    <div className="flex h-screen">
      {/* User List */}
      <div className="w-1/4 bg-gray-100 border-r border-gray-300">
        <h2 className="text-lg font-semibold p-4 border-b border-gray-700">
          Users
        </h2>
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className="p-4 hover:bg-gray-200 cursor-pointer border-b border-gray-300"
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="w-3/4 flex flex-col">
        {/* Messages */}
        <div className="flex-grow p-4 bg-white overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No messages yet</p>
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
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ChatScreen;
