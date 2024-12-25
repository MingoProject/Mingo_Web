import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import ImageRender from "./ImageRender";
import VideoRender from "./VideoRender";
import { getImageList, getVideoList } from "@/lib/services/message.service";
import { FileContent } from "@/dtos/MessageDTO";

const getAllImagesFromChat = (chatMessages: FileContent[]) => {
  return chatMessages.filter((message) => message.type === "Image");
};

const getAllVideosFromChat = (chatMessages: FileContent[]) => {
  return chatMessages.filter((message) => message.type === "Video");
};

const ImagesMedia = ({
  onCancel,
  boxId,
}: {
  onCancel: () => void;
  boxId: string;
}) => {
  const [activeTab, setActiveTab] = useState("image");
  const [messages, setMessages] = useState<FileContent[]>([]);
  const [videoList, setVideoList] = useState<FileContent[]>([]);

  useEffect(() => {
    let isMounted = true;

    const myChat = async () => {
      try {
        const data = await getImageList(boxId); // Gọi API
        if (isMounted && data) {
          setMessages(data); // Lưu trực tiếp `messages` từ API
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }

      try {
        const data = await getVideoList(boxId); // Gọi API
        if (isMounted && data) {
          setVideoList(data); // Lưu trực tiếp `messages` từ API
        }
      } catch (error) {
        console.error("Error loading chat:", error);
      }
    };

    myChat();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [boxId]);

  const imagesInChat = getAllImagesFromChat(messages);
  const videosInChat = getAllVideosFromChat(videoList);

  const RenderTag = () => {
    switch (activeTab) {
      case "image":
        return <ImageRender images={imagesInChat} />;
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
        <p className="text-lg text-center w-full">Media</p>
      </div>

      <div className="flex items-center w-full p-4">
        <div
          onClick={() => setActiveTab("image")}
          className={`flex w-1/2 justify-center cursor-pointer items-center gap-1 ${
            activeTab === "image"
              ? "text-primary-100 opacity-100 border-b border-primary-100"
              : "opacity-40"
          }`}
        >
          Images
        </div>
        <div
          onClick={() => setActiveTab("video")}
          className={`flex w-1/2 justify-center cursor-pointer items-center gap-1 ${
            activeTab === "video"
              ? "text-primary-100 opacity-100 border-b border-primary-100"
              : "opacity-40"
          }`}
        >
          Videos
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">{RenderTag()}</div>
    </div>
  );
};

export default ImagesMedia;
