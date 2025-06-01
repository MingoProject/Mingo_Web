"use client";

import { AudioCall } from "@/components/message/AudioCall";
import { VideoCall } from "@/components/message/VideoCall";
import React from "react";

const page = () => {
  return (
    <div className="relative  text-dark100_light500 background-light700_dark300 flex w-full h-[98vh] border-t border-gray-200 pt-[84px] text-xs md:text-sm">
      <VideoCall />
      <AudioCall />
    </div>
  );
};

export default page;
