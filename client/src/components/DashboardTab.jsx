import React, { useState } from "react";
import { MdGroups } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { FiEdit } from "react-icons/fi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { GoSearch } from "react-icons/go";
import useGetUserGroupsList from "@/hooks/groupHooks/useGetUserGroupsList";
import GroupsLoader from "./loaders/GroupsLoader";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import ProfileLoader from "./loaders/ProfileLoader";
import UsersTabs from "./UsersTabs";

const DashboardTab = ({
  handleStartConversation,
  handleSelectOption,
  userDetails,
}) => {
  const [activeTab, setActiveTab] = useState("groups");
  const [allUsers, setAllUsers] = useState([]);
  const { groupsList, isLoading } = useGetUserGroupsList();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    router.push("/");
  };

  //console.log(userDetails, "jgjgghgh");

  return (
    <div className="w-full max-w-md mx-auto  border-r border-r-gray-200 bg-white">
      <div className="flex  ">
        <div
          className={`w-1/2 ${
            activeTab === "users" ? "bg-foreground " : " bg-gray-100"
          }`}
        >
          <button
            className={`flex w-full   flex-row items-center space-x-4 justify-center py-[1.16rem] text-center ${
              activeTab === "users"
                ? " bg-gray-100 text-gray-800 rounded-tr-3xl"
                : "text-gray-300 bg-foreground rounded-br-3xl"
            }`}
            onClick={() => {
              setActiveTab("users");
              handleStartConversation({
                type: "",
                data: null,
              });
            }}
          >
            <MdGroups className=" text-3xl" />
            <p>Users</p>
          </button>
        </div>

        <div
          className={`w-1/2 ${
            activeTab === "groups" ? "bg-foreground " : " bg-gray-100"
          }`}
        >
          <button
            className={`flex w-full flex-row items-center justify-center space-x-4 py-3 text-center ${
              activeTab === "groups"
                ? " bg-gray-100 text-gray-800 rounded-tl-3xl"
                : "text-gray-300 bg-foreground rounded-bl-3xl"
            }`}
            onClick={() => {
              setActiveTab("groups");
              handleStartConversation({
                type: "",
                data: null,
              });
            }}
          >
            <div
              className={`border ${
                activeTab === "groups" ? "border-gray-800" : "text-gray-300"
              } rounded-full p-1`}
            >
              <div
                className={`border ${
                  activeTab === "groups" ? "border-gray-800" : "text-gray-300"
                } rounded-full p-1`}
              >
                <HiOutlineUserGroup className=" text-2xl" />
              </div>
            </div>
            <p>Groups</p>
          </button>
        </div>
      </div>
      <div className="h-[82%]">
        {activeTab === "users" && (
          <div className="text-gray-700 h-full bg-gray-100">
            <div className=" flex items-center justify-center py-4 px-3 space-x-2">
              <button
                onClick={() => {
                  handleSelectOption("find-people");
                }}
                className=" flex flex-row w-full items-center justify-center space-x-3 border border-foreground rounded-lg px-8 py-1"
              >
                <GoSearch className=" text-2xl" />
                <p>Search People</p>
              </button>
              {/* <button
                onClick={() => {
                  handleSelectOption("revieved-requist");
                }}
                className=" flex flex-row items-center justify-center space-x-1 border border-foreground rounded-lg px-3 py-1"
              >
                <p>Recieved Requests</p>
              </button> */}
            </div>

            <UsersTabs userDetails={userDetails} />
          </div>
        )}
        {activeTab === "groups" && (
          <div className="text-gray-700 h-full bg-gray-100">
            <div className="flex  justify-between px-4 py-4 ">
              <button
                onClick={() => {
                  handleSelectOption("create-group");
                }}
                className=" flex flex-row items-center justify-center space-x-3 border border-foreground rounded-lg px-8 py-1"
              >
                <FiEdit className=" text-2xl" />
                <p>Create Group</p>
              </button>
              <button
                onClick={() => {
                  handleSelectOption("join-group");
                }}
                className="flex flex-row items-center justify-center space-x-3 border border-foreground rounded-lg px-8 py-1"
              >
                <IoMdAddCircleOutline className=" text-2xl" />
                <p>Join Group</p>
              </button>
            </div>
            <div className=" px-3 h-[80%]">
              <h3 className=" font-bold text-gray-900 my-3">All Groups</h3>
              {isLoading ? (
                <GroupsLoader />
              ) : (
                <div className=" h-full  overflow-y-scroll">
                  {groupsList?.data?.length === 0 ? (
                    <div className=" w-full h-full  flex flex-col items-center justify-center">
                      <p>You have no Any groups ?</p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {groupsList?.data?.groups?.map((group) => (
                        <div
                          key={group._id}
                          onClick={() =>
                            handleStartConversation({
                              type: "group",
                              data: group,
                            })
                          }
                          className="bg-white drop-shadow-sm rounded-xl p-3 mb-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-purple-100 border border-gray-200"
                        >
                          <div className=" flex items-center space-x-3 ">
                            <img
                              src="/groupIcon.webp"
                              alt="icon"
                              className=" h-10 w-10 rounded-full"
                            />
                            <div>
                              <h2 className=" font-semibold text-gray-800 capitalize ">
                                {group.groupName}
                              </h2>
                              {group?.messages?.length > 0 && (
                                <div className=" text-xs">
                                  {group?.messages[group.messages?.length - 1]
                                    ?.mediaFile !== null ? (
                                    <>
                                      <p>Photo</p>
                                    </>
                                  ) : (
                                    <p className="text-xs my-2 text-gray-600 ">
                                      {
                                        group?.messages[
                                          group.messages?.length - 1
                                        ]?.message
                                      }
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className=" py-1 px-5">
        {!userDetails ? (
          <ProfileLoader />
        ) : (
          <div className=" flex flex-row items-center justify-between space-x-3  h-fit p-2 ">
            <div className=" flex flex-row items-center space-x-3">
              <img
                src={userDetails?.user?.profile_pic}
                alt="dp"
                className=" h-8 w-8 rounded-full "
              />
              <p className=" capitalize text-gray-700 font-medium">
                {userDetails?.user?.full_name}
              </p>
            </div>
            <button onClick={handleLogout}>
              <HiOutlineLogout
                title="logout"
                className=" transition-all duration-300 ease-in-out hover:scale-125 text-purple-900 cursor-pointer "
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
