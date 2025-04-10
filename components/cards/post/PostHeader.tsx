import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import TagModal from "@/components/forms/post/TagModal";
import { getTimestamp } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import PostMenu from "@/components/forms/post/PostMenu";
import { PostResponseDTO } from "@/dtos/PostDTO";

interface PostHeaderProps {
  post: PostResponseDTO;
  handleTagsModalToggle: () => void;
  isTagsModalOpen: boolean;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const PostHeader = ({
  post,
  handleTagsModalToggle,
  isTagsModalOpen,
  setPostsData,
}: PostHeaderProps) => {
  const tags = post?.tags ?? [];
  const [menuModal, setMenuModal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
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
  return (
    <div className=" flex items-center">
      <div className="flex items-center gap-[15px]">
        <Link href={`/profile/${post?.author?._id || null}`}>
          <Image
            src={
              post?.author?.avatar
                ? post?.author.avatar
                : "/assets/images/capy.jpg"
            }
            alt="Avatar"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        </Link>
        <div>
          <span className="text-dark100_light100 text-[16px] font-medium">
            {post?.author?.firstName ? post?.author.firstName : ""}{" "}
            {post?.author?.lastName ? post?.author.lastName : ""}
            {tags.length > 0 && (
              <span className="text-[16px] font-normal">
                {" with "}
                {tags.slice(0, 2).map((tag: any, index: number) => (
                  <Link href={`/profile/${tag?._id}`} key={tag?._id}>
                    <span className="cursor-pointer text-dark100_light100">
                      {tag?.firstName} {tag?.lastName}
                      {index < Math.min(2, tags.length) - 1 ? ", " : ""}
                    </span>
                  </Link>
                ))}

                {tags.length > 2 && (
                  <span
                    className="cursor-pointer text-primary-100"
                    onClick={handleTagsModalToggle}
                  >
                    {` và ${tags.length - 2} người khác`}
                  </span>
                )}
              </span>
            )}
            <TagModal
              tags={tags}
              isOpen={isTagsModalOpen}
              onClose={handleTagsModalToggle}
            />
          </span>
          <hr className="border-transparent bg-transparent"></hr>
          <span className="text-dark100_light100 text-[12px] font-normal">
            {post?.createdAt && getTimestamp(post?.createdAt)}
          </span>
        </div>
      </div>
      <div className="ml-auto pb-2">
        <Icon
          icon="tabler:dots"
          onClick={() => setMenuModal(true)}
          className="text-dark100_light100 size-[24px]"
        />
      </div>
      <div ref={menuRef}>
        {menuModal && (
          <PostMenu
            post={post}
            onClose={() => setMenuModal(false)}
            setPostsData={setPostsData}
          />
        )}
      </div>
    </div>
  );
};

export default PostHeader;
