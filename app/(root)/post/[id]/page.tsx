"use client";
import PostsCard from "@/components/cards/post/PostCard";
import { useAuth } from "@/context/AuthContext";
import { getPostByPostId } from "@/lib/services/post.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { id }: any = useParams();
  const [postData, setpostData] = useState<any>(null);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      try {
        const post = await getPostByPostId(id);
        console.log(post);
        if (isMounted) {
          setpostData(post);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      }
    };
    fetchPost();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="background-light800_dark400 mx-auto mt-28 sm:w-full md:w-2/3 lg:w-1/3">
      <PostsCard
        postId={postData?._id}
        author={postData?.author}
        content={postData?.content}
        media={postData?.media}
        createdAt={postData?.createdAt}
        likes={postData?.likes || []}
        comments={postData?.comments || []}
        shares={postData?.shares || []}
        location={postData?.location}
        tags={postData?.tags || []}
        privacy={postData?.privacy}
        profile={profile}
        setPostsData=""
      />
    </div>
  );
};
export default ProfilePage;
