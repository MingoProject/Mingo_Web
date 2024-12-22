import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ItemChat } from "@/dtos/MessageDTO";
import { uploadGroupAvatar } from "@/lib/services/message.service";

const ChangeAvatar = ({
  groupData,
  setGroupData,
}: {
  groupData: ItemChat;
  setGroupData: any;
}) => {
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(e.target as Node)
      ) {
        if (isMounted) {
          setAvatarMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      isMounted = false;
    };
  }, []);

  // eslint-disable-next-line no-undef
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAvatarMenuOpen(true);
  };

  const uploadUserAvatar = async (file: File) => {
    console.log(file, "file nek");
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await uploadGroupAvatar(formData, groupData.id, token);
        if (response?.status) {
          console.log(response?.result.secure_url);
          setGroupData((prevProfile: any) => ({
            ...prevProfile,
            avatar: response?.result.secure_url,
          }));
        }
      }
    } catch (err) {
      //   setError("Failed to upload avatar");
      console.error("Error uploading avatar:", err);
    }
  };

  const handleFileChange = async (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log(file, "this is file");
    if (file) {
      await uploadUserAvatar(file);
    }
  };

  return (
    <>
      <div className="ml-[10%] size-[200px] overflow-hidden rounded-full">
        <Image
          onClick={handleAvatarClick}
          src={groupData?.avatarUrl || "/assets/images/default-user.png"}
          alt="Avatar"
          width={80}
          height={80}
          className="rounded-full object-cover"
          style={{
            objectFit: "cover",
            width: "80px",
            height: "80px",
          }}
        />
      </div>
      {avatarMenuOpen && (
        <div
          ref={avatarMenuRef}
          className="background-light800_dark400 absolute z-10 mb-10 ml-[20%] mt-5 rounded-lg border border-gray-300 shadow-lg"
        >
          <button
            onClick={() => console.log("View Avatar")}
            className="text-dark100_light500 block w-full px-4 py-2 text-left text-sm hover:bg-primary-100 hover:text-white"
          >
            View Avatar
          </button>
          <button
            onClick={() => document.getElementById("avatarInput")?.click()}
            className="text-dark100_light500 block w-full px-4 py-2 text-left text-sm hover:bg-primary-100 hover:text-white"
          >
            Change Avatar
          </button>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }} // ẩn input
            onChange={handleFileChange} // xử lý thay đổi file
          />
        </div>
      )}
    </>
  );
};

export default ChangeAvatar;
