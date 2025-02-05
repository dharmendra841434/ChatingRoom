import {
  cancelSendFriendRequest,
  findPeoplesRequest,
  sendFriendRequest,
} from "@/hooks/ApiRequiests/userApi";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import { useSocket } from "@/services/SocketProvider";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const { userDetails } = useGetUserDetails();
  const queryClient = useQueryClient();
  const socket = useSocket();

  // Debounce function
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Effect to handle the search request
  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true); // Start loading before fetching data
      const fetchUsers = async () => {
        try {
          const response = await findPeoplesRequest(debouncedQuery);
          setFilteredUsers(response);
        } catch (error) {
          console.error("Error fetching users:", error);
          setFilteredUsers([]);
        } finally {
          setLoading(false); // Stop loading after fetching
        }
      };

      fetchUsers();
    } else {
      setFilteredUsers([]);
    }
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendFriendRequest = async (userId) => {
    if (
      userDetails?.data?.sendedRequestsUsers?.some(
        (item) => item?._id === userId
      )
    ) {
      await cancelSendFriendRequest({ targetUserId: userId })
        .then(() => queryClient.invalidateQueries(["userDetails"]))
        .catch(console.error);
    } else {
      await sendFriendRequest({ targetUserId: userId })
        .then(() => queryClient.invalidateQueries(["userDetails"]))
        .catch(console.error);
    }
    socket.emit("sendNotification", {
      message: `Friend request sent by ${userDetails?.data?.user?.username}`,
    });
  };

  //console.log(userDetails, "ddddd");

  return (
    <div className="flex flex-col items-center w-[22rem]">
      <h2 className="text-xl font-bold mb-4 text-gray-900">
        Find People to Chat With
      </h2>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users..."
        className="mb-4 w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        value={searchQuery}
        onChange={handleSearch}
      />

      <div className="h-[25rem] w-full max-w-md overflow-y-auto">
        {/* Loader */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-4 border-gray-300 border-t-foreground rounded-full animate-spin"></div>
          </div>
        )}

        {/* User list */}
        {searchQuery && !loading && (
          <ul
            className="w-full bg-white 
           divide-y divide-gray-200"
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.profile_pic || "https://via.placeholder.com/40"}
                      alt={`${user.full_name}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.full_name}
                      </p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  {/* Send Friend Request Button */}
                  {userDetails?.data?.allFriends?.some(
                    (item) => item?._id === user?._id
                  ) ? (
                    <button className="border border-foreground rounded-md px-2 py-1 hover:bg-foreground hover:text-white">
                      Start Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendFriendRequest(user._id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-foreground rounded-md hover:bg-purple-700 "
                    >
                      {userDetails?.data?.sendedRequestsUsers?.some(
                        (item) => item?._id === user?._id
                      )
                        ? "Cancel Request"
                        : "Send Request"}
                    </button>
                  )}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No users found</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
