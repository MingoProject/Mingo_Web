import React from "react";
import {
  faFilePdf,
  faFileWord,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileContent } from "@/dtos/MessageDTO";

const RenderFile = ({ files }: { files: FileContent[] }) => {
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {files.map((file, index) => {
        // Extract the file extension from the fileName
        const fileExtension = file.fileName.split(".").pop()?.toLowerCase();

        let icon;

        // Determine the icon based on the file extension
        switch (fileExtension) {
          case "pdf":
            icon = (
              <FontAwesomeIcon
                className="w-5 h-5 text-red-600"
                icon={faFilePdf}
              />
            );
            break;
          case "doc":
          case "docx":
            icon = (
              <FontAwesomeIcon
                className="w-5 h-5 text-blue-600"
                icon={faFileWord}
              />
            );
            break;
          default:
            icon = (
              <FontAwesomeIcon
                className="w-5 h-5 text-gray-600"
                icon={faFile}
              />
            );
        }

        return (
          <div key={index} className="w-full flex flex-col">
            <div className="w-full h-[35px] flex items-center border-b border-gray-200">
              {icon}
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:underline"
              >
                {file.fileName}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderFile;
