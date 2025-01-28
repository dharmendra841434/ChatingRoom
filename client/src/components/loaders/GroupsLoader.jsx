import React from "react";

const GroupsLoader = () => {
  return (
    <div className="animate-pulse space-y-4">
      {/* Skeleton items */}
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center space-x-4">
          <div className=" flex flex-row items-center space-x-3 w-full  rounded-xl bg-gray-300 p-3">
            <div className="h-16 w-16 bg-gray-400 rounded-full"></div>
            <div className=" w-full">
              <div className=" w-[90%] bg-gray-400 h-5 mb-2 rounded-lg" />
              <div className=" w-[50%] bg-gray-400 h-5 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsLoader;
