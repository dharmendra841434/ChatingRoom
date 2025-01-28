import {
  findPeoplesRequest,
  sendFriendRequest,
} from "@/hooks/ApiRequiests/userApi";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import React, { useState, useEffect } from "react";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { userDetails, isLoading, isError, error } = useGetUserDetails();

  // Debounce function
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 2000); // 300ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Effect to handle the search request
  useEffect(() => {
    if (debouncedQuery) {
      const fetchUsers = async () => {
        const response = await findPeoplesRequest(debouncedQuery);
        setFilteredUsers(response); // Assuming the response is an array of user objects
      };

      fetchUsers();
    } else {
      setFilteredUsers([]); // Clear the list if the search query is empty
    }
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendFriendRequest = async (userId) => {
    // Implement the logic to send a friend request
    console.log(`Friend request sent to user with ID: ${userId}`);
    const response = await sendFriendRequest({ targetUserId: userId });
    // console.log(response);
  };

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
        {/* User list */}
        {searchQuery && (
          <ul className="w-full bg-white border border-gray-200 rounded-md shadow-md divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className="px-4 py-3 hover:bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {/* Profile Picture */}
                    <img
                      src={user.profile_pic || "https://via.placeholder.com/40"} // Fallback image if profilePic is not available
                      alt={`${user.full_name}'s profile`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {/* User Details */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.full_name}
                      </p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  {/* Send Friend Request Button */}
                  <button
                    onClick={() => handleSendFriendRequest(user._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-foreground rounded-md hover:bg-purple-700 "
                  >
                    {userDetails?.data?.requests?.some(
                      (item) => item?.userId === user?._id
                    )
                      ? "Cancel Request"
                      : "Send Request"}
                  </button>
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
