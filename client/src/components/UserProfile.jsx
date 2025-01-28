import React from "react";

const UserProfileCard = ({ user }) => {
  //   const user = {
  //     _id: "6794ba12c543715293526841",
  //     username: "dharmendra2182",
  //     full_name: "Dharmendra Kumar",
  //     profile_pic:
  //       "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_640.png",
  //     isActive: true,
  //     createdAt: "2025-01-25T10:16:50.229Z",
  //     updatedAt: "2025-01-25T10:16:50.229Z",
  //   };

  return (
    <div className="flex justify-center items-center  bg-gray-100">
      <div className="w-96 rounded-2xl shadow-lg bg-white p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.profile_pic}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-4 shadow-md"
          />
          <h2 className="text-xl font-bold text-gray-800">{user.full_name}</h2>
          <p className="text-gray-600">@{user.username}</p>
          <p
            className={`mt-2 text-sm font-medium px-3 py-1 rounded-full ${
              user.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.isActive ? "Active" : "Inactive"}
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
          </div>
          <button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-lg">
            Send Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
