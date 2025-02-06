import { getInitials } from "@/services/helper";
import React from "react";

const ProfileIcon = ({ fullName = "Ping pong", color = "#536" }) => {
  return (
    <div
      style={{ backgroundColor: color }}
      className={` h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold`}
    >
      <p className=" text-gray-200">{getInitials(fullName)}</p>
    </div>
  );
};

export default ProfileIcon;
