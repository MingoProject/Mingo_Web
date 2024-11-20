import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react";
import { createMedia } from "@/lib/services/media.service"; // Import hàm API
import { createPost } from "@/lib/services/post.service"; // Import hàm API
import { MediaCreateDTO } from "@/dtos/MediaDTO";
import { PostCreateDTO } from "@/dtos/PostDTO";

const CreatePost = ({ onClose }: any) => {
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia(files); // Giữ các file gốc
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrivacy(e.target.value);
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

    const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

    try {
      let mediaIds: string[] = [];
      // Upload media nếu có
      if (media.length > 0) {
        const mediaUploadPromises = media.map(async (file) => {
          const formData = new FormData();
          formData.append("url", file); // Đặt tên phù hợp với backend
          formData.append(
            "type",
            file.type.includes("image") ? "image" : "video"
          );
          formData.append("caption", ""); // Caption mặc định

          const uploadedMedia = await createMedia(formData, jwtToken);
          return uploadedMedia._id;
        });
        

        mediaIds = await Promise.all(mediaUploadPromises);
      }

      // Tạo post
      const postPayload: PostCreateDTO = {
        content,
        media: mediaIds,
        location,
        privacy: {
          type: privacy,
        },
      };

      await createPost(postPayload, jwtToken);
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
      <div
        className="fixed inset-0 z-40 bg-black opacity-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="background-light700_dark300 w-1/2 rounded-lg py-6 shadow-md">
          <div className="flex">
            <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Tạo bài viết
            </div>
            <Icon
              icon="ic:round-close"
              className="text-dark100_light500 ml-auto"
              onClick={onClose}
            />
          </div>
          <div className="my-7 mb-4 flex items-center px-6">
            <Image
              width={40}
              height={40}
              src={currentUser?.avatar || "/path/to/avatar.jpg"}
              alt="Avatar"
              className="mr-2 size-10 rounded-full"
            />
            <div>
              <span className="text-dark100_light500">
                {currentUser?.fullname}
              </span>
              <div>
                <select
                  id="privacy"
                  value={privacy}
                  onChange={handlePrivacyChange}
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
                onChange={handleContentChange}
                placeholder="What's on your mind?"
                className="text-dark100_light500 h-24 w-full bg-transparent p-2"
              />
            </div>
            <div className="flex items-center">
              <span className="text-dark100_light500">Thêm ảnh/video</span>
              <div className="mb-4 ml-auto">
                <input
                  type="file"
                  accept="image/*, video/*"
                  multiple
                  onChange={handleMediaChange}
                  className="p-2"
                />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-dark100_light500">Thêm vị trí</span>
              <div className="mb-4 ml-auto">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="mt-5 w-full rounded bg-primary-100 p-2 text-white"
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
