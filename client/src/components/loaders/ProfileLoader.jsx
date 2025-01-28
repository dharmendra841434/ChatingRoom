import React from "react";

const ProfileLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className=" flex flex-row items-center p-2 space-x-3">
        <div className="bg-gray-200 rounded-full w-10 h-10"></div>
        <div className="bg-gray-200 rounded w-[75%] h-6"></div>
      </div>
    </div>
  );
};

export default ProfileLoader;
