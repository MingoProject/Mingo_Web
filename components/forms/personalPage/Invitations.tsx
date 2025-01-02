import { getMyFollowers } from "@/lib/services/user.service";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  acceptAddFriend,
  unfollowOrRefuseFriendRequest,
} from "@/lib/services/friend.service";
import {
  createNotification,
  deleteNotification,
} from "@/lib/services/notification.service";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@iconify/react/dist/iconify.js";

const Invitations = ({ onClose }: any) => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const { profile } = useAuth();
  useEffect(() => {
    let isMounted = true;
    const myFriends = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const data = await getMyFollowers(userId);
        if (isMounted) {
          setInvitations(data);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    myFriends();
    return () => {
      isMounted = false;
    };
  }, []);
  const handleRefuseFriend = async (
    id: string,
    userId: string
    // notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await unfollowOrRefuseFriendRequest(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      // await deleteNotification(notificationId, token); // Delete the notification
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };
  const handleAcceptFriend = async (
    id: string,
    userId: string
    // notificationId: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện hành động này.");
        return;
      }

      await acceptAddFriend(
        {
          sender: id,
          receiver: userId,
        },
        token
      );
      await createNotification(
        {
          senderId: userId,
          receiverId: id,
          type: "friend_accept",
        },
        token
      );
      // await deleteNotification(notificationId, token);
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="background-light700_dark300 max-h-[90vh] w-[700px] overflow-auto rounded-md border shadow-lg dark:border-transparent dark:shadow-none">
        <div className="mt-3 flex">
          <div className=" flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
            Friend invitation
          </div>
          <div
            className="ml-auto pr-3 text-xl text-primary-100"
            onClick={onClose}
          >
            <Icon
              icon="ic:round-close"
              width="28"
              height="28"
              className="text-primary-100"
            />
          </div>
        </div>
        <div className="h-[430px] overflow-y-auto p-5">
          {invitations.length > 0 ? (
            invitations.map((invitation: any, index: number) => (
              <div
                key={index}
                className="text-dark100_light500 mb-4 flex items-center"
              >
                <Link href={`/profile/${invitation._id}`}>
                  <Image
                    width={80}
                    height={80}
                    src={
                      invitation?.avatar ||
                      "/assets/images/62ceabe8a02e045a0793ec431098bcc1.jpg"
                    }
                    alt={invitation.lastName}
                    className="size-20 rounded-full object-cover"
                  />
                </Link>
                <div className="ml-4 font-bold">
                  {invitation.firstName} {invitation.lastName}
                </div>
                <Button
                  onClick={() =>
                    handleAcceptFriend(
                      invitation._id,
                      profile._id
                      // notification._id
                    )
                  }
                  className=" mx-2 rounded-lg bg-primary-100 px-4 text-white"
                >
                  Accept
                </Button>
                <Button
                  onClick={() =>
                    handleRefuseFriend(
                      invitation._id,
                      profile._id
                      // notification._id
                    )
                  }
                  className="background-light800_dark400 text-dark100_light500 ml-3 rounded-lg px-4 "
                >
                  Refuse
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              Không có lời mời nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
