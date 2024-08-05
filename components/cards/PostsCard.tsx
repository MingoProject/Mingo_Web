import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

interface image {
  id: number;
  img1: string;
  img2: string;
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
  images: image;
  like: string[];
  comment: Comment[];
  createdAt: string;
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
      <div className="ml-3 mt-3 flex items-center">
        <Image
          src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
          alt="Avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
        <p className="text-dark100_light500 ml-3 text-xl">{author}</p>
      </div>
      <div className="ml-3 mt-5">
        <p className="text-dark100_light500">{title}</p>
      </div>
      <div className="mx-5 mt-3 flex h-[260px] justify-around">
        <Image src={images.img1} alt={images.img1} width={250} height={250} />
        <Image src={images.img2} alt={images.img2} width={250} height={250} />
      </div>
      <div className="mx-3 my-5">
        <hr className="background-light500_dark100 h-px w-full border-0" />
        <div className="my-2 flex justify-around">
          <div className="flex">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-dark100_light500 mr-2"
            />
            <p className="text-dark100_light500">{like.length} lượt thích</p>
          </div>
          <div className="flex">
            <FontAwesomeIcon
              icon={faComment}
              className="text-dark100_light500 mr-2"
            />
            <p className="text-dark100_light500">{comment.length} bình luận </p>
          </div>
        </div>
        <hr className="background-light500_dark100 h-px w-full border-0" />
      </div>
    </div>
  );
};

export default PostsCard;
