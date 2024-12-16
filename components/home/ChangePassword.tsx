import { changePassword } from "@/lib/services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

const ChangePassword = ({ onClose }: { onClose: () => void }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication is required");
      return;
    }

    try {
      await changePassword(token, oldPassword, newPassword);
      setSuccess("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-lg border shadow-lg dark:border-transparent dark:shadow-none">
        <div className="text-dark100_light500 flex size-full flex-col gap-8 pr-4 text-xs font-thin md:text-sm">
          <div className="mt-4 flex">
            <div className=" flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Change Password
            </div>
            <div
              className="ml-auto cursor-pointer pr-3 text-xl text-primary-100"
              onClick={onClose}
            >
              <Icon
                icon="ic:round-close"
                width="28"
                height="28"
                className="text-primary-100"
              />
            </div>
          </div>

          <div className="px-5 pb-10">
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            {success && (
              <div className="mb-4 text-sm text-green-500">{success}</div>
            )}
            <div className="flex w-full items-center gap-2 border-b border-gray-300 p-3">
              <input
                type="password"
                className="w-full bg-transparent px-2 focus:outline-none"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="mt-2 flex w-full items-center gap-2 border-b border-gray-300 p-3">
              <input
                type="password"
                className="w-full bg-transparent px-2 focus:outline-none"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mt-2 flex w-full items-center gap-2 border-b border-gray-300 p-3">
              <input
                type="password"
                className="w-full bg-transparent px-2 focus:outline-none"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleChangePassword}
                className="hover:bg-primary-200 rounded bg-primary-100 px-4 py-2 text-white"
              >
                Change password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
