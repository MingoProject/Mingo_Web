"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import router from "next/router";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";

function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}"); // Assume user data is stored in localStorage
    if (user) {
      setUserInfo(user);
    } else {
      // Redirect to login if no user info is found
      router.push("/auth/sign-in");
    }
  }, []);

  return (
    <div className="background-light700_dark400 h-full pt-20">
      <div className="flex">
        <div>
          <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
            Trang cá nhân
          </div>
          <div className="ml-[20%]">
            <span className="text-dark100_light500 text-[36px]">Hello,</span>
            <div>
              <h2 className="ml-5 text-[38px] text-primary-100">
                I&#39;m Huỳnh
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
            src="/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
            alt="Avatar"
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
        </div>
        <div className="ml-[5%]">
          <h1 className="text-dark100_light500 text-[25px]">
            {userInfo?.fullname}
          </h1>
          <div className="mt-[30px]">
            <span className="text-dark100_light500">
              ರ ‿ ರ. иɢυуєи тнι инυ нυуин
            </span>
            <h6 className="text-dark100_light500">
              My name is Huynh, I’m studying university of Information
              Technology, hahahahahhahahahahahahahah
            </h6>
          </div>
        </div>
      </div>
      <div className="mx-[20%] my-5 flex justify-around">
        <span
          className={`cursor-pointer ${
            activeTab === "posts"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Bài viết
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "friends"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("friends")}
        >
          Bạn bè
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "photos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("photos")}
        >
          Ảnh
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "videos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("videos")}
        >
          Video
        </span>
      </div>
      <div className="mx-[100px] my-5">
        <RenderContentPage activeTab={activeTab} />
      </div>{" "}
    </div>
  );
}
export default Page;
