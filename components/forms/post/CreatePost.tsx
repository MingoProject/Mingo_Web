import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Icon } from "@iconify/react";
import { createMedia } from "@/lib/services/media.service";
import { createPost } from "@/lib/services/post.service";
import { MediaResponseDTO } from "@/dtos/MediaDTO";
import { PostCreateDTO } from "@/dtos/PostDTO";

const CreatePost = ({ onClose }: any) => {
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [captions, setCaptions] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setFiles(selectedFiles);
    setCaptions(selectedFiles.map(() => "")); // Reset captions
  };

  const handleCaptionChange = (index: number, value: string) => {
    setCaptions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
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

      // Upload media nếu có
      if (files.length > 0) {
        const uploadPromises = files.map(async (file, index) => {
          const caption = captions[index];
          const uploadedMedia = await createMedia(file, caption, token);
          console.log(uploadedMedia);
          return uploadedMedia.media._id;
        });

        mediaIds = await Promise.all(uploadPromises);
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

      await createPost(postPayload, token);
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
                className="block text-sm font-medium text-gray-700"
              >
                Select Media
              </label>
              <input
                type="file"
                id="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full"
              />
              {files.map((file, index) => (
                <div key={index} className="mt-2">
                  <p className="text-sm">{file.name}</p>
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
              <span className="text-dark100_light500">Thêm vị trí</span>
              <div className="mb-4 ml-auto">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
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
