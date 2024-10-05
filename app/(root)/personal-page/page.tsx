"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import PostsCard from "@/components/cards/PostsCard";
import { Icon } from "@iconify/react";
import router from "next/router";

const posts = [
  {
    id: 1,
    userName: "Huỳnh",
    userAvatar: "/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg",
    title: "Hôm nay ăn bún đậu",
    images: {
      id: 1,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["An", "Minh", "Lan"],
    comment: [
      { text: "Ngon quá!", user: "An" },
      { text: "Nhìn hấp dẫn quá", user: "Minh" },
      { text: "Muốn ăn thử!", user: "Lan" },
    ],
    createdAt: "2024-08-01T10:00:00Z",
  },
  {
    id: 2,
    userName: "Minh",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Trải nghiệm bún bò Huế",
    images: {
      id: 2,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Huỳnh", "Linh"],
    comment: [
      { text: "Tuyệt vời!", user: "Huỳnh" },
      { text: "Nhìn rất ngon!", user: "Linh" },
    ],
    createdAt: "2024-08-02T12:30:00Z",
  },
  {
    id: 3,
    userName: "Anh",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Bún chả Hà Nội ngon tuyệt",
    images: {
      id: 3,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Thảo", "Minh"],
    comment: [
      { text: "Nhìn tuyệt quá!", user: "Thảo" },
      { text: "Rất ngon!", user: "Minh" },
    ],
    createdAt: "2024-08-03T09:15:00Z",
  },
  {
    id: 4,
    userName: "Thảo",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Ăn phở cuốn",
    images: {
      id: 4,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Huỳnh", "Linh"],
    comment: [
      { text: "Rất ngon!", user: "Huỳnh" },
      { text: "Mình cũng thích món này", user: "Linh" },
    ],
    createdAt: "2024-08-04T14:45:00Z",
  },
  {
    id: 5,
    userName: "Linh",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Thưởng thức bánh mì Sài Gòn",
    images: {
      id: 5,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Minh", "Thảo", "Anh"],
    comment: [
      { text: "Bánh mì ngon quá!", user: "Minh" },
      { text: "Mình muốn ăn thử", user: "Thảo" },
      { text: "Ngon lắm!", user: "Anh" },
    ],
    createdAt: "2024-08-05T11:00:00Z",
  },
  {
    id: 6,
    userName: "Nam",
    userAvatar: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    title: "Món ngon bánh cuốn",
    images: {
      id: 6,
      img1: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
      img2: "/assets/images/cdb56840615cff74167efa4c463f3b05.jpg",
    },
    like: ["Minh", "Thảo", "Huỳnh"],
    comment: [
      { text: "Rất ngon!", user: "Minh" },
      { text: "Món yêu thích của mình", user: "Thảo" },
      { text: "Món này ngon!", user: "Huỳnh" },
    ],
    createdAt: "2024-08-06T08:20:00Z",
  },
];
const fakeFriends = [
  {
    name: "Mickey Mouse",
    image:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg", // Mickey Mouse image
  },
  {
    name: "Minnie Mouse",
    image:
      "https://i.pinimg.com/originals/ff/ec/81/ffec81a1a3ee6a557433bcc626e1dfc6.jpg", // Minnie Mouse image
  },
  {
    name: "Donald Duck",
    image:
      "https://i.pinimg.com/originals/ce/16/72/ce16725b94d75e6434bbe3ac0f005814.jpg", // Donald Duck image
  },
  {
    name: "Goofy",
    image:
      "https://i.pinimg.com/originals/70/3f/f8/703ff89cf6cad803da55cf5cc9ff42fd.jpg", // Goofy image
  },
  {
    name: "Pluto",
    image:
      "https://i.pinimg.com/originals/8d/87/4b/8d874bdf21d904fece1f06a83bfb8160.jpg", // Pluto image
  },
  {
    name: "Daisy Duck",
    image:
      "https://i.pinimg.com/originals/22/ac/ca/22accaa81d76b8e6aace6c5562e00f8e.jpg", // Daisy Duck image
  },
  {
    name: "Simba",
    image:
      "https://i.pinimg.com/originals/9c/8d/c8/9c8dc806006f2da4154d68e85a9dd7cc.jpg", // Simba from Lion King
  },
  {
    name: "Ariel",
    image:
      "https://i.pinimg.com/originals/1c/6d/80/1c6d806c88fe716566fb83713396b195.jpg", // Ariel from The Little Mermaid
  },
  {
    name: "Elsa",
    image:
      "https://i.pinimg.com/originals/95/0d/0d/950d0d7b19b956a5052b7d2c362c9871.jpg", // Elsa from Frozen
  },
  {
    name: "Woody",
    image:
      "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg", // Woody from Toy Story
  },
];
const picturesData = [
  "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg", // Mickey Mouse image
  "https://i.pinimg.com/originals/ff/ec/81/ffec81a1a3ee6a557433bcc626e1dfc6.jpg", // Minnie Mouse image
  "https://i.pinimg.com/originals/ce/16/72/ce16725b94d75e6434bbe3ac0f005814.jpg", // Donald Duck image
  "https://i.pinimg.com/originals/70/3f/f8/703ff89cf6cad803da55cf5cc9ff42fd.jpg", // Goofy image
  "https://i.pinimg.com/originals/8d/87/4b/8d874bdf21d904fece1f06a83bfb8160.jpg", // Pluto image
  "https://i.pinimg.com/originals/22/ac/ca/22accaa81d76b8e6aace6c5562e00f8e.jpg", // Daisy Duck image
  "https://i.pinimg.com/originals/9c/8d/c8/9c8dc806006f2da4154d68e85a9dd7cc.jpg", // Simba image
  "https://i.pinimg.com/originals/1c/6d/80/1c6d806c88fe716566fb83713396b195.jpg", // Ariel image
  "https://i.pinimg.com/originals/95/0d/0d/950d0d7b19b956a5052b7d2c362c9871.jpg", // Elsa image
  "https://i.pinimg.com/originals/4c/94/8f/4c948f59bd94a59dd88cc4636a7016ad.jpg", // Woody image
];
function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const [activeTabFriend, setActiveTabFriend] = useState("all"); // Mặc định hiển thị "Bài viết"
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

  const renderFriend = () => {
    switch (activeTabFriend) {
      case "all":
        return (
          <div className="grid grid-cols-2 gap-4">
            {fakeFriends.map((friend, index) => (
              <div
                key={index}
                className="text-dark100_light500 flex w-3/5 items-center"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="mb-2 size-20 rounded-full object-cover"
                />
                <div className="mb-1 ml-2 font-bold">{friend.name}</div>
                <Icon
                  icon="mdi:dots-horizontal"
                  className="text-dark100_light500 ml-auto size-6"
                />
              </div>
            ))}
          </div>
        );
      case "recently":
        return (
          <div className="grid grid-cols-2 gap-4">
            {fakeFriends.map((friend, index) => (
              <div
                key={index}
                className="text-dark100_light500 flex w-3/5 items-center"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="mb-2 size-20 rounded-full object-cover"
                />
                <div className="mb-1 ml-2 font-bold">{friend.name}</div>
                <Icon
                  icon="mdi:dots-horizontal"
                  className="text-dark100_light500 ml-auto size-6"
                />
              </div>
            ))}
          </div>
        );
      case "followed":
        return (
          <div className="grid grid-cols-2 gap-4">
            {fakeFriends.map((friend, index) => (
              <div
                key={index}
                className="text-dark100_light500 flex w-3/5 items-center"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="mb-2 size-20 rounded-full object-cover"
                />
                <div className="mb-1 ml-2 font-bold">{friend.name}</div>
                <Icon
                  icon="mdi:dots-horizontal"
                  className="text-dark100_light500 ml-auto size-6"
                />
              </div>
            ))}
          </div>
        );
      case "blocked":
        return (
          <div className="grid grid-cols-2 gap-4">
            {fakeFriends.map((friend, index) => (
              <div
                key={index}
                className="text-dark100_light500 flex w-3/5 items-center"
              >
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="mb-2 size-20 rounded-full object-cover"
                />
                <div className="mb-1 ml-2 font-bold">{friend.name}</div>
                <Icon
                  icon="mdi:dots-horizontal"
                  className="text-dark100_light500 ml-auto size-6"
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <div className="mx-[120px] flex pt-6">
            <div className="w-5/12 pt-6">
              <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
                Friends
              </div>
              <ul className="mt-5 space-y-4">
                {fakeFriends.map((friend, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      className="size-12 rounded-full"
                    />
                    <span className="text-dark100_light500 font-medium">
                      {friend.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-7/12">
              <div className="background-light700_dark300 h-[135px] w-full rounded-lg px-2">
                <div className="mx-[1%] pl-4 pt-6">
                  <div className="flex ">
                    <div className="size-[40px] overflow-hidden rounded-full">
                      <Image
                        src="/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="    Share something..."
                      className="background-light600_dark200 ml-3 h-[40px] w-full rounded-full text-base"
                    />
                  </div>
                </div>
                <div className="ml-7 mt-3 flex justify-center">
                  <div className="flex">
                    <Icon
                      className=" text-lg text-primary-100"
                      icon="gravity-ui:picture"
                    ></Icon>

                    <label className="ml-1 text-sm text-primary-100">
                      Image
                    </label>
                  </div>
                  <div className="ml-[10%] flex">
                    <Icon
                      className=" text-lg text-primary-100"
                      icon="lets-icons:video-light"
                    ></Icon>
                    <label className="ml-1 text-sm text-primary-100">
                      Video
                    </label>
                  </div>
                  <div className="ml-[10%] flex font-light">
                    <Icon
                      className="text-lg text-primary-100"
                      icon="icon-park-outline:emotion-happy"
                    ></Icon>
                    <label className="ml-1 text-sm font-light text-primary-100">
                      Emotion
                    </label>
                  </div>
                </div>
              </div>
              <div className="my-2 flex items-center">
                <hr className="background-light800_dark300 h-px w-full border-0" />
                <div className="flex shrink-0 items-center pl-4">
                  <p className="text-dark100_light500 mr-2">Filter: </p>
                  <Filter
                    filters={HomePageFilters}
                    otherClasses="min-h-[40px] sm:min-w-[140px]"
                    containerClasses=" max-md:flex"
                  />
                </div>
              </div>
              <div className="background-light800_dark400  flex w-full flex-col gap-6">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <PostsCard
                      key={post.id}
                      _id={post.id}
                      author={post.userName}
                      avatar={post.userAvatar}
                      title={post.title}
                      images={post.images}
                      like={post.like}
                      comment={post.comment}
                      createdAt={post.createdAt}
                    />
                  ))
                ) : (
                  <NoResult
                    title="no result"
                    description="No articles found"
                    link="/"
                    linkTitle="Tro lai"
                  />
                )}
              </div>
            </div>
          </div>
        );
      case "friends":
        return (
          <div className="mx-[50px] w-full">
            <div className="flex w-full items-center">
              <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
                Friends
              </div>

              <div className=" ml-[30%] flex grow">
                {" "}
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-11/12 rounded-lg border px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex h-[39px] w-[150px] items-center justify-center rounded-lg border border-primary-100 bg-primary-100 text-white">
                Lời mời kết bạn
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-4 flex space-x-4">
                <button
                  className={`rounded-lg p-2 ${activeTabFriend === "all" ? "bg-primary-100 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveTabFriend("all")}
                >
                  Xem tất
                </button>
                <button
                  className={`rounded-lg p-2 ${activeTabFriend === "recently" ? "bg-primary-100 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveTabFriend("recently")}
                >
                  Gần đây
                </button>
                <button
                  className={`rounded-lg p-2 ${activeTabFriend === "followed" ? "bg-primary-100 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveTabFriend("followed")}
                >
                  Đang theo dõi
                </button>
                <button
                  className={`rounded-lg p-2 ${activeTabFriend === "blocked" ? "bg-primary-100 text-white" : "bg-gray-200"}`}
                  onClick={() => setActiveTabFriend("blocked")}
                >
                  Đã chặn
                </button>
              </div>

              <div className="mx-[100px] mt-10">{renderFriend()}</div>
            </div>
          </div>
        );
      case "photos":
        return (
          <div>
            <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Pictures
            </div>
            <div className="mx-[100px] mt-4 flex flex-wrap gap-4">
              {picturesData.map((image, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={image}
                    alt={`Picture ${index + 1}`}
                    className="mb-2 size-44 rounded-sm object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "videos":
        return (
          <div>
            <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Pictures
            </div>
            <div className="mx-[100px] mt-4 flex flex-wrap gap-4">
              {picturesData.map((image, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={image}
                    alt={`Picture ${index + 1}`}
                    className="mb-2 size-44 rounded-sm object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Chọn một mục để hiển thị nội dung</div>;
    }
  };
  return (
    <div className="background-light800_dark400 h-full pt-20">
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
      {/* <hr className="w-creen mx-[150px]"></hr> */}
      <div className="mx-[100px] my-5">{renderContent()}</div>{" "}
    </div>
  );
}
export default Page;
