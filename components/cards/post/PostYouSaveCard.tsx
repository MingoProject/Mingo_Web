import React, { useState } from "react";
import Image from "next/image";
import { unsavePost } from "@/lib/services/post.service";

const PostYouSaveCard = ({ postYouSave, setListSavePosts }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleUnsave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await unsavePost(postYouSave?._id, token);
        setListSavePosts((prevPosts: any[]) =>
          prevPosts.filter((post) => post._id !== postYouSave?._id)
        );
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-xs md:text-sm">
      <div className="flex flex-1 items-start gap-4 border-b border-gray-200 pb-3">
        <Image
          src={
            postYouSave?.author?.avatar ||
            "https://i.pinimg.com/236x/3d/22/e2/3d22e2269593b9169e7d74fe222dbab0.jpg"
          }
          alt="Avatar"
          width={55}
          height={55}
          className="rounded-full object-cover" // Giới hạn chiều rộng và chiều cao
          style={{ objectFit: "cover", width: "55px", height: "55px" }} // Đảm bảo hình ảnh được cắt đúng theo khung
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex w-full flex-wrap gap-[2px] text-lg md:gap-1">
            <span className="text-lg font-bold">You saved</span> post of{" "}
            <span className="text-lg font-medium">
              {postYouSave?.author.firName} {postYouSave?.author.lastName}
            </span>
          </div>
          <div className="max-h-10 w-full overflow-hidden">
            <span className="line-clamp-2 w-full text-[12px]">
              {postYouSave?.content}
            </span>
          </div>
        </div>
        <p className="text-[30px] " onClick={() => setIsMenuOpen(true)}>
          ...
        </p>
        {isMenuOpen && (
          <div className="background-light700_dark300 absolute right-0 top-6 z-50 w-32 rounded-lg border border-gray-300 shadow-md dark:border-gray-800">
            <button
              className="text-dark100_light500 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:border-gray-800"
              onClick={handleUnsave}
            >
              Unsave
            </button>
            <button
              className="text-dark100_light500 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:border-gray-800"
              onClick={() => setIsMenuOpen(false)} // Đóng menubar
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostYouSaveCard;
