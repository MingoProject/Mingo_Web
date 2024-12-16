import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import PostYouLikeCard from "../cards/PostYouLikeCard";

const Favorite = ({ onClose, post, setListLikePosts }: any) => {
  // Hàm kiểm tra và phân tích ngày hợp lệ

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Background mờ - khi nhấn vào nền mờ thì đóng component */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="no-scrollbar text-dark100_light500 background-light700_dark300 relative z-10 mt-16 h-[50vh] w-[50vw] overflow-y-auto rounded-2xl shadow-lg">
        <div className="flex size-full flex-col">
          <div className="flex items-center justify-between px-4 py-2 pl-0">
            <span className="rounded-lg rounded-l-none bg-primary-100 p-2 px-4 text-center text-sm text-white ">
              Liked posts
            </span>
            <FontAwesomeIcon
              onClick={onClose}
              icon={faXmark}
              className="mb-2 cursor-pointer"
            />
          </div>
          {post.length > 0 ? (
            post.map((item: any) => (
              <div key={item._id} className="w-full px-4">
                <div className="flex w-full flex-col py-2">
                  <div className="w-full">
                    <PostYouLikeCard
                      key={`${item._id}`}
                      postYouLike={item}
                      setListLikePosts={setListLikePosts}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-4 text-center">
              <p className="text-gray-500">No liked posts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorite;
