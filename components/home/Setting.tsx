import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@iconify/react";

import React, { useState } from "react";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import Security from "./Security";
const Setting = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState("setting"); // Khởi tạo state với tab "overview" mặc định

  const renderContent = () => {
    switch (activeTab) {
      case "setting":
        return <EditProfile />; // Hiển thị component tương ứng với overview
      case "changePassword":
        return <ChangePassword />; // Hiển thị component tương ứng với assignments
      case "security":
        return <Security />;
      default:
        return <EditProfile />;
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Background mờ - khi nhấn vào nền mờ thì đóng component */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar text-dark100_light500 background-light700_dark300 relative z-10 mt-16 h-[50vh] w-[50vw] overflow-y-auto rounded-2xl shadow-lg">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none bg-primary-100 p-2 px-4 text-center text-sm text-white">
              Setting
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2 cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between  py-6 pl-8">
            <div className="text-dark100_light500 flex w-10 flex-col items-start justify-start gap-14 lg:w-1/2  ">
              <div
                onClick={() => setActiveTab("setting")}
                className={`flex cursor-pointer items-center gap-1 ${
                  activeTab === "setting"
                    ? " text-primary-100 opacity-100 "
                    : "opacity-40"
                }`}
              >
                <Icon icon="ph:user-list-light" width={18} height={18} />
                <p className="hidden lg:block">Edit Personal Information</p>
              </div>
              <div
                onClick={() => setActiveTab("changePassword")}
                className={`flex cursor-pointer items-center gap-1 ${
                  activeTab === "changePassword"
                    ? " text-primary-100 opacity-100 "
                    : "opacity-40"
                }`}
              >
                <Icon icon="mdi:password-outline" width={18} height={18} />
                <p className="hidden lg:block">Change Password</p>
              </div>
              <div
                onClick={() => setActiveTab("security")}
                className={`flex cursor-pointer items-center gap-1 ${
                  activeTab === "security"
                    ? " text-primary-100 opacity-100 "
                    : "opacity-40"
                }`}
              >
                <Icon icon="fluent-mdl2:permissions" width={18} height={18} />
                <p className="hidden lg:block">Privacy</p>
              </div>
            </div>
            <div className="flex-1 lg:w-1/2 ">{renderContent()}</div>
          </div>
          <div className="flex w-full">
            <div className="w-16 lg:w-1/2 "></div>
            <div className="flex flex-1 justify-center pr-8  lg:w-1/2">
              <div className="flex h-full flex-1 items-center justify-center lg:w-11/12 ">
                <button className="text-dark100_light500 h-[36px]  w-full  rounded-lg bg-primary-100 text-center text-sm">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
