"use client";
import Navbar from "@/components/shared/navbar/Navbar";
import { ChatItemProvider } from "@/context/ChatItemContext";
import React, { useEffect } from "react";
import { IsOffline, IsOnline } from "@/lib/services/message.service";
import { useChatItemContext } from "@/context/ChatItemContext";
import { useChatContext } from "@/context/ChatContext";
import { pusherClient } from "@/lib/pusher";
import { OnlineEvent } from "@/dtos/MessageDTO";
const Layout = ({ children }: { children: React.ReactNode }) => {
  const checkOnlineStatus = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const result = await IsOnline(userId?.toString() || "");
      console.log("User online status:", result);
    } catch (error) {
      console.error("Error checking online status:", error);
    }
  };
  const setOfflineStatus = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await IsOffline(userId?.toString() || "");
      console.log("User is offline");
    } catch (error) {
      console.error("Error setting offline status:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Gọi `checkOnlineStatus` khi ở trong layout
    checkOnlineStatus();

    const handleBeforeUnload = () => {
      setOfflineStatus(); // Người dùng đóng tab/trang
    };
    // Lắng nghe sự kiện trước khi tải lại hoặc đóng trang
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      setOfflineStatus(); // Đặt trạng thái offline khi rời layout
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const { setIsOnlineChat, isOnlineChat } = useChatContext();
  const { allChat } = useChatItemContext();

  useEffect(() => {
    const handleOnline = (data: OnlineEvent) => {
      console.log("Successfully received online-status:", data);
      setIsOnlineChat((prevState) => ({
        ...prevState,
        [data.userId]: true,
      }));
    };

    const handleOffline = (data: OnlineEvent) => {
      console.log("Successfully received offline-status:", data);
      setIsOnlineChat((prevState) => ({
        ...prevState,
        [data.userId]: false,
      }));
    };

    allChat.forEach((box) => {
      pusherClient.subscribe(`private-${box.receiverId}`);
      pusherClient.bind("online-status", handleOnline);
      pusherClient.bind("offline-status", handleOffline);
    });
  });
  return (
    <main className="background-light500_dark500 relative h-full">
      <Navbar />
      <div className="background-light500_dark500 flex h-full">
        <section className="background-light500_dark500 flex flex-1 flex-col">
          <div className="background-light500_dark500 mx-auto size-full">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
