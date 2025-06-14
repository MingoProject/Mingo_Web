"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { editPost, getPostByPostId } from "@/lib/services/post.service";
import { createMedia } from "@/lib/services/media.service";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/services/user.service";
import NameCard from "@/components/cards/other/NameCard";
import Button from "@/components/ui/button";
import TextArea from "@/components/ui/textarea";
import TitleIcon from "@/components/ui/titleIcon";
import TagFriendCard from "@/components/cards/friend/TagFriendCard";
import Input from "@/components/ui/input";

const EditPost = ({ postId, onClose, setPostsData }: any) => {
  const { profile } = useAuth();
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPostByPostId(postId).then((post) => {
      setContent(post.content || "");
      setLocation(post.location || "");
      setPrivacy(post.privacy.type || "public");
      setTaggedFriends(post.tags || []);
      setExistingMedia(post.media || []);
    });

    const fetchFriends = async () => {
      const friendsData = await getMyFriends(profile._id);
      const bffsData = await getMyBffs(profile._id);
      const combined = [...bffsData, ...friendsData];
      const unique = combined.filter(
        (f, i, arr) => i === arr.findIndex((x) => x._id === f._id)
      );
      setFriends(unique);
    };

    fetchFriends();
  }, [postId, profile._id]);

  const toggleTagFriend = (friend: any) => {
    setTaggedFriends((prev) =>
      prev.some((f) => f._id === friend._id)
        ? prev.filter((f) => f._id !== friend._id)
        : [...prev, friend]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prev) => [...prev, ...selected]);
    setCaptions((prev) => [...prev, ...selected.map(() => "")]);
  };

  const handleCaptionChange = (index: number, value: string) => {
    if (index < existingMedia.length) {
      setExistingMedia((prev) => {
        const updated = [...prev];
        updated[index].caption = value;
        return updated;
      });
    } else {
      const newIndex = index - existingMedia.length;
      setCaptions((prev) => {
        const updated = [...prev];
        updated[newIndex] = value;
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication is required");
      return setLoading(false);
    }

    try {
      let mediaIds = existingMedia.map((m) => m._id);
      const uploads = await Promise.all(
        files.map((file, i) => createMedia(file, captions[i], token))
      );
      mediaIds.push(...uploads.map((m) => m.media._id));

      const payload = {
        content,
        location,
        media: mediaIds,
        tags: taggedFriends.map((f) => f._id),
        privacy: { type: privacy },
      };

      const updated = await editPost(payload, postId, token);
      setPostsData((prev: any[]) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      alert("Post updated successfully!");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error updating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="background-light200_dark200 text-dark100_light100 w-full max-w-2xl max-h-[78vh] overflow-y-auto rounded-lg py-6 shadow-lg custom-scrollbar">
          <div className="flex items-center justify-between pr-5 mb-4">
            <NameCard name="Edit Post" />
            <Icon
              icon="ic:round-close"
              className="cursor-pointer size-6"
              onClick={onClose}
            />
          </div>

          <div className="flex items-center px-5 gap-3 mb-3">
            <Image
              src={profile?.avatar || "/assets/images/capy.jpg"}
              width={40}
              height={40}
              alt="Avatar"
              className="rounded-full object-cover size-10"
            />
            <span className="font-semibold">
              {profile?.firstName} {profile?.lastName}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-5">
            <TextArea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex overflow-x-auto gap-4 custom-scrollbar py-2">
              {[...existingMedia, ...files].map((media, index) => {
                const isExisting = index < existingMedia.length;
                const src = isExisting ? media.url : URL.createObjectURL(media);
                const type = isExisting ? media.type : media.type;

                return (
                  <div
                    key={index}
                    className="min-w-[200px] max-w-[200px] flex-shrink-0"
                  >
                    <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                      {type.startsWith("image") ? (
                        <Image
                          src={src}
                          alt="media"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={src}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (isExisting) {
                            setExistingMedia((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          } else {
                            const idx = index - existingMedia.length;
                            setFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                            setCaptions((prev) =>
                              prev.filter((_, i) => i !== idx)
                            );
                          }
                        }}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 z-10"
                      >
                        <Icon icon="ic:round-close" />
                      </button>
                    </div>
                    <TextArea
                      placeholder="Add notes to media"
                      value={
                        isExisting
                          ? media.caption
                          : captions[index - existingMedia.length] || ""
                      }
                      onChange={(e) =>
                        handleCaptionChange(index, e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>
                );
              })}
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

            <div className="flex justify-between items-center">
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
                  className="hidden right-0 absolute background-light400_dark400 shadow-md rounded-md z-10 max-h-60 overflow-y-auto w-64"
                >
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => toggleTagFriend(friend)}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={taggedFriends.some(
                          (f) => f._id === friend._id
                        )}
                        readOnly
                        className="mr-2"
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

            <div className="flex flex-wrap gap-2">
              {taggedFriends.map((friend) => (
                <TagFriendCard
                  key={friend._id}
                  avatar={friend.avatar}
                  firstName={friend.firstName}
                  lastName={friend.lastName}
                  onClick={() => toggleTagFriend(friend)}
                />
              ))}
            </div>

            <div className="flex justify-between items-center">
              <TitleIcon
                iconSrc="proicons:location"
                content="Add location"
                className="mt-4"
              />
              <div>
                <Input
                  placeholder="Select location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-[166px]"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              size="large"
              type="submit"
              disabled={loading}
              className="w-full bg-primary-100 font-semibold py-2 rounded-md"
            >
              {loading ? "Updating..." : "Update Post"}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;
