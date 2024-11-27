import React from "react";

const Tab = ({ activeTab, setActiveTab }: any) => {
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
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
  );
};

export default Tab;
