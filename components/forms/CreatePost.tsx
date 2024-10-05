import React, { useEffect, useState } from "react";

const CreatePost = ({ onClose }) => {
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

      <div className="fixed z-50 my-auto flex h-[500px] w-full justify-center">
        <div className="w-[50%] rounded-lg bg-white p-6 shadow-md">
          <div className="mb-4 flex items-center">
            <img
              src={currentUser?.avatar || "/path/to/avatar.jpg"}
              alt="Avatar"
              className="mr-2 size-10 rounded-full"
            />
            <h2 className="text-lg font-semibold">Create a Post</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={content}
                onChange={handleContentChange}
                placeholder="What's on your mind?"
                className="h-24 w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*, video/*"
                multiple
                onChange={handleMediaChange}
                className="rounded border border-gray-300 p-2"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="privacy" className="mr-2">
                Privacy:
              </label>
              <select
                id="privacy"
                value={privacy}
                onChange={handlePrivacyChange}
                className="rounded border border-gray-300 p-2"
              >
                <option value="public">Public</option>
                <option value="friends">Friends</option>
                <option value="private">Private</option>
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
