// "use client";
// import React, { useState } from "react";
// import Image from "next/image";
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import { Icon } from "@iconify/react";
// import Format from "./FormatCard";

// interface Text {
//   id: string;
//   text: string;
//   timestamp: Date;
// }

// interface ItemChat {
//   id: string;
//   userName: string;
//   avatarUrl: string;
//   status: string;
//   lastMessage: Text;
//   unreadCount: number;
// }

// const ListUserChatCard = ({ itemChat }: { itemChat: ItemChat }) => {
//   function timeSinceMessage(timestamp: Date | string) {
//     const now = new Date();
//     const messageTimestamp = new Date(timestamp);
//     const diffInMs = now.getTime() - messageTimestamp.getTime();
//     const diffInSeconds = Math.floor(diffInMs / 1000);
//     const diffInMinutes = Math.floor(diffInSeconds / 60);
//     const diffInHours = Math.floor(diffInMinutes / 60);
//     const diffInDays = Math.floor(diffInHours / 24);

//     if (diffInDays > 0) return `${diffInDays} ngày`;
//     if (diffInHours > 0) return `${diffInHours} giờ`;
//     if (diffInMinutes > 0) return `${diffInMinutes} phút`;
//     return `${diffInSeconds} giây`;
//   }

//   const [activeAction, setActiveAction] = useState("");
//   const [activeLabel, setActiveLabel] = useState("");

//   const handleAction = (action: string, label: string) => {
//     setActiveAction(action);
//     setActiveLabel(label);
//   };

//   const closeAction = () => {
//     setActiveAction("");
//     setActiveLabel("");
//   };

//   return (
//     <ContextMenu>
//       <ContextMenuTrigger>
//         <div className="text-dark100_light500 flex w-full items-center justify-between px-4 py-2 hover:bg-primary-100/20">
//           <div className="flex w-full items-center gap-3">
//             <div className="relative">
//               <Image
//                 src={itemChat.avatarUrl || "/assets/images/capy.jpg"}
//                 alt="Avatar"
//                 width={45}
//                 height={45}
//                 className="rounded-full"
//               />
//               {itemChat.status === "online" && (
//                 <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-green-500"></span>
//               )}
//             </div>
//             <div className="hidden w-2/3 gap-1 text-xs md:flex md:flex-col">
//               <span className="text-base font-semibold">
//                 {itemChat.userName}
//               </span>
//               <span className="truncate text-sm font-medium">
//                 {itemChat.lastMessage.text}
//               </span>
//             </div>
//           </div>
//           <span className="mt-6 hidden whitespace-nowrap px-1 text-[11px] text-gray-500 md:block">
//             {timeSinceMessage(itemChat.lastMessage.timestamp)}
//           </span>
//         </div>
//       </ContextMenuTrigger>
//       <ContextMenuContent className="text-dark100_light500 bg-gray-50 dark:bg-neutral-800">
//         {[
//           {
//             icon: "system-uicons:picture",
//             label: "Lưu đoạn chat",
//             action: "lưu đoạn chat",
//           },
//           {
//             icon: "material-symbols:delete-outline",
//             label: "Xóa đoạn chat",
//             action: "xóa đoạn chat",
//           },
//           {
//             icon: "ion:notifications-off-outline",
//             label: "Tắt thông báo",
//             action: "tắt thông báo đoạn chat",
//           },
//           {
//             icon: "material-symbols:report-outline",
//             label: "Báo cáo",
//             action: "báo cáo",
//           },
//           {
//             icon: "material-symbols:block",
//             label: "Chặn",
//             action: "chặn đoạn chat",
//           },
//         ].map(({ icon, label, action }) => (
//           <ContextMenuItem
//             key={action}
//             onClick={() => handleAction(action, label)}
//             className="gap-1 hover:bg-primary-100 hover:bg-opacity-90 hover:text-white"
//           >
//             <div className="group flex size-full items-center gap-1 hover:text-white">
//               <Icon
//                 icon={icon}
//                 width={14}
//                 height={14}
//                 className="text-gray-500 group-hover:text-white dark:text-white"
//               />
//               <p className="text-ellipsis whitespace-nowrap font-sans text-xs group-hover:text-white">
//                 {label}
//               </p>
//             </div>
//           </ContextMenuItem>
//         ))}
//       </ContextMenuContent>
//       {activeAction && (
//         <Format
//           onClose={closeAction}
//           content={`${activeAction} với`}
//           label={activeLabel}
//           userName={itemChat.userName}
//         />
//       )}
//     </ContextMenu>
//   );
// };

// export default ListUserChatCard;

"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Icon } from "@iconify/react";
import Format from "./FormatCard";

interface Text {
  id: string;
  text: string;
  timestamp: Date;
  createBy: string;
}

interface ItemChat {
  id: string;
  userName: string;
  avatarUrl: string;
  status: string;
  lastMessage: Text;
  isRead: boolean;
}

export function getDisplayName(name: string): string {
  const parts = name.trim().split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : name;
}

const ListUserChatCard = ({ itemChat }: { itemChat: ItemChat }) => {
  function timeSinceMessage(timestamp: Date | string) {
    const now = new Date();
    const messageTimestamp = new Date(timestamp);
    const diffInMs = now.getTime() - messageTimestamp.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} ngày`;
    if (diffInHours > 0) return `${diffInHours} giờ`;
    if (diffInMinutes > 0) return `${diffInMinutes} phút`;
    return `${diffInSeconds} giây`;
  }

  const [activeAction, setActiveAction] = useState("");
  const [activeLabel, setActiveLabel] = useState("");

  const handleAction = (action: string, label: string) => {
    setActiveAction(action);
    setActiveLabel(label);
  };

  const closeAction = () => {
    setActiveAction("");
    setActiveLabel("");
  };

  // Lấy ID người đăng nhập (giả sử lưu trữ trong localStorage)
  const userId = localStorage.getItem("userId");

  // Kiểm tra nếu receiverId là người nhận, không phải người gửi (userId)
  const isReceiver = itemChat.lastMessage.createBy !== userId;

  console.log(itemChat.lastMessage.createBy, "this is item chattt");

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="text-dark100_light500 flex w-full items-center justify-between px-4 py-2 hover:bg-primary-100/20 hover:rounded-lg">
          <div className="flex w-full items-center gap-3">
            <div className="relative">
              <Image
                src={itemChat.avatarUrl || "/assets/images/capy.jpg"}
                alt="Avatar"
                width={45}
                height={45}
                className="rounded-full"
              />
              {itemChat.status && (
                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-green-500"></span>
              )}
            </div>
            <div className="hidden w-[55%] gap-1 text-xs md:flex md:flex-col">
              <span className="text-base font-semibold whitespace-nowrap overflow-hidden truncate">
                {itemChat.userName}
              </span>
              <span
                className={`truncate text-sm font-medium ${itemChat.isRead ? "font-normal" : "font-bold"}`}
              >
                {isReceiver ? (
                  <>
                    {itemChat.userName.trim().split(" ").pop()}:{" "}
                    {itemChat.lastMessage.text.trim() !== ""
                      ? itemChat.lastMessage.text
                      : "Đã gửi 1 file"}
                  </>
                ) : (
                  <>
                    Bạn:{" "}
                    {itemChat.lastMessage.text.trim() !== ""
                      ? itemChat.lastMessage.text
                      : "Đã gửi 1 file"}
                  </>
                )}
              </span>
            </div>
            <span className="mt-8 items-center hidden whitespace-nowrap px-1 text-[11px] text-gray-500 md:block">
              {timeSinceMessage(itemChat.lastMessage.timestamp)}
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="text-dark100_light500 bg-gray-50 dark:bg-neutral-800">
        {[
          {
            icon: "system-uicons:picture",
            label: "Lưu đoạn chat",
            action: "lưu đoạn chat",
          },
          {
            icon: "material-symbols:delete-outline",
            label: "Xóa đoạn chat",
            action: "xóa đoạn chat",
          },
          {
            icon: "ion:notifications-off-outline",
            label: "Tắt thông báo",
            action: "tắt thông báo đoạn chat",
          },
          {
            icon: "material-symbols:report-outline",
            label: "Báo cáo",
            action: "báo cáo",
          },
          {
            icon: "material-symbols:block",
            label: "Chặn",
            action: "chặn đoạn chat",
          },
        ].map(({ icon, label, action }) => (
          <ContextMenuItem
            key={action}
            onClick={() => handleAction(action, label)}
            className="gap-1 hover:bg-primary-100 hover:bg-opacity-90 hover:text-white"
          >
            <div className="group flex size-full items-center gap-1 hover:text-white">
              <Icon
                icon={icon}
                width={14}
                height={14}
                className="text-gray-500 group-hover:text-white dark:text-white"
              />
              <p className="text-ellipsis whitespace-nowrap font-sans text-xs group-hover:text-white">
                {label}
              </p>
            </div>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
      {activeAction && (
        <Format
          onClose={closeAction}
          content={`${activeAction} với`}
          label={activeLabel}
          userName={itemChat.userName}
        />
      )}
    </ContextMenu>
  );
};

export default ListUserChatCard;
