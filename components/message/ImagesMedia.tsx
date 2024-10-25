import React, { useState } from "react";
import { Icon } from "@iconify/react";
import ImageRender from "./ImageRender";
import VideoRender from "./VideoRender";
interface ChatMessage {
  messageId: string;
  senderId: string;
  timestamp: string;
  content: string;
  images: string[];
  videos: string[]; // Thêm thuộc tính videos
}

const messages: ChatMessage[] = [
  {
    messageId: "1",
    senderId: "user1",
    timestamp: "2024-09-29T12:34:56Z",
    content: "Đây là một tin nhắn có hình ảnh",
    images: [
      "https://i.pinimg.com/236x/1e/a3/9f/1ea39f9a9ff2f0d4a26c6f01635c794a.jpg",
      "https://i.pinimg.com/236x/49/e8/a8/49e8a877294b37f0a16f5ec79b6cb60d.jpg",
    ],
    videos: ["https://www.youtube.com/watch?v=oft2kC6xQvw&pp=ygUJaGV5IGRhZGR5"], // Không có video trong tin nhắn này
  },
  {
    messageId: "2",
    senderId: "user2",
    timestamp: "2024-09-29T12:35:00Z",
    content: "Đây là một tin nhắn có video",
    images: [],
    videos: [
      "https://www.youtube.com/watch?v=SutaE3lW_8E&list=RDSutaE3lW_8E&start_radio=1",
    ], // Tin nhắn chứa video
  },
  {
    messageId: "3",
    senderId: "user1",
    timestamp: "2024-09-29T12:36:00Z",
    content: "Một tin nhắn khác với hình ảnh và video",
    images: [
      "https://i.pinimg.com/236x/bb/de/7c/bbde7cc71e1d383c5055c776b7ec3419.jpg",
    ],
    videos: ["https://www.youtube.com/watch?v=w28YjHjafy0"], // Tin nhắn chứa video
  },
];

const getAllImagesFromChat = (chatMessages: ChatMessage[]) => {
  const allImages: string[] = [];

  chatMessages.forEach((message) => {
    if (message.images && message.images.length > 0) {
      allImages.push(...message.images);
    }
  });

  return allImages;
};

const getAllVideosFromChat = (chatMessages: ChatMessage[]) => {
  const allVideos: string[] = [];

  chatMessages.forEach((message) => {
    if (message.videos && message.videos.length > 0) {
      allVideos.push(...message.videos);
    }
  });

  return allVideos;
};

// Component ImagesMedia
const ImagesMedia = ({ onCancel }: { onCancel: () => void }) => {
  const [activeTab, setActiveTab] = useState("image");

  // Lấy tất cả hình ảnh từ đoạn chat
  const imagesInChat = getAllImagesFromChat(messages);
  const videosInChat = getAllVideosFromChat(messages);

  const RenderTag = () => {
    switch (activeTab) {
      case "image":
        return <ImageRender images={imagesInChat} />; // Truyền hình ảnh vào
      case "video":
        return <VideoRender videos={videosInChat} />;
      default:
        return <ImageRender images={imagesInChat} />;
    }
  };

  return (
    <div className="flex flex-col w-full h-full font-sans">
      <div className="h-10 w-full border-b border-gray-200 px-4 flex items-center">
        <Icon
          onClick={onCancel}
          icon="formkit:arrowleft"
          width={20}
          height={20}
          className="text-gray-500 dark:text-white"
        />
        <p className="text-lg text-center w-full">Phương tiện</p>
      </div>

      <div className="flex items-center w-full p-4">
        <div
          onClick={() => setActiveTab("image")}
          className={`flex w-1/2 justify-center cursor-pointer items-center gap-1 ${
            activeTab === "image"
              ? " text-primary-100 opacity-100 border-b border-primary-100"
              : "opacity-40"
          }`}
        >
          Hình ảnh
        </div>
        <div
          onClick={() => setActiveTab("video")}
          className={`flex w-1/2 justify-center cursor-pointer items-center gap-1 ${
            activeTab === "video"
              ? " text-primary-100 opacity-100 border-b border-primary-100"
              : "opacity-40"
          }`}
        >
          Video
        </div>
      </div>
      {RenderTag()}
    </div>
  );
};

export default ImagesMedia;
