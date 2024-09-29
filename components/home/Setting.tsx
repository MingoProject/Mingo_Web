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

      <div className="no-scrollbar relative z-10 mt-16 h-[50vh] w-[50vw] overflow-y-auto rounded-2xl bg-white shadow-lg dark:bg-dark-100 dark:text-white">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none bg-primary-100 p-2 px-4 text-center text-sm text-white">
              Cài đặt
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2"
            />
          </div>
          <div className="flex items-center justify-between  py-6 pl-8">
            <div className="flex w-1/2 flex-col items-start justify-start gap-14 text-light-500  ">
              <div
                onClick={() => setActiveTab("setting")}
                className={`flex items-center gap-1 ${
                  activeTab === "setting"
                    ? " text-primary-100 opacity-100 "
                    : "opacity-40"
                }`}
              >
                <Icon icon="ph:user-list-light" width={14} height={14} />
                <p>Chỉnh sửa thông tin cá nhân</p>
              </div>
              <div
                onClick={() => setActiveTab("changePassword")}
                className={`flex items-center gap-1 ${
                  activeTab === "changePassword"
                    ? " text-primary-100 opacity-100 "
                    : "opacity-40"
                }`}
              >
                <Icon icon="mdi:password-outline" width={14} height={14} />
                <p>Đổi mật khẩu</p>
              </div>
              <div
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-1 ${
                  activeTab === "security"
                    ? " text-primary-100 opacity-100 "
                    : "opacity-40"
                }`}
              >
                <Icon icon="fluent-mdl2:permissions" width={14} height={14} />
                <p>Quyền riêng tư</p>
              </div>
            </div>
            <div className="w-1/2 ">{renderContent()}</div>
          </div>
          <div className="flex w-full">
            <div className="w-1/2"></div>
            <div className="flex w-1/2 items-center justify-center">
              <button className="mr-2 h-[36px] w-10/12 rounded-lg bg-primary-100 text-center text-sm text-white">
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
