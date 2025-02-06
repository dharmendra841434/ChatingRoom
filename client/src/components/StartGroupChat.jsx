import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import ThreeDotOptions from "./ThreeDotOptions";
import { MdOutlineLink } from "react-icons/md";
import ProfileIcon from "./ProfileIcon";
import { timeAgo } from "@/services/helper";
import ChatImage from "./ChatImage";

const StartGroupChat = ({
  chatData,
  handleFileSelect,
  userDetails,
  chatContainerRef,
  messages,
  handleViewProfile,
  setInput,
  handleSendMessage,
  handleDelete,
  setThreedot,
  threedot,
  input,
}) => {
  return (
    <div className="w-full flex flex-col h-full">
      <div className=" flex flex-row justify-between items-center py-3 px-8 bg-purple-50 border-b border-b-gray-200">
        <div className=" flex items-center space-x-3 ">
          {/* <img
            src="/groupIcon.webp"
            alt="icon"
            className=" h-10 w-10 rounded-full"
          /> */}
          <ProfileIcon
            fullName={chatData?.groupName}
            color={chatData?.groupIconColor}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-800 capitalize ">
              {chatData?.groupName}
            </h2>
            <p className="text-sm text-gray-600">
              <span className="">Invite By Group ID:</span> {chatData?.groupKey}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Total Users:</span>{" "}
              {chatData?.allUsers?.length}
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
          groupOwnerId={chatData?.owner}
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
                  message?.username === userDetails?.data?.username
                    ? " flex-row-reverse "
                    : " flex-row "
                }   mb-1 p-2 rounded-lg w-full`}
              >
                <button
                  onClick={() => {
                    handleViewProfile(message?.username);
                  }}
                >
                  <img
                    src={
                      message?.username === userDetails?.data?.username
                        ? "/defaultDp.webp"
                        : "/user.png"
                    }
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    title={userDetails?.data?.username}
                  />
                </button>
                {message?.message !== "" ? (
                  <div
                    className={`flex flex-col mx-3  ${
                      message?.username === userDetails?.data?.username
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
  );
};

export default StartGroupChat;
