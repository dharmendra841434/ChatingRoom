import DashboardTab from "@/components/DashboardTab";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div className=" flex flex-row h-screen max-w-[96rem] mx-auto">
      <div className=" w-[35%] lg:w-[30%] xl:w-[25%]   bg-red-300 h-full">
        <DashboardTab />
      </div>
      <div className=" w-[65%] lg:w-[70%] xl:w-[75%]  h-full ">{children}</div>
    </div>
  );
};

export default DashboardLayout;
