import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { uploadBackground } from "@/lib/services/user.service";

const Background = ({ profile, setProfile }: any) => {
  const [backgroundMenuOpen, setBackgroundMenuOpen] = useState(false);
  const backgroundMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        backgroundMenuRef.current &&
        !backgroundMenuRef.current.contains(e.target as Node)
      ) {
        setBackgroundMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // eslint-disable-next-line no-undef
  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation
    setBackgroundMenuOpen(true);
  };

  const handleFileChangeBackground = async (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadUserBackground(file);
    }
  };

  const uploadUserBackground = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await uploadBackground(formData, token);
        if (response?.status) {
          setProfile((prevProfile: any) => ({
            ...prevProfile,
            background: response?.result.secure_url,
          }));
        }
      }
    } catch (err) {
      //   setError("Failed to upload avatar");
      console.error("Error uploading avatar:", err);
    }
  };
  return (
    <>
      <div className="mx-[5%] flex">
        <div>
          <div className="absolute left-0 flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
            Personal page
          </div>
          <div className="ml-[20%] mt-10 hidden lg:block">
            <span className="text-dark100_light500 text-[36px]">Hello,</span>
            <h2 className="ml-5 text-[38px] text-primary-100">
              I&apos;m {profile?.lastName}
            </h2>
          </div>
        </div>
        <div className="right-0 h-[274px] w-full overflow-hidden">
          <Image
            onClick={handleBackgroundClick}
            src={
              profile?.background
                ? profile.background
                : "/assets/images/5e7aa00965e1d68e7cb1d58d2281498b.jpg"
            }
            alt="Background"
            width={966}
            height={274}
            className="size-full rounded-lg object-cover object-right"
          />
        </div>
      </div>
      {backgroundMenuOpen && (
        <div
          ref={backgroundMenuRef}
          className="absolute z-10 ml-[50%] rounded-lg border border-gray-300 bg-white shadow-lg"
        >
          <button
            onClick={() => console.log("View Avatar")}
            className="text-dark100_light500 block w-full px-4 py-2 text-left text-sm hover:bg-primary-100 hover:text-white"
          >
            View Background
          </button>
          <button
            onClick={() => document.getElementById("avatarInput")?.click()}
            className="text-dark100_light500 block w-full px-4 py-2 text-left text-sm hover:bg-primary-100 hover:text-white"
          >
            Change Background
          </button>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }} // ẩn input
            onChange={handleFileChangeBackground} // xử lý thay đổi file
          />
        </div>
      )}
    </>
  );
};

export default Background;
