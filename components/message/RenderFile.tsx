import React from "react";
import { Icon } from "@iconify/react"; // Assuming you're using Iconify for icons
import {
  faFilePdf,
  faFileWord,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RenderFile = ({ files }: { files: string[] }) => {
  return (
    <div className="flex flex-wrap gap-4 w-full">
      {files.map((file, index) => {
        // Extract the file extension from the URL
        const fileExtension = file.split(".").pop()?.toLowerCase();

        let icon;

        // Determine the icon based on the file extension
        switch (fileExtension) {
          case "pdf":
            icon = (
              <FontAwesomeIcon
                className="w-4 h-4 bg-gray-200"
                icon={faFilePdf}
              />
            );
            break;
          case "doc":
          case "docx":
            icon = (
              <FontAwesomeIcon
                className="w-4 h-4 bg-gray-200"
                icon={faFileWord}
              />
            );
            break;
          default:
            icon = (
              <FontAwesomeIcon className="w-4 h-4 bg-gray-200" icon={faFile} />
            ); // Default icon for other file types
        }

        return (
          <div key={index} className="w-full h-full flex flex-col">
            <div className="w-full h-[35px]  flex items-center border-b border-gray-200">
              {icon}
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 "
              >
                {`File ${index + 1}`}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderFile;

// const RenderFile = ({ files }: { files: string[] }) => {
//     return (
//       <div className="flex flex-wrap gap-4">
//         {files.map((file, index) => (
//           <a
//             key={index}
//             href={file}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-500 underline"
//           >
//             File {index + 1}
//           </a>
//         ))}
//       </div>
//     );
//   };

//   export default RenderFile;
