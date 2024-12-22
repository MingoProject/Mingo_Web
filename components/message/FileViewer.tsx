import Image from "next/image";
import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";
import { ResponseMessageDTO } from "@/dtos/MessageDTO";

const FileViewer = ({
  hasFiles,
  chat,
}: {
  hasFiles: boolean;
  chat: ResponseMessageDTO;
}) => {
  if (!hasFiles || !chat?.contentId?.url) return null;

  const { url, fileName } = chat.contentId;
  const extension = url?.split(".").pop()?.toLowerCase(); // Lấy phần đuôi file

  const renderContent = () => {
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(
        extension || "" || ""
      )
    ) {
      return (
        <Image
          src={url}
          alt={fileName || "Image"}
          width={300}
          height={300}
          className="rounded-lg"
        />
      );
    }

    if (["mp4", "webm", "ogg"].includes(extension || "")) {
      return (
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height={
            extension === "mp3" || extension === "wav" || extension === "ogg"
              ? "40px"
              : "auto"
          } // Cố định chiều cao cho audio
        />
      );
    }

    if (["mp3", "wav", "ogg"].includes(extension || "")) {
      return (
        <div style={{ height: 2, maxHeight: "10px" }}>
          <ReactAudioPlayer src={url} controls autoPlay={false} volume={0.8} />
        </div>
      );
    }

    if (["pdf"].includes(extension || "")) {
      return (
        <iframe
          src={url}
          width="100%"
          height="600px"
          style={{ border: "none" }}
        ></iframe>
      );
    }

    if (["doc", "docx", "ppt", "pptx"].includes(extension || "")) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${url}&embedded=true`}
          width="100%"
          height="600px"
          style={{ border: "none" }}
        ></iframe>
      );
    }

    // Mặc định: tạo liên kết tải xuống
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-200 underline text-sm"
      >
        {fileName || "Download File"}
      </a>
    );
  };

  return <div className="my-2">{renderContent()}</div>;
};

export default FileViewer;
