import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import React from "react";
import PostYouSaveCard from "../cards/PostYouSaveCard";

interface PostYouLike {
  id: number;
  user_id: number;
  post_id: number;
  created_at: Date;
  posts: {
    id: number;
    postContent: string;
    posterAva: string;
    posterName: string;
    like_at: Date;
  }[];
}

interface FavoritePose {
  onClose: () => void;
  posts: PostYouLike[];
}

const Save = ({ onClose, posts }: FavoritePose) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Background mờ - khi nhấn vào nền mờ thì đóng component */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar text-dark100_light500 background-light700_dark300 relative z-10  mt-16 h-[50vh] w-[50vw]  overflow-y-auto rounded-2xl shadow-lg ">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none bg-primary-100 p-2 px-4 text-center text-sm text-white ">
              Bài viết đã lưu
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2 cursor-pointer"
            />
          </div>
          {posts.map((item) => (
            <div key={item.id} className="px-4">
              <div className="flex w-full flex-col  py-2">
                <p className="text-sm ">
                  {format(item.created_at, "dd-MM-yyyy")}
                </p>
                <div>
                  {item.posts.map((it) => (
                    <PostYouSaveCard key={it.id} postYouLike={it} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Save;
