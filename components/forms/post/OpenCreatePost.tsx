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
        className="background-light700_dark300 h-[135px] w-full rounded-md border px-2 shadow-lg dark:border-transparent dark:shadow-none"
        onClick={toggleForm}
      >
        <div className="mx-[1%] pl-4 pt-6">
          <div className="flex">
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
              placeholder="    Share something..."
              className="background-light800_dark400 ml-3 h-[40px] w-full rounded-full text-base"
              readOnly
            />
          </div>
        </div>

        <div className="ml-7 mt-3 flex justify-center">
          <div className="flex">
            <Icon
              className="text-lg text-primary-100"
              icon="gravity-ui:picture"
            />
            <label className="ml-1 text-sm text-primary-100">Image</label>
          </div>
          <div className="ml-[10%] flex">
            <Icon
              className="text-lg text-primary-100"
              icon="lets-icons:video-light"
            />
            <label className="ml-1 text-sm text-primary-100">Video</label>
          </div>
          <div className="ml-[10%] flex font-light">
            <Icon
              className="text-lg text-primary-100"
              icon="icon-park-outline:emotion-happy"
            />
            <label className="ml-1 text-sm font-light text-primary-100">
              Emotion
            </label>
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
