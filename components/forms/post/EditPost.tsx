import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { editPost, getPostByPostId } from "@/lib/services/post.service";
import { createMedia } from "@/lib/services/media.service";
import { useAuth } from "@/context/AuthContext";
import { getMyBffs, getMyFriends } from "@/lib/services/user.service";

const EditPost = ({
  postId,
  onClose,
  setPostsData,
}: {
  postId: string;
  onClose: () => void;
  setPostsData: any;
}) => {
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [taggedFriends, setTaggedFriends] = useState<any[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchFriends = async () => {
      try {
        const friendsData = await getMyFriends(profile._id);
        const bffsData = await getMyBffs(profile._id);
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
  }, [profile._id]);

  useEffect(() => {
    let isMounted = true;
    const fetchPostDetails = async () => {
      try {
        const post = await getPostByPostId(postId); // Fetch existing post data
        if (isMounted) {
          setContent(post.content || "");
          setLocation(post.location || "");
          setPrivacy(post.privacy.type || "public");
          setTaggedFriends(post.tags || []);
          setExistingMedia(post.media || []);
        }
      } catch (err) {
        console.error("Failed to fetch post details", err);
        setError("Failed to load post details");
      }
    };

    fetchPostDetails();
    return () => {
      isMounted = false;
    };
  }, [postId]);

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

  // const handleCaptionChange = (index: number, value: string) => {
  //   setCaptions((prev) => {
  //     const updated = [...prev];
  //     updated[index] = value;
  //     return updated;
  //   });
  // };

  const handleCaptionChange = (index: number, value: string) => {
    setExistingMedia((prev) => {
      const updatedMedia = [...prev];
      updatedMedia[index].caption = value; // Update caption for the specific media
      return updatedMedia;
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
      console.log("Tagged friends before submitting: ", taggedFriends);
      let mediaIds: string[] = existingMedia.map((media) => media._id);

      if (files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const caption = captions[index];
          const uploadedMedia = await createMedia(file, caption, token);
          return uploadedMedia.media._id;
        });

        const newMediaIds = await Promise.all(uploadPromises);
        mediaIds = [...mediaIds, ...newMediaIds];
      }

      const postPayload = {
        content: content || "",
        media: mediaIds,
        location,
        tags: taggedFriends.map((friend) => friend._id),
        privacy: {
          type: privacy,
        },
      };

      const updatedPost = await editPost(postPayload, postId, token);
      setPostsData((prevPosts: any[]) =>
        prevPosts.map((post) => {
          if (post._id === updatedPost._id) {
            return {
              ...post,
              media: updatedPost.media || post.media,
              content: updatedPost.content || post.content,
              likes: updatedPost.likes || post.likes,
              author: updatedPost.author || post.author,
              tags: updatedPost.tags || post.tags,
              location: updatedPost.location || post.location,
              privacy: updatedPost.privacy || post.privacy,
            };
          }
          return post;
        })
      );
      alert("Post updated successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error updating post");
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
        className="fixed inset-0 z-50 bg-black opacity-50"
        onClick={onClose}
      />
      {/* <div className="fixed inset-0 z-50 flex items-center justify-center"> */}
      <div className="background-light700_dark300 overflow-auto max-h-[90vh] h-[700px] custom-scrollbar mt-10 fixed inset-0 z-50 mx-auto rounded-md py-6 shadow-md lg:w-1/2">
        <div className="flex pr-5">
          <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
            Edit post
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
            src={profile?.avatar || "/assets/images/capy.jpg"}
            alt="Avatar"
            className="mr-2 size-10 rounded-full"
          />
          <div>
            <span className="text-dark100_light500">
              {profile?.firstName} {profile?.lastName}
            </span>
            <div></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-6">
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="text-dark100_light500 h-16 w-full bg-transparent p-2"
            />
          </div>
          <div className="">
            <label
              htmlFor="file"
              className="block  text-sm font-medium text-primary-100"
            >
              Select media
            </label>
            <input
              type="file"
              id="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              className="text-dark100_light500 mt-1 block w-full bg-transparent"
            />
            {/* Hiển thị các media có sẵn */}
            {existingMedia.length > 0 && (
              <div className="">
                {existingMedia.map((media, index) => (
                  <>
                    <div
                      key={index}
                      className="mt-2 flex items-center space-x-4"
                    >
                      <div className="relative">
                        {/* <Image
                          src={media.url}
                          alt={`Existing Media ${index + 1}`}
                          width={100}
                          height={100}
                          className="size-20 rounded-lg object-cover"
                        /> */}
                        {media.type === "video" ? (
                          <video
                            controls
                            className="size-20 rounded-lg object-cover"
                            width={100}
                            height={100}
                          >
                            <source src={media.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={media.url}
                            alt={`Existing Media ${index + 1}`}
                            width={100}
                            height={100}
                            className="size-20 rounded-lg object-cover"
                          />
                        )}
                        <button
                          type="button"
                          className="absolute right-0 top-0 rounded-full bg-primary-100 p-1 text-white"
                          onClick={() =>
                            setExistingMedia((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Icon icon="ic:round-close" className="text-white" />
                        </button>
                      </div>
                      {/* <input
                        type="text"
                        placeholder="Caption"
                        value={media.caption}
                        onChange={(e) =>
                          handleCaptionChange(index, e.target.value)
                        }
                        className=" text-dark100_light500 mt-1 block w-full rounded-md border-gray-300 bg-transparent shadow-sm"
                      /> */}
                      <input
                        type="text"
                        placeholder="Caption"
                        value={media.caption} // Use the updated caption from existing media
                        onChange={(e) =>
                          handleCaptionChange(index, e.target.value)
                        } // Update the caption
                        className="text-dark100_light500 w-full rounded border border-gray-300 bg-transparent p-2"
                      />
                    </div>
                  </>
                ))}
              </div>
            )}

            {/* Thêm media mới */}

            {files.map((file, index) => (
              <div key={index} className="mt-2 flex items-center space-x-4">
                <div className="relative">
                  {/* <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${file.name}`}
                    width={100}
                    height={100}
                    className="size-20 rounded-lg object-cover"
                  /> */}
                  {file.type.startsWith("video") ? (
                    <video
                      controls
                      className="size-20 rounded-lg object-cover"
                      width={100}
                      height={100}
                    >
                      <source
                        src={URL.createObjectURL(file)}
                        type={file.type}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${file.name}`}
                      width={100}
                      height={100}
                      className="size-20 rounded-lg object-cover"
                    />
                  )}
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
                  className="text-dark100_light500 w-full rounded border border-gray-300 bg-transparent p-2"
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
                    className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-black/50"
                    onClick={() => toggleTagFriend(friend)}
                  >
                    <input
                      type="checkbox"
                      checked={taggedFriends.some((f) => f._id === friend._id)}
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
          <button
            type="submit"
            className="mt-10 w-full rounded bg-primary-100 p-2 text-white"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px; /* Độ rộng của thanh cuộn */
            height: 6px; /* Độ cao của thanh cuộn ngang */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(100, 100, 100, 0.8); /* Màu của thanh cuộn */
            border-radius: 10px; /* Bo góc */
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(80, 80, 80, 1); /* Màu khi hover */
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: rgba(230, 230, 230, 0.5); /* Màu nền track */
            border-radius: 10px;
          }
        `}</style>
      </div>
      {/* </div> */}
    </>
  );
};

export default EditPost;
