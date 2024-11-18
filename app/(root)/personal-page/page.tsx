"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";
import InfomationUser from "@/components/forms/personalPage/InfomationUser";
import { getMyProfile } from "@/lib/services/user.service";

const mockUserData = {
  _id: "6718b362124dc3d07eb0fc1d",
  username: "123",
  fullname: "Huỳnh Nguyễn Thị Như",
  numberphone: "0348775966",
  email: "huynh@gmail.com",
  birthday: "2024-10-22T00:00:00.000+00:00",
  gender: "female",
  password: "$2a$10$.DclnSpDCcXEjR0p0F8FS.dtH70nrWuQPVxPFH7Le.iYS..72YJl2",
  avatar: "https://randomuser.me/api/portraits/women/75.jpg", // link ảnh giả
  background: "https://source.unsplash.com/random/800x600", // link ảnh nền giả
  address: {
    street: "456 Le Duan",
    district: "District 1",
    city: "Ho Chi Minh City",
    country: "Vietnam",
  },

  job: {
    title: "Data Analyst",
    company: "Tech Solutions",
    location: "Ho Chi Minh City",
  },
  hobbies: [
    { title: "Reading", icon: "solar:book-2-broken" }, // Cập nhật với icon
    { title: "Cooking", icon: "game-icons:rice-cooker" },
    { title: "Yoga", icon: "iconoir:yoga" },
  ],
  bio: "A tech enthusiast who loves data and coding.",
  nickName: "Huỳnh Huỳnh",
  friends: ["6718b362124dc3d07eb0fc2a", "6718b362124dc3d07eb0fc3b"], // giả định danh sách bạn bè
  bestFriends: ["6718b362124dc3d07eb0fc2a"], // giả định danh sách bạn thân
  following: ["6718b362124dc3d07eb0fc4c", "6718b362124dc3d07eb0fc5d"], // giả định danh sách theo dõi
  block: ["6718b362124dc3d07eb0fc6e"], // giả định danh sách chặn
  isAdmin: false,
  userId: "1b95baed-bfca-4e51-b32c-16478884edad",
};

function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState<any>(null); // Adjust type according to your profile structure
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log(userId);
        const profileData = await getMyProfile(userId);
        console.log(profileData.userProfile);
        setProfile(profileData.userProfile);
      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="mt-96">Loading...</div>;
  if (error) return <div className="mt-96">Error: {error}</div>;

  return (
    <div className="background-light700_dark400 h-full pt-20">
      <div className="flex">
        <div>
          <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
            Personal page
          </div>
          <div className="ml-[20%] hidden lg:block">
            <span className="text-dark100_light500 text-[36px]">Hello,</span>
            <div>
              <h2 className="ml-5 text-[38px] text-primary-100">
                I&#39;m {profile?.lastName}
              </h2>
            </div>
          </div>
        </div>
        <div className="absolute right-0 mr-[5%] h-[274px] w-[70%] overflow-hidden">
          <Image
            src="/assets/images/5e7aa00965e1d68e7cb1d58d2281498b.jpg"
            alt="Avatar"
            width={966}
            height={274}
            className="size-full rounded-lg object-cover object-right"
          />
        </div>
      </div>
      <div className="mt-[100px] flex">
        <div className="ml-[10%]  size-[200px] overflow-hidden rounded-full">
          <Image
            src={profile?.avatar}
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        </div>
        <div className="ml-[5%]">
          <h1 className="text-dark100_light500 text-[25px]">
            {profile?.firstName} {profile?.lastName}
            {profile?.nickName && <span> ({mockUserData.nickName})</span>}
          </h1>
          <div className="mt-[30px]">
            <span className="text-dark100_light500">
              ರ ‿ ರ. иɢυуєи тнι инυ нυуин
            </span>
            <h6 className="text-dark100_light500">{profile?.bio}</h6>
          </div>
        </div>
      </div>
      <div>
        <InfomationUser
          job={profile?.job}
          hobbies={profile?.hobbies}
          address={profile?.address}
        />
      </div>
      <div className="m-10 mx-[20%] mb-5 flex justify-around">
        <span
          className={`cursor-pointer ${
            activeTab === "posts"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "friends"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "photos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("photos")}
        >
          Pictures
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "videos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </span>
      </div>
      <div className="mx-[100px] my-5">
        <RenderContentPage activeTab={activeTab} />
      </div>{" "}
    </div>
  );
}
export default Page;
