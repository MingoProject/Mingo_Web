import React from "react";
import Image from "next/image";
import Metric from "../shared/Metric";
import { getTimestamp } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
interface image {
  id: number;
  url: string;
}

interface Comment {
  text: string;
  user: string;
}

interface PostProps {
  _id: number;
  author: string;
  avatar: string;
  title: string;
  images: image[];
  like: string[];
  comment: Comment[];
  createdAt: Date;
}

const PostsCard = ({
  _id,
  author,
  avatar,
  title,
  images,
  like,
  comment,
  createdAt,
}: PostProps) => {
  return (
    <div className="background-light700_dark300 h-auto rounded-lg border border-none">
      <div className="ml-4 mt-3 flex items-center">
        <Image
          src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
          alt="Avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
        <div>
          <p className="text-dark100_light500 ml-3 text-base">{author}</p>
          <span className="text-dark100_light500 ml-3 text-sm">
            {getTimestamp(createdAt)}
          </span>
        </div>
      </div>
      <div className="ml-4 mt-5">
        <p className="text-dark100_light500">{title}</p>
      </div>
      <div className="mx-5 mt-3 flex h-[260px] justify-around">
        {/* <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          className="size-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                src={img.url}
                alt={`Image ${index + 1}`}
                width={250}
                height={250}
                className="size-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper> */}
      </div>
      <div className="mx-3 my-5">
        <div className="flex">
          <Icon icon="ic:baseline-favorite-border" />
          <Icon icon="mingcute:message-4-line" />
        </div>

        <hr className="background-light500_dark100 h-px w-full border-0" />
        {/* <div className="my-2 flex justify-around">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Uplikes"
            value={like.length}
            title=" Likes"
            textStyles="small-medium text-dark100_light500"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Comment"
            value={comment.length}
            title=" Comments"
            textStyles="small-medium text-dark100_light500"
          />
        </div>
        <hr className="background-light500_dark100 h-px w-full border-0" /> */}
      </div>
    </div>
  );
};

export default PostsCard;
