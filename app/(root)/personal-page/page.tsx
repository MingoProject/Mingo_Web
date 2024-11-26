"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";
import InfomationUser from "@/components/forms/personalPage/InfomationUser";
import { getMyProfile, uploadAvatar } from "@/lib/services/user.service";

function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const avatarMenuRef = useRef<HTMLDivElement | null>(null);

  // Fetch profile information from the server
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const profileData = await getMyProfile(userId);
          setProfile(profileData.userProfile);
        }
      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Close the avatar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        avatarMenuRef.current &&
        !avatarMenuRef.current.contains(e.target as Node)
      ) {
        setAvatarMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // eslint-disable-next-line no-undef
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event propagation
    setAvatarMenuOpen(true);
  };

  // Upload new avatar
  const uploadUserAvatar = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await uploadAvatar(formData, token);
        if (response?.status) {
          setProfile((prevProfile: any) => ({
            ...prevProfile,
            avatar: response?.avatarUrl,
          }));
        }
      }
    } catch (err) {
      setError("Failed to upload avatar");
      console.error("Error uploading avatar:", err);
    }
  };

  // Handle file input change (for uploading a new avatar)
  const handleFileChange = async (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadUserAvatar(file);
    }
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) return <div className="mt-96">Loading...</div>;
  if (error) return <div className="mt-96">Error: {error}</div>;

  return (
    <div className="background-light700_dark400 h-full pt-20">
      {/* Header Section */}
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

      {/* Profile Info Section */}
      <div className="mt-[30px] flex">
        <div className="ml-[10%] size-[200px] overflow-hidden rounded-full">
          <Image
            onClick={handleAvatarClick}
            src={profile?.avatar || "/assets/images/capy.jpg"}
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        </div>

        <div className="ml-[5%]">
          <h1 className="text-dark100_light500 text-[25px]">
            {profile?.firstName} {profile?.lastName}
            {profile?.nickName && <span> ({profile?.nickName})</span>}
          </h1>
          <div className="mt-[30px]">
            <span className="text-dark100_light500">
              {profile?.bio || "Bio not provided"}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar Menu */}
      {avatarMenuOpen && (
        <div
          ref={avatarMenuRef}
          className="absolute z-10 ml-[20%] rounded-lg border border-gray-300 bg-white shadow-lg"
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

      {/* User Information Section */}
      <div>
        <InfomationUser
          job={profile?.job}
          hobbies={profile?.hobbies}
          address={profile?.address}
        />
      </div>

      {/* Tabs Navigation */}
      <div className="m-10 mx-[20%] mb-5 flex justify-around">
        <span
          className={`cursor-pointer ${
            activeTab === "posts"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => handleTabClick("posts")}
        >
          Posts
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "friends"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => handleTabClick("friends")}
        >
          Friends
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "photos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => handleTabClick("photos")}
        >
          Pictures
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "videos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => handleTabClick("videos")}
        >
          Videos
        </span>
      </div>

      {/* Content Section */}
      <div className="mx-[5%] my-5">
        <RenderContentPage activeTab={activeTab} />
      </div>
    </div>
  );
}

export default Page;
