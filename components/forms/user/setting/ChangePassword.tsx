import NameCard from "@/components/cards/other/NameCard";
import Button from "@/components/ui/button";
import InputTitle from "@/components/ui/inputTitle";
import { changePassword } from "@/lib/services/user.service";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="background-light200_dark200 max-w-2xl text-dark100_light100 my-32 max-h-screen w-2/5 overflow-y-auto rounded-md py-6 shadow-lg custom-scrollbar">
          <div className="flex size-full flex-col">
            <div className="flex items-center justify-between px-4 py-2 pl-0">
              <NameCard name="Saved Posts" />
              <FontAwesomeIcon
                onClick={onClose}
                icon={faXmark}
                className="mb-2 cursor-pointer size-6"
              />
            </div>
          </div>

          <div className="px-10 flex flex-col gap-5 my-5">
            {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
            {success && (
              <div className="mb-4 text-sm text-green-500">{success}</div>
            )}
            <InputTitle
              label="Old Password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <InputTitle
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <InputTitle
              label="Confirm New Password"
              placeholder="Enter confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="mt-2">
              <Button
                title="Change Password"
                size="large"
                onClick={handleChangePassword}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
