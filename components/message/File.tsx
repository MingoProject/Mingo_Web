import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import RenderFile from "./RenderFile";
import { FileContent } from "@/dtos/MessageDTO";
import { getOrtherList } from "@/lib/services/message.service";

const File = ({ onCancel, boxId }: { onCancel: () => void; boxId: string }) => {
  const [files, setFiles] = useState<FileContent[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFiles = async () => {
      try {
        const data = await getOrtherList(boxId); // Gọi API
        if (isMounted && data) {
          setFiles(data); // Lưu dữ liệu file từ API
        }
      } catch (error) {
        console.error("Error loading files:", error);
      }
    };

    fetchFiles();

    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-full font-sans">
      <div className="h-10 w-full border-b border-gray-200 px-4 flex items-center">
        <Icon
          onClick={onCancel}
          icon="formkit:arrowleft"
          width={20}
          height={20}
          className="text-gray-500 dark:text-white cursor-pointer"
        />
        <p className="text-lg text-center w-full">File</p>
      </div>

      <div className="flex items-center w-full p-4">
        <RenderFile files={files} /> {/* Render danh sách file */}
      </div>
    </div>
  );
};

export default File;
