import React, { useEffect, useState } from "react";
import fakeFriends from "../../../fakeData/FriendsData";
import Image from "next/image";
import PostsCard from "@/components/cards/PostsCard";
import NoResult from "@/components/shared/NoResult";
import OpenCreatePost from "../OpenCreatePost";
import posts from "../../../fakeData/PostsData";
import RenderFriend from "./RenderFriend";
import picturesData from "../../../fakeData/PicturesData";
import FilterPost from "../FilterPost";

const RenderContentPage = ({ activeTab }: any) => {
  const [activeTabFriend, setActiveTabFriend] = useState("all");
  const [selectedFilter, setSelectedFilter] =
    React.useState<string>("Mới nhất");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  useEffect(() => {
    const sortedPosts = [...posts];
    if (selectedFilter === "Mới nhất") {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selectedFilter === "Cũ nhất") {
      sortedPosts.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (selectedFilter === "Hot nhất") {
      sortedPosts.sort((a, b) => b.like.length - a.like.length);
    }
    setFilteredPosts(sortedPosts);
  }, [selectedFilter]);

  switch (activeTab) {
    case "posts":
      return (
        <div className="mx-[15%] flex pt-6">
          <div className="hidden w-5/12 pt-6 lg:block">
            <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Friends
            </div>
            <ul className="mt-5 space-y-4">
              {fakeFriends.map((friend, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <Image
                    width={48}
                    height={48}
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
          <div className="w-full lg:w-7/12">
            <OpenCreatePost />
            <div className="my-2 flex items-center">
              {/* <hr className="background-light700_dark300 h-px w-full border-0" /> */}
              <div className="flex shrink-0 items-center pl-4">
                <p className="text-dark100_light500 mr-2">Filter: </p>
                <FilterPost
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                />
              </div>
            </div>
            <div className="background-light800_dark400  flex w-full flex-col gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostsCard
                    key={post._id}
                    _id={post._id}
                    author={post.author}
                    avatar={post.avatar}
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
        <div className="mx-[8%] w-full">
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

            <div className="mx-[5%] mt-10">
              <RenderFriend activeTabFriend={activeTabFriend} />
            </div>
          </div>
        </div>
      );
    case "photos":
      return (
        <div className="flex justify-center ">
          <div>
            <div className="mx-[8%]  flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Pictures
            </div>
            <div className="mx-[10%] mt-10 flex flex-wrap gap-4">
              {picturesData.map((image, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    width={140}
                    height={140}
                    src={image}
                    alt={`Picture ${index + 1}`}
                    className="mb-2 size-36 rounded-sm object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "videos":
      return (
        <div className="flex justify-center ">
          <div>
            <div className="mx-[8%]  flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Pictures
            </div>
            <div className="mx-[10%] mt-10 flex flex-wrap gap-4">
              {picturesData.map((image, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Image
                    width={140}
                    height={140}
                    src={image}
                    alt={`Picture ${index + 1}`}
                    className="mb-2 size-36 rounded-sm object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    default:
      return <div>Chọn một mục để hiển thị nội dung</div>;
  }
};

export default RenderContentPage;
