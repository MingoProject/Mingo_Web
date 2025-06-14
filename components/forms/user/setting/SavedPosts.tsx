import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import NameCard from "@/components/cards/other/NameCard";
import SavedPostCard from "../../../cards/post/SavedPostCard";
import { PostResponseDTO } from "@/dtos/PostDTO";

interface SavedPostsProps {
  savedPosts: PostResponseDTO[];
  setSavedPosts: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
  onClose: () => void;
}
const SavedPosts = ({
  savedPosts,
  setSavedPosts,
  onClose,
}: SavedPostsProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="background-light200_dark200 max-w-2xl text-dark100_light100 my-32 max-h-screen w-4/5 overflow-y-auto rounded-md py-6 shadow-lg custom-scrollbar">
          <div className="flex size-full flex-col">
            <div className="flex items-center justify-between px-4 py-2 pl-0">
              <NameCard name="Saved Posts" />
              <FontAwesomeIcon
                onClick={onClose}
                icon={faXmark}
                className="mb-2 cursor-pointer size-6"
              />
            </div>

            {savedPosts.length > 0 ? (
              savedPosts.map((item: any) => (
                <div key={item._id} className="px-5">
                  <div>
                    <SavedPostCard
                      key={`${item._id}`}
                      savedPost={item}
                      setSavedPosts={setSavedPosts}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center">
                <p className="Text-dark100_light100">No saved posts</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPosts;
