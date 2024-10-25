import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const CreatePost = ({ onClose }: any) => {
  const [privacy, setPrivacy] = useState("public");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user") || "{}"; // Giả sử bạn lưu thông tin người dùng dưới dạng JSON trong localStorage
    console.log("user", user);
    if (user) {
      setCurrentUser(JSON.parse(user)); // Chuyển đổi từ chuỗi JSON về đối tượng
    }
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedia(files);
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

    const mediaFiles = media.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
      caption: "",
    }));

    const postData = {
      content,
      mediaFiles,
      location,
      privacy: { type: privacy, allowedUsers: [] },
      author: currentUser, // Thêm thông tin tác giả từ currentUser
    };

    console.log("Post data:", postData); // Log dữ liệu post

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const result = await response.json();
      console.log("Post created:", result);

      // Reset form
      setContent("");
      setMedia([]);
      setLocation("");
      setPrivacy("public");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Error creating post. Please try again.");
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

      <div className=" fixed inset-0 z-50 flex items-center justify-center">
        <div className="background-light700_dark300 w-1/2 rounded-lg py-6 shadow-md">
          <div>
            <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
              Tạo bài viết
            </div>
          </div>
          <div className="my-7 mb-4 flex items-center px-6">
            <Image
              width={40}
              height={40}
              src={currentUser?.avatar || "/path/to/avatar.jpg"}
              alt="Avatar"
              className="mr-2 size-10 rounded-full"
            />
            <div className="">
              <span className="text-dark100_light500">
                {currentUser?.fullname}
              </span>
              <div>
                <select
                  id="privacy"
                  value={privacy}
                  onChange={handlePrivacyChange}
                  className="background-light800_dark400 rounded-lg px-3 py-2 text-[#D9D9D9]"
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
                  className=" p-2"
                />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-dark100_light500">Thêm vị trí</span>
              <div className="mb-4  ml-auto">
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full rounded border border-gray-300 p-2"
                />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-dark100_light500"> Gắn thẻ</span>
              <div className="mb-4 ml-auto"></div>
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
