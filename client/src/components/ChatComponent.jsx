import { timeAgo } from "@/services/helper";
import React, { useRef } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

const ChatComponent = ({ messages, userDetails, handleViewProfile }) => {
  const chatContainerRef = useRef(null);

  return (
    <ScrollView ref={chatContainerRef} className="flex-1 px-3 py-1">
      {messages.length === 0 ? (
        <Text className="text-gray-500 text-center mt-4">No messages yet</Text>
      ) : (
        <View className="flex flex-col justify-end w-full">
          {messages.map((message, index) => (
            <View
              key={index}
              className={`flex mb-1 p-2 rounded-lg w-full ${
                message?.username === userDetails?.data?.username
                  ? "flex-row-reverse"
                  : "flex-row"
              }`}
            >
              <TouchableOpacity
                onPress={() => handleViewProfile(message?.username)}
              >
                <Image
                  source={{
                    uri:
                      message?.username === userDetails?.data?.username
                        ? "https://example.com/defaultDp.webp"
                        : "https://example.com/user.png",
                  }}
                  className="w-10 h-10 rounded-full"
                />
              </TouchableOpacity>
              {message?.message !== "" ? (
                <View
                  className={`flex flex-col mx-3 w-1/3 pl-5 pr-10 py-3 rounded-xl ${
                    message?.username === userDetails?.data?.username
                      ? "bg-purple-100 rounded-tr-none"
                      : "bg-gray-100 rounded-tl-none"
                  }`}
                >
                  <Text className="text-sm text-gray-700">
                    {message.message}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {timeAgo(message.timestamp)}
                  </Text>
                </View>
              ) : (
                <View
                  className={`flex flex-col mx-3 w-1/3 pl-5 pr-10 py-3 rounded-xl ${
                    message?.username === userDetails?.data?.username
                      ? "bg-purple-100 rounded-tr-none"
                      : "bg-gray-100 rounded-tl-none"
                  }`}
                >
                  <Image
                    source={{ uri: message?.mediaFile?.url }}
                    className="w-24 h-24 rounded-lg"
                  />
                  <Text className="text-gray-500 text-xs">
                    {timeAgo(message.timestamp)}
                  </Text>
                  {typeof message?.mediaFile?.url !== "string" && (
                    <Text>55%</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default ChatComponent;
