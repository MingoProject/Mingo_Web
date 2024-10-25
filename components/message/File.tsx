import React from "react";
import { Icon } from "@iconify/react";
import RenderFile from "./RenderFile";

interface ChatMessage {
  messageId: string;
  senderId: string;
  timestamp: string;
  content: string;
  images: string[];
  videos: string[];
  files: string[]; // Add this to support file attachments
}

// Example messages array
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
    videos: ["https://www.youtube.com/watch?v=oft2kC6xQvw&pp=ygUJaGV5IGRhZGR5"],
    files: [
      "https://docs.google.com/file/d/0B21HoBq6u9TsUHhqS3JIUmFuamc/view?resourcekey=0-MYlet9RIjEukd6CvLEHUbw",
    ],
  },
  {
    messageId: "2",
    senderId: "user2",
    timestamp: "2024-09-29T12:35:00Z",
    content: "Đây là một tin nhắn có video",
    images: [],
    videos: [
      "https://www.youtube.com/watch?v=SutaE3lW_8E&list=RDSutaE3lW_8E&start_radio=1",
    ],
    files: [
      "https://docs.google.com/file/d/0B21HoBq6u9TsUHhqS3JIUmFuamc/view?resourcekey=0-MYlet9RIjEukd6CvLEHUbw",
    ],
  },
  {
    messageId: "3",
    senderId: "user1",
    timestamp: "2024-09-29T12:36:00Z",
    content: "Một tin nhắn khác với hình ảnh và video",
    images: [
      "https://i.pinimg.com/236x/bb/de/7c/bbde7cc71e1d383c5055c776b7ec3419.jpg",
    ],
    videos: ["https://www.youtube.com/watch?v=w28YjHjafy0"],
    files: [
      "https://docs.google.com/document/d/1ca177LnQassw3cOIDF0xaNkvZPDCrZfLtDfW_y1lASo/edit",
    ],
  },
];

const File = ({ onCancel }: { onCancel: () => void }) => {
  const allFiles = messages.flatMap((message) => message.files);
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
        <p className="text-lg text-center w-full">File</p>
      </div>

      <div className="flex items-center w-full p-4">
        <RenderFile files={allFiles} /> {/* Remove semicolon here */}
      </div>
    </div>
  );
};

export default File;
