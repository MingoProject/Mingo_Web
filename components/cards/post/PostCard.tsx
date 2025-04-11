"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DetailPost from "../../forms/post/DetailPost";
import DetailsImage from "../../forms/personalPage/DetailsImage";
import DetailsVideo from "../../forms/personalPage/DetailsVideo";
import { getCommentByCommentId } from "@/lib/services/comment.service";
import { getMediaByMediaId } from "@/lib/services/media.service";
import { PostResponseDTO } from "@/dtos/PostDTO";
import PostHeader from "./PostHeader";
import PostAction from "./PostAction";
import { UserBasicInfo } from "@/dtos/UserDTO";
import { CommentResponseDTO } from "@/dtos/CommentDTO";
import PostMedia from "./PostMedia";
import Input from "@/components/ui/input";

interface PostCardProps {
  post: PostResponseDTO;
  profileBasic: UserBasicInfo;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const PostCard = ({ post, profileBasic, setPostsData }: PostCardProps) => {
  const comments = post?.comments ?? [];
  const likes = post?.likes ?? [];
  const [isLiked, setIsLiked] = useState(false);

  const [numberOfComments, setNumberOfComments] = useState(comments.length);
  const [numberOfLikes, setNumberOfLikes] = useState(likes.length);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [commentsData, setCommentsData] = useState<CommentResponseDTO[]>([]);
  const [commentsMediaData, setCommentsMediaData] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const getComments = async () => {
      const detailsComments: CommentResponseDTO[] = await Promise.all(
        post?.comments.map(async (comment: any) => {
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
  }, [post?.comments]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const isUserLiked = post?.likes.some((like: any) => like === userId);
        setIsLiked(isUserLiked);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [post?.likes]);

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
    <div className="background-light200_dark200 px-[24px] py-[21px] h-auto w-full  rounded-[10px] border shadow-lg dark:border-transparent dark:shadow-none flex flex-col gap-[15px]">
      <PostHeader post={post} setPostsData={setPostsData} />
      <div className="">
        <p className="text-dark100_light100">{post?.content}</p>
      </div>
      {post?.location && (
        <div className=" flex text-primary-100 items-center">
          <Icon icon="mi:location" className="size-[16px]" />
          <span>
            <span className="text-[12px] font-medium">{" - "}</span>

            {post?.location}
          </span>
        </div>
      )}
      {post?.media && post?.media.length > 0 && (
        <PostMedia media={post.media} onMediaClick={handleClick} />
      )}
      <div className="flex flex-col gap-[15px]">
        <PostAction
          post={post}
          userId={profileBasic?._id}
          numberOfLikes={numberOfLikes}
          setNumberOfLikes={setNumberOfLikes}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          numberOfComments={numberOfComments}
        />
        <div className="text-dark100_light100">
          <Input
            avatarSrc={profileBasic?.avatar || "/assets/images/capy.jpg"}
            placeholder="Write a comment"
            readOnly={true}
            cursor="pointer"
            onClick={openModal}
          />
        </div>
        {isModalOpen && (
          <DetailPost
            post={post}
            onClose={closeModal}
            profileBasic={profileBasic}
            numberOfLikes={numberOfLikes}
            setNumberOfLikes={setNumberOfLikes}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
            commentsData={commentsData}
            setCommentsData={setCommentsData}
            setPostsData={setPostsData}
          />
        )}
      </div>
      {selectedImage && (
        <DetailsImage
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          profileUser={post?.author}
          me={profileBasic}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
      {selectedVideo && (
        <DetailsVideo
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          profileUser={post?.author}
          me={profileBasic}
          commentsData={commentsMediaData}
          setCommentsData={setCommentsMediaData}
        />
      )}
    </div>
  );
};

export default PostCard;
