"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import DetailPost from "../forms/post/DetailPost";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import PostMenu from "../forms/post/PostMenu";
import TagModal from "../forms/post/TagModal";
import DetailsImage from "../forms/personalPage/DetailsImage";
import DetailsVideo from "../forms/personalPage/DetailsVideo";
import Action from "../forms/post/Action";
import { getCommentByCommentId } from "@/lib/services/comment.service";
import { getMediaByMediaId } from "@/lib/services/media.service";

const PostsCard = ({
  postId,
  author,
  content,
  media,
  createdAt,
  likes,
  comments,
  shares,
  location,
  tags,
  privacy,
  profile,
  setPostsData,
}: {
  postId: string;
  author: any;
  content: string;
  media: any[] | undefined;
  createdAt: Date;
  likes: any[];
  comments: any[];
  shares: any[];
  location?: string;
  tags: any[];
  privacy: {
    type: string;
    allowedUsers?: any[];
  };
  profile: any;
  setPostsData: any;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(comments.length);
  const [menuModal, setMenuModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [likesCount, setLikesCount] = useState(likes.length);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [commentsMediaData, setCommentsMediaData] = useState<any[]>([]);

  const handleTagsModalToggle = () => {
    setIsTagsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    let isMounted = true;
    const getComments = async () => {
      const detailsComments = await Promise.all(
        comments.map(async (comment: any) => {
          return await getCommentByCommentId(comment);
        })
      );

      if (isMounted) {
        setCommentsData(detailsComments);
      }
    };

    getComments();

    return () => {
      isMounted = false;
    };
  }, [comments]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const isUserLiked = likes.some((like: any) => like === userId);
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [likes]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleClick = async (item: any) => {
    console.log(item.type);
    try {
      if (item.type === "image") {
        const data = await getMediaByMediaId(item._id);
        const detailsComments = await Promise.all(
          data.comments.map(async (comment: any) => {
            return await getCommentByCommentId(comment);
          })
        );
        setCommentsMediaData(detailsComments);
        setSelectedImage(data);
      } else {
        const data = await getMediaByMediaId(item._id);
        const detailsComments = await Promise.all(
          data.comments.map(async (comment: any) => {
            return await getCommentByCommentId(comment);
          })
        );
        setCommentsMediaData(detailsComments);
        setSelectedVideo(data);
      }
    } catch (error) {
      console.error("Error loading image details:", error);
    }
  };

  return (
    <div className="background-light200_dark200 h-auto w-full  rounded-[10px] border shadow-lg dark:border-transparent dark:shadow-none">
      <div className="ml-4 mt-3 flex items-center">
        <div className="flex items-center">
          <Link href={`/profile/${author?._id || null}`}>
            <Image
              src={author?.avatar ? author.avatar : "/assets/images/capy.jpg"}
              alt="Avatar"
              width={45}
              height={45}
              className="size-11 rounded-full object-cover"
            />
          </Link>
          <div>
            <span className="text-dark100_light100 ml-3 text-base">
              {author?.firstName ? author.firstName : ""}{" "}
              {author?.lastName ? author.lastName : ""}
              {tags?.length > 0 && (
                <span>
                  <span className="">{" with "}</span>
                  {tags.slice(0, 2).map((tag, index) => (
                    <Link href={`/profile/${tag._id}`} key={tag._id}>
                      <span
                        key={tag._id}
                        className="cursor-pointer text-dark100_light100"
                      >
                        {tag?.firstName}
                        {index < tags.slice(0, 2).length - 1 ? ", " : ""}
                      </span>
                    </Link>
                  ))}
                  {tags?.length > 2 && (
                    <span
                      className="cursor-pointer text-primary-100"
                      onClick={handleTagsModalToggle}
                    >
                      {` và ${tags.length - 2} người khác`}
                    </span>
                  )}
                </span>
              )}
              {location && (
                <div className="ml-2 flex">
                  <Icon icon="mi:location" className="" />
                  <span>
                    <span className="">{" - "}</span>

                    {location}
                  </span>
                </div>
              )}
              <TagModal
                tags={tags}
                isOpen={isTagsModalOpen}
                onClose={handleTagsModalToggle}
              />
            </span>
            <hr className="border-transparent bg-transparent"></hr>
            <span className="text-dark100_light500 ml-3 text-sm">
              {createdAt && getTimestamp(createdAt)}
            </span>
          </div>
        </div>
        <div className="ml-auto pb-2 pr-4">
          <Icon
            icon="tabler:dots"
            onClick={() => setMenuModal(true)}
            className="text-dark100_light500"
          />
        </div>
        <div ref={menuRef}>
          {menuModal && (
            <PostMenu
              postId={postId}
              author={author}
              content={content}
              media={media}
              createdAt={createdAt}
              likes={likes || []}
              comments={comments || []}
              shares={shares || []}
              location={location}
              privacy={privacy}
              onClose={() => setMenuModal(false)}
              setPostsData={setPostsData}
            />
          )}
        </div>
      </div>
      <div className="ml-4 mt-5">
        <p className="text-dark100_light500">{content}</p>
      </div>
      {media && media.length > 0 && (
        <div className=" mx-5 mt-3 flex h-auto justify-around">
          <Swiper
            cssMode={true}
            navigation={true}
            mousewheel={true}
            keyboard={true}
            modules={[Navigation, Pagination, Mousewheel, Keyboard]}
            className="h-auto w-[400px] flex justify-center items-center"
          >
            {media.map((item, index) => (
              <SwiperSlide key={item.url + index}>
                {item.type === "image" ? (
                  <>
                    <CldImage
                      src={item.url} // Use this sample image or upload your own via the Media Explorer
                      width="500" // Transform the image: auto-crop to square aspect_ratio
                      height="500"
                      alt=""
                      className="h-[250px] w-[250px] mx-auto"
                      crop={{
                        type: "auto",
                        source: true,
                      }}
                      onClick={() => handleClick(item)}
                    />
                  </>
                ) : (
                  <>
                    <video
                      width={250}
                      height={250}
                      className="h-[250px] mx-auto"
                      controls
                      onClick={() => handleClick(item)}
                    >
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <div className="mx-10 my-5">
        <Action
          likes={likes}
          postId={postId}
          comments={comments}
          shares={shares}
          author={author}
          profile={profile}
          likesCount={likesCount}
          setLikesCount={setLikesCount}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          numberOfComments={numberOfComments}
        />
        <hr className="background-light800_dark400 mt-2 h-px w-full border-0" />
        <div className="text-dark100_light500 my-3">
          <span className="text-dark100_light500">Comment</span>
          <div className="mx-[1%] pl-4 pt-2">
            <div className="flex" onClick={openModal}>
              <div className="w-12 overflow-hidden rounded-full">
                <Image
                  src={
                    profile?.avatar ? profile.avatar : "/assets/images/capy.jpg"
                  }
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="    Write a comment..."
                className="background-light800_dark400 text-dark100_light500 ml-3 h-[40px] w-full rounded-full text-base"
                readOnly
              />
            </div>
          </div>
        </div>
        {isModalOpen && (
          <DetailPost
            postId={postId}
            author={author}
            content={content}
            media={media}
            createdAt={createdAt}
            likes={likes}
            comments={comments}
            shares={shares}
            privacy={privacy}
            tags={tags}
            onClose={closeModal}
            profile={profile}
            likesCount={likesCount}
            setLikesCount={setLikesCount}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            commentsData={commentsData}
            setCommentsData={setCommentsData}
          />
        )}
      </div>
      {selectedImage && (
        <DetailsImage
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          profileUser={author}
          me={profile}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
      {selectedVideo && (
        <DetailsVideo
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          profileUser={author}
          me={profile}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
    </div>
  );
};

export default PostsCard;
