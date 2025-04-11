"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { CldImage } from "next-cloudinary";
import React from "react";
import { MediaInfo } from "@/dtos/PostDTO";

interface PostMediaProps {
  media: MediaInfo[];
  onMediaClick: (item: MediaInfo) => void;
}

const PostMedia = ({ media, onMediaClick }: PostMediaProps) => {
  if (!media || media.length === 0) return null;

  return (
    <div className="flex h-auto justify-around">
      <Swiper
        cssMode
        navigation
        mousewheel
        keyboard
        modules={[Navigation, Pagination, Mousewheel, Keyboard]}
        className="h-[400px] w-[500px] flex justify-center items-center"
      >
        {media.map((item, index) => (
          <SwiperSlide key={item.url + index}>
            {item.type === "image" ? (
              <CldImage
                src={item.url}
                width={500}
                height={400}
                alt=""
                className="size-auto mx-auto"
                crop={{ type: "auto", source: true }}
                onClick={() => onMediaClick(item)}
              />
            ) : (
              <video
                width={500}
                height={500}
                className="size-auto mx-auto"
                controls
                onClick={() => onMediaClick(item)}
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PostMedia;
