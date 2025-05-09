import React, { useState } from "react";
import Image from "next/image";
import { unsavePost } from "@/lib/services/post.service";
import { PostResponseDTO } from "@/dtos/PostDTO";
import { Icon } from "@iconify/react/dist/iconify.js";
import DropdownMenu from "@/components/ui/dropdownMenu";

interface SavedPostCardProps {
  savedPost: PostResponseDTO;
  setSavedPosts: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}
const SavedPostCard = ({ savedPost, setSavedPosts }: SavedPostCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleUnsave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await unsavePost(savedPost?._id, token);
        setSavedPosts((prevPosts: any[]) =>
          prevPosts.filter((post) => post._id !== savedPost?._id)
        );
      } else {
        console.warn("User is not authenticated");
      }
    } catch (error) {
      console.error("Error in handleLikePost:", error);
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: "Unsave", onClick: handleUnsave },
    { label: "Cancel", onClick: () => setIsMenuOpen(false) },
  ];

  return (
    <div className="relative mt-4 flex items-center justify-between gap-3 text-xs md:text-sm">
      <div className="flex flex-1 items-start gap-4 pb-3">
        <Image
          src={
            savedPost?.author?.avatar ||
            "https://i.pinimg.com/236x/3d/22/e2/3d22e2269593b9169e7d74fe222dbab0.jpg"
          }
          alt="Avatar"
          width={55}
          height={55}
          className="rounded-full object-cover"
          style={{ objectFit: "cover", width: "55px", height: "55px" }}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex w-full flex-wrap gap-[2px] md:gap-1">
            <span className="text-[16px] font-medium">
              You saved post of{" "}
              <span className="text-[16px] font-semibold">
                {savedPost?.author.firstName} {savedPost?.author.lastName}
              </span>
            </span>
          </div>
          <div className="max-h-10 w-full overflow-hidden mt-2">
            <span className="line-clamp-2 w-full text-[16px]">
              {savedPost?.content}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <Icon
          icon="ph:dots-three-bold"
          width="24"
          height="24"
          onClick={() => setIsMenuOpen(true)}
          className="cursor-pointer"
        />
        {isMenuOpen && (
          <DropdownMenu
            items={menuItems}
            onClose={() => setIsMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default SavedPostCard;
