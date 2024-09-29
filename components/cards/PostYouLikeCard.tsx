import React from "react";
import Image from "next/image";
import { format } from "date-fns";

interface PostYouLike {
  id: number;
  postContent: string;
  posterAva: string;
  posterName: string;
  like_at: Date;
}

const PostYouLikeCard = ({ postYouLike }: { postYouLike: PostYouLike }) => {
  return (
    <div className="mt-4 flex items-center justify-between text-xs md:text-sm ">
      <div className="flex w-full items-start gap-4 border-b border-gray-200 pb-3">
        <Image
          src={postYouLike.posterAva}
          alt="Avatar"
          width={40}
          height={50}
          className="rounded-full"
        />
        <div className="flex w-full flex-col">
          <div className="flex gap-1">
            <p className="font-semibold">Bảo Ca </p>
            <p>thích ảnh của </p>
            <p className="font-semibold">{postYouLike.posterName}</p>
          </div>

          <div className="max-h-10 overflow-hidden pr-3">
            <span className="line-clamp-3  block text-[9px]">
              {postYouLike.postContent}
            </span>
          </div>
        </div>
      </div>
      <p className="text-[10px]">{format(postYouLike.like_at, "HH:mm")}</p>
    </div>
  );
};

export default PostYouLikeCard;
