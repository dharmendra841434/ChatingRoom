"use client";

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
import ProfileIcon from "./ProfileIcon";
import { countUnreadMessages, hasUserReadLastMessage } from "@/services/helper";
import useGetUserDetails from "@/hooks/authenticationHooks/useGetUserDetails";
import CustomModal from "./CustomModal";
import SelectedOptions from "./SelectedOptions";

const DashboardTab = () => {
  const [activeTab, setActiveTab] = useState("groups");
  const { groupsList, isLoading } = useGetUserGroupsList();
  const { userDetails } = useGetUserDetails();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showOptions, setShowOptions] = useState("create-group");
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("accessToken");
    router.push("/");
  };

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    router.push(`/dashboard`);
  };

  const handleStartConversation = (group) => {
    // console.log(group, "ajdgjsgd");
    router.push(`/dashboard/group/${group?.data?.groupKey}`);
  };

  const handleSelectChat = (chat) => {
    router.push(`/dashboard/user/${chat?.chatKey}`);
  };

  const handleSelectOption = (option) => {
    setShowOptions(option);
    setIsOpenModal(true);
  };

  const handleChangeUserstabs = () => {
    //handleChangeUserstabs();
    router.push(`/dashboard`);
  };

  return (
    <div className=" w-full h-full  border-r border-r-gray-200 bg-gray-200 relative">
      <CustomModal isOpen={isOpenModal} onClose={setIsOpenModal}>
        <div className=" p-6">
          <SelectedOptions
            show={showOptions}
            handleClose={() => {
              setIsOpenModal(false);
            }}
          />
        </div>
      </CustomModal>
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
              handleChangeTab("users");
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
              handleChangeTab("groups");
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
      <div className="h-[79%] xl:h-[81%]">
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
            </div>

            <UsersTabs
              userDetails={userDetails}
              handleSelectChat={(chat) => {
                handleSelectChat(chat);
              }}
              handleChangetabs={handleChangeUserstabs}
            />
          </div>
        )}
        {activeTab === "groups" && (
          <div className="text-gray-700 h-full bg-gray-100">
            <div className="flex  justify-between px-4 py-4 ">
              <button
                onClick={() => {
                  handleSelectOption("create-group");
                }}
                className=" flex flex-row items-center justify-center space-x-3 border border-foreground rounded-lg px-5 py-1"
              >
                <FiEdit className=" text-2xl" />
                <p>Create Group</p>
              </button>
              <button
                onClick={() => {
                  handleSelectOption("join-group");
                }}
                className="flex flex-row items-center justify-center space-x-3 border border-foreground rounded-lg px-5 py-1"
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
                          className={`${
                            group?.messages?.length > 0
                              ? `${
                                  hasUserReadLastMessage(
                                    group,
                                    userDetails?.data?.user
                                  )
                                    ? " bg-white"
                                    : " bg-green-100"
                                }`
                              : "bg-white"
                          }  drop-shadow-sm rounded-xl px-3 py-2 mb-3 cursor-pointer transition-all duration-300 ease-in-out hover:bg-purple-100 border border-gray-200`}
                        >
                          {countUnreadMessages(
                            group?.messages,
                            userDetails?.data?.user?._id
                          ) !== 0 && (
                            <div className=" absolute bg-red-500  h-6 w-6 text-xs text-white right-5 rounded-full flex items-center justify-center ">
                              {countUnreadMessages(
                                group?.messages,
                                userDetails?.data?.user?._id
                              )}
                            </div>
                          )}

                          <div className=" flex items-center space-x-3 ">
                            {/* <img
                              src="/groupIcon.webp"
                              alt="icon"
                              className=" h-10 w-10 rounded-full"
                            /> */}
                            <ProfileIcon
                              fullName={group.groupName}
                              color={group?.groupIconColor}
                            />

                            <div>
                              <h2 className="  font-medium text-gray-800 capitalize ">
                                {group.groupName}
                              </h2>
                              {group?.messages?.length > 0 && (
                                <div
                                  className={`text-xs mb-1.5 ${
                                    hasUserReadLastMessage(
                                      group,
                                      userDetails?.data?.user
                                    )
                                      ? " text-gray-600"
                                      : " text-gray-900 font-semibold"
                                  }`}
                                >
                                  {group?.messages[group.messages?.length - 1]
                                    ?.mediaFile !== null ? (
                                    <>
                                      <p>
                                        {
                                          group?.messages[
                                            group.messages?.length - 1
                                          ]?.username
                                        }
                                        :Photo
                                      </p>
                                    </>
                                  ) : (
                                    <p>
                                      {
                                        group?.messages[
                                          group.messages?.length - 1
                                        ]?.username
                                      }
                                      :
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
                src={userDetails?.data?.user?.profile_pic}
                alt="dp"
                className=" h-8 w-8 rounded-full "
              />
              <p className=" capitalize text-gray-700 font-medium">
                {userDetails?.data?.user?.full_name}
              </p>
            </div>
            <button onClick={handleLogout}>
              <HiOutlineLogout
                title="logout"
                className=" text-3xl transition-all duration-300 ease-in-out hover:scale-125 text-purple-900 cursor-pointer "
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
