import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react";
import { createMedia } from "@/lib/services/media.service";
import { createPost } from "@/lib/services/post.service";
import { PostCreateDTO } from "@/dtos/PostDTO";
import { getMyBffs, getMyFriends } from "@/lib/services/user.service";
import { createNotification } from "@/lib/services/notification.service";

const CreatePost = ({ onClose, me }: any) => {
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>([]);

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
    setTaggedFriends((prev) => {
      if (prev.some((f) => f._id === friend._id)) {
        return prev.filter((f) => f._id !== friend._id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setCaptions((prevCaptions) => [
      ...prevCaptions,
      ...selectedFiles.map(() => ""),
    ]);
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
          console.log(uploadedMedia);
          return uploadedMedia.media._id;
        });

        mediaIds = await Promise.all(uploadPromises);
      }
      console.log("tags", taggedFriends);

      const postPayload: PostCreateDTO = {
        content: content || "",
        media: mediaIds,
        location,
        tags: taggedFriends.map((friend) => friend._id),
        privacy: {
          type: privacy,
        },
      };

      const res = await createPost(postPayload, token);

      if (taggedFriends && taggedFriends.length > 0) {
        for (const friend of taggedFriends) {
          const notificationParams = {
            senderId: me._id,
            receiverId: friend._id,
            type: "tags",
            postId: res._id,
          };

          await createNotification(notificationParams, token);
        }
      }
      alert("Post created successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFriendsDropdown = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    document.getElementById("friendsDropdown")?.classList.toggle("hidden");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="background-light700_dark300 w-1/2 rounded-lg py-6 shadow-md">
          <div className="flex pr-5">
            <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Create post
            </div>
            <Icon
              icon="ic:round-close"
              className="text-dark100_light500 ml-auto size-8"
              onClick={onClose}
            />
          </div>
          <div className="my-7 mb-4 flex items-center px-6">
            <Image
              width={40}
              height={40}
              src={me?.avatar || "/assets/images/capy.jpg"}
              alt="Avatar"
              className="mr-2 size-10 rounded-full"
            />
            <div>
              <span className="text-dark100_light500">
                {me?.firstName} {me?.lastName}
              </span>
              <div>
                <select
                  id="privacy"
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className="background-light800_dark400 rounded-lg px-3 py-2 text-border-color"
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mx-6">
            <div className="mb-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="text-dark100_light500 h-24 w-full bg-transparent p-2"
              />
            </div>
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-primary-100"
              >
                Select Media
              </label>
              <input
                type="file"
                id="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="text-dark100_light500 mt-1 block w-full"
              />
              {files.map((file, index) => (
                <div key={index} className="mt-2 flex items-center space-x-4">
                  <div className="relative">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${file.name}`}
                      width={100}
                      height={100}
                      className="size-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 rounded-full bg-primary-100 p-1 text-white"
                      onClick={() => handleDeleteFile(index)}
                    >
                      <Icon icon="ic:round-close" className="text-white" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Caption"
                    value={captions[index]}
                    onChange={(e) => handleCaptionChange(index, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-primary-100">Add location</span>
              <div className="mb-4 ml-auto">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-dark100_light500 w-full rounded border border-gray-300 bg-transparent p-2"
                />
              </div>
            </div>

            <div className="text-dark100_light500 flex items-center">
              <span className="text-sm text-primary-100">Tag friends</span>
              <div className="relative mb-4 ml-auto">
                <button
                  type="button"
                  className="rounded bg-primary-100 px-4 py-2 text-white"
                  onClick={handleToggleFriendsDropdown}
                >
                  Select Friends
                </button>
                <div
                  id="friendsDropdown"
                  className="background-light800_dark400 absolute right-0 z-10 mt-2 hidden max-h-64 w-64 overflow-y-auto rounded-lg shadow-lg"
                >
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100"
                      onClick={() => toggleTagFriend(friend)}
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
                        width={40}
                        height={40}
                        src={friend?.avatar || "/assets/images/capy.jpg"}
                        alt="Avatar"
                        className="mr-2 size-10 rounded-full"
                      />
                      <span className="">
                        {friend.firstName} {friend.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {taggedFriends.length > 0 && (
              <div className="text-dark100_light500 mt-4">
                <p className="text-sm text-gray-600">Tagged friends:</p>
                <div className="flex flex-wrap">
                  {taggedFriends.map((friend) => (
                    <div
                      key={friend._id}
                      className="m-1 flex items-center rounded-full bg-primary-100 px-3 py-1 text-white"
                    >
                      <Image
                        width={40}
                        height={40}
                        src={friend?.avatar || "/assets/images/capy.jpg"}
                        alt="Avatar"
                        className="mr-2 size-10 rounded-full"
                      />
                      {friend.firstName} {friend.lastName}
                      <button
                        className="ml-2 text-sm"
                        onClick={() => toggleTagFriend(friend)}
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="mt-10 w-full rounded bg-primary-100 p-2 text-white"
              disabled={loading}
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
