"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import CreatePost from "../../forms/post/CreatePost";
import Input from "@/components/ui/input";
import { PostResponseDTO } from "@/dtos/PostDTO";

interface OpenCreatePostProps {
  me: any;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}
const OpenCreatePost = ({ me, setPostsData }: OpenCreatePostProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };
  return (
    <>
      <div
        className="background-light200_dark200 shadow-subtle h-[126px] w-full rounded-[10px] px-[26px] py-[20px]"
        onClick={toggleForm}
      >
        <Input
          avatarSrc={me?.avatar || "/assets/images/capy.jpg"}
          placeholder="Share something..."
          readOnly={true}
          cursor="pointer"
          onClick={toggleForm}
        />
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
