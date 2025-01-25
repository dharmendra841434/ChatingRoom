import React, { useState } from "react";

const UserSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample list of users
  const users = [
    "Dharmendra",
    "Aditi",
    "Aditya",
    "Rohan",
    "Simran",
    "Rajesh",
    "Priya",
  ];

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center  w-[32rem]">
      <h2 className=" text-xl font-bold mb-4 text-gray-900">
        Find Peoples to chat with
      </h2>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search users..."
        className="mb-4 w-full max-w-md px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-foreground"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className=" h-[25rem]">
        {/* User list */}
        {searchQuery && (
          <ul className="w-full max-w-md bg-white border border-gray-200 rounded-md shadow-md divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <li key={index} className="px-4 py-2 hover:bg-gray-100">
                  {user}
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
