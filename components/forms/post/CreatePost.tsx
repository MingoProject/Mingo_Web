"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { createMedia } from "@/lib/services/media.service";
import { createPost } from "@/lib/services/post.service";
import { PostCreateDTO, PostResponseDTO } from "@/dtos/PostDTO";
import { getMyBffs, getMyFriends } from "@/lib/services/user.service";
import { createNotification } from "@/lib/services/notification.service";
import NameCard from "@/components/cards/other/NameCard";
import Button from "@/components/ui/button";
import TagFriendCard from "@/components/cards/friend/TagFriendCard";
import TextArea from "@/components/ui/textarea";
import TitleIcon from "@/components/ui/titleIcon";
import Input from "@/components/ui/input";

interface CreatePostProps {
  onClose: () => void;
  me: any;
  setPostsData: React.Dispatch<React.SetStateAction<PostResponseDTO[]>>;
}

const CreatePost = ({ onClose, me, setPostsData }: CreatePostProps) => {
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const friendsData = await getMyFriends(me._id);
        const bffsData = await getMyBffs(me._id);
        const combinedFriends = [...bffsData, ...friendsData];

        const uniqueFriends = combinedFriends.filter(
          (friend, index, self) =>
            index === self.findIndex((f) => f._id === friend._id)
        );

        if (isMounted) {
          setFriends(uniqueFriends);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();
    return () => {
      isMounted = false;
    };
  }, [me._id]);

  const toggleTagFriend = (friend: any) => {
    setTaggedFriends((prev) =>
      prev.some((f) => f._id === friend._id)
        ? prev.filter((f) => f._id !== friend._id)
        : [...prev, friend]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...selectedFiles]);
    setCaptions((prev) => [...prev, ...selectedFiles.map(() => "")]);
  };

  const handleCaptionChange = (index: number, value: string) => {
    setCaptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleDeleteFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setCaptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication is required");
      setLoading(false);
      return;
    }

    try {
      let mediaIds: string[] = [];

      if (files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const caption = captions[index];
          const uploadedMedia = await createMedia(file, caption, token);
          return uploadedMedia.media._id;
        });

        mediaIds = await Promise.all(uploadPromises);
      }

      const postPayload: PostCreateDTO = {
        content: content || "",
        media: mediaIds,
        location,
        tags: taggedFriends.map((friend) => friend._id),
        privacy: { type: privacy },
      };

      const res = await createPost(postPayload, token);

      if (taggedFriends.length > 0) {
        for (const friend of taggedFriends) {
          await createNotification(
            {
              senderId: me._id,
              receiverId: friend._id,
              type: "tags",
              postId: res._id,
            },
            token
          );
        }
      }

      setPostsData((prevPosts) => [
        {
          _id: res._id,
          content: res.content || "",
          media:
            res.media?.map((m) => ({
              _id: String(m._id),
              url: m.url,
              type: m.type,
            })) || [],
          createdAt: new Date(res.createdAt),

          author: {
            _id: me._id,
            firstName: me.firstName,
            lastName: me.lastName,
            avatar: me.avatar,
          },

          shares: [],
          likes: [],
          likedIds: [],
          savedByUsers: [],
          comments: [],
          tags: taggedFriends.map((f) => ({
            _id: f._id,
            firstName: f.firstName,
            lastName: f.lastName,
            avatar: f.avatar,
          })),

          location: location || "",
          flag: true,
          privacy: {
            type: privacy,
            allowedUsers: [],
          },
        } as PostResponseDTO,
        ...prevPosts,
      ]);

      alert("Post created successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex justify-center items-center text-dark100_light100">
        <div className="background-light200_dark200 text-dark100_light100 w-full max-w-2xl max-h-[78vh] overflow-y-auto rounded-lg relative py-6 shadow-lg custom-scrollbar">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <NameCard name="Create Post" />
            <Icon
              icon="ic:round-close"
              className="size-6 cursor-pointer mr-5 "
              onClick={onClose}
            />
          </div>

          {/* Avatar */}
          <div className="flex items-center px-5 gap-3 mb-3">
            <Image
              src={me?.avatar || "/assets/images/capy.jpg"}
              width={40}
              height={40}
              alt="Avatar"
              className="rounded-full object-cover size-10"
            />
            <span className="font-semibold">
              {me?.firstName} {me?.lastName}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-5">
            {/* Content */}

            <TextArea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Media Preview */}
            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <div key={index} className=" rounded-lg relative">
                  <div className="w-full aspect-square relative">
                    {file.type.startsWith("image") ? (
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`media-${index}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                    >
                      <Icon icon="ic:round-close" />
                    </button>
                  </div>
                  <TextArea
                    placeholder="Add notes to media"
                    value={captions[index]}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div>
              <Button
                title="+ Add media"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                size="small"
                className="w-auto"
              />
            </div>

            <div className="flex justify-between items-center ">
              <TitleIcon
                iconSrc="solar:users-group-rounded-linear"
                content="Tag friends"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("friendsDropdown")
                      ?.classList.toggle("hidden")
                  }
                  className="px-3 py-1 rounded text-sm"
                >
                  Select friends
                </button>

                <div
                  id="friendsDropdown"
                  className="hidden absolute right-0 top-full mt-2 background-light400_dark400 shadow-md rounded-md z-10 max-h-60 overflow-y-auto w-64"
                >
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => toggleTagFriend(friend)}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-primary-100"
                    >
                      <input
                        type="checkbox"
                        checked={taggedFriends.some(
                          (f) => f._id === friend._id
                        )}
                        readOnly
                        className="mr-2 text-primary-100"
                      />
                      <Image
                        src={friend.avatar || "/assets/images/capy.jpg"}
                        width={28}
                        height={28}
                        alt="avatar"
                        className="rounded-full mr-2"
                      />
                      <span className="text-sm">
                        {friend.firstName} {friend.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tagged friends display */}
            <div className="flex flex-wrap gap-2">
              {taggedFriends.map((friend) => (
                <div key={friend._id}>
                  <TagFriendCard
                    avatar={friend.avatar}
                    firstName={friend.firstName}
                    lastName={friend.lastName}
                    onClick={() => toggleTagFriend(friend)}
                  />
                </div>
              ))}
            </div>

            {/* Location input */}
            <div className="flex justify-between">
              <TitleIcon
                iconSrc="proicons:location"
                content="Add location"
                className="mt-4"
              />
              <div>
                <Input
                  placeholder="Select location"
                  readOnly={false}
                  cursor="Text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-[166px]"
                />
              </div>
            </div>

            {/* Music line */}
            <div className="flex items-center gap-2 text-primary-100 text-sm mb-6">
              <Icon icon="mdi:music" />
              Dung lam trái tim anh đau
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Submit */}
            <Button
              size="large"
              type="submit"
              disabled={loading}
              className="w-full bg-primary-100 font-semibold py-2 rounded-md"
            >
              {loading ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
