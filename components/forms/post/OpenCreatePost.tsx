"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CreatePost from "./CreatePost";

const OpenCreatePost = ({ me, setPostsData }: any) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  return (
    <>
      <div
        className="background-light200_dark200 h-[126px] w-full rounded-[10px] px-[26px] py-[20px]"
        onClick={toggleForm}
      >
        <div className="flex gap-[9px]">
          <div className="size-[40px] overflow-hidden rounded-full">
            <Image
              src={me?.avatar || "/assets/images/capy.jpg"}
              alt="Avatar"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover"
            />
          </div>
          <input
            type="text"
            placeholder="Share something..."
            className="background-light400_dark400 pl-[15px] py-[10px] h-[40px] w-full rounded-full text-[16px] font-normal text-dark300_light300"
            readOnly
          />
        </div>
        <hr className="my-[13px] background-light300_dark300"></hr>
        <div className=" flex justify-between items-center">
          <div className="flex">
            <span className="text-[16px] font-normal text-dark100_light100">
              Add to your post
            </span>
          </div>
          <div className="ml-[10%] flex gap-[5px]">
            <Icon
              className="text-[20px] text-dark100_light100"
              icon="bx:music"
            />
            <Icon
              className="text-[20px] text-dark100_light100"
              icon="fluent:video-16-regular"
            />
            <Icon
              className="text-[20px] text-dark100_light100"
              icon="stash:image"
            />
          </div>
        </div>
      </div>

      {isFormOpen && (
        <CreatePost
          onClose={() => setIsFormOpen(false)}
          me={me}
          setPostsData={setPostsData}
        />
      )}
    </>
  );
};

export default OpenCreatePost;
