"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMyProfile } from "@/lib/services/user.service";
import Background from "@/components/forms/user/Background";
import Avatar from "@/components/forms/user/Avatar";
import Bio from "@/components/forms/user/Bio";
import InfomationUser from "@/components/forms/user/InfomationUser";
import Tab from "@/components/forms/personalPage/Tab";
import RenderContentPage from "@/components/forms/user/render/RenderContent";
import { checkRelation } from "@/lib/services/relation.service";
import RelationModal from "@/components/forms/profile/RelationAction";
import { useAuth } from "@/context/AuthContext";
import MyButton from "@/components/shared/MyButton";
import { useChatItemContext } from "@/context/ChatItemContext";
import { createGroups, getListChat } from "@/lib/services/message.service";
import ReportCard from "@/components/cards/ReportCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import ReportMenu from "@/components/forms/report/MenuReport";
import { pusherClient } from "@/lib/pusher";
import Image from "next/image";
import { UserBasicInfo, UserResponseDTO } from "@/dtos/UserDTO";

const ProfilePage = () => {
  const router = useRouter();
  const { id }: any = useParams();
  const [profileUser, setProfileUser] = useState<UserResponseDTO | undefined>();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (id) {
          const data = await getMyProfile(id.toString());
          setProfileUser(data.userProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  const { profile } = useAuth();
  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };

  const [isMe, setIsMe] = useState(false);
  useEffect(() => {
    let isMounted = true;
    try {
      const userId = localStorage.getItem("userId");
      if (userId && userId === id) {
        if (isMounted) {
          setIsMe(true);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const [relation, setRelation] = useState<string>("");
  const [isBlocked, setIsBlocked] = useState(false);
  useEffect(() => {
    let isMounted = true;
    const userId = localStorage.getItem("userId");
    const check = async () => {
      try {
        if (userId) {
          const res: any = await checkRelation(userId, id.toString());
          if (isMounted) {
            if (!res) {
              setRelation("stranger");
            } else {
              const { relation, status, sender, receiver } = res;

              if (relation === "bff") {
                if (status) {
                  setRelation("bff"); //
                } else if (userId === sender) {
                  setRelation("senderRequestBff"); //
                } else if (userId === receiver) {
                  setRelation("receiverRequestBff"); //
                }
              } else if (relation === "friend") {
                if (status) {
                  setRelation("friend"); //
                } else if (userId === sender) {
                  setRelation("following"); //
                } else if (userId === receiver) {
                  setRelation("follower"); //
                }
              } else if (relation === "block") {
                if (userId === sender) {
                  setRelation("blocked"); //
                } else if (userId === receiver) {
                  setRelation("blockedBy");
                  setIsBlocked(true);
                }
              } else {
                setRelation("stranger"); //
              }
              // setRelationStatus(status);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching relation:", error);
      }
    };
    check();

    const userChannel = pusherClient.subscribe(`user-${userId}`);
    const targetChannel = pusherClient.subscribe(`user-${id}`);

    const handleFriendEvent = (data: any) => {
      if (isMounted) {
        console.log("Friend event:", data);
        check();
      }
    };

    userChannel.bind("friend", handleFriendEvent);
    targetChannel.bind("friend", handleFriendEvent);

    return () => {
      isMounted = false;
      userChannel.unbind("friend", handleFriendEvent);
      targetChannel.unbind("friend", handleFriendEvent);
      pusherClient.unsubscribe(`user-${userId}`);
      pusherClient.unsubscribe(`user-${id}`);
    };
  }, [id]);

  const [activeTab, setActiveTab] = useState("posts");
  const { allChat, setAllChat } = useChatItemContext();
  const [isModalOpen, setModalOpen] = useState(false);

  const [isReport, setIsReport] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selectedReport, setSelectedReport] = useState(false);

  const fetchChats = useCallback(async () => {
    try {
      const allChat = await getListChat(); // Gọi API hoặc hàm lấy dữ liệu
      setAllChat(allChat || []); // Cập nhật state với dữ liệu nhận được
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }, []);

  console.log(allChat, "allChat check");

  const handleCloseMenu = () => {
    setSelectedReport(false);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!profileUser) return <div>Loading...</div>;

  const handleMessage = async () => {
    if (!id) return;

    try {
      console.log(id, "this is idssssssss");
      console.log(
        allChat.map((item) => item.receiverId),
        "this is idssssssss"
      );

      // Tìm nhóm chat đã tồn tại
      const existChat = allChat.find(
        (item) => item.receiverId === profileUser._id
      );

      console.log(existChat, "exxistchat ");

      // Nếu nhóm đã tồn tại, điều hướng đến nhóm
      if (existChat) {
        router.push(`/message/${existChat.id.toString()}`);
        return;
      } else {
        // Nếu nhóm chưa tồn tại, tạo nhóm mới
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found in local storage");
          return;
        }

        const groupData = {
          membersIds: [profileUser._id],
          groupName: `${profileUser?.firstName || ""} ${profileUser?.lastName || ""}`,
        };

        const newGroup = await createGroups(groupData);

        if (newGroup?.result?.newBox?.id) {
          // Điều hướng đến nhóm mới tạo
          router.push(`/message/${newGroup.newBox.id}`);
        }
      }
    } catch (error) {
      console.error("Error creating or navigating to group chat:", error);
    }
  };

  return (
    <div className="background-light500_dark500 h-full pt-[70px] mt-[20px] ">
      {!isBlocked ? (
        <div>
          <Background
            profileUser={profileUser}
            setProfileUser={setProfileUser}
          />

          <div className="mt-[25px] flex ml-[5%]">
            <Avatar profileUser={profileUser} setProfileUser={setProfileUser} />

            <div className="ml-[7%]">
              <h1 className="text-dark100_light100 text-[32px] font-semibold">
                {profileUser?.firstName} {profileUser?.lastName}
                {profileUser?.nickName && (
                  <span> ({profileUser?.nickName})</span>
                )}
              </h1>
              <Bio profileUser={profileUser} setProfileUser={setProfileUser} />
            </div>

            {!isMe ? (
              <div className="relative flex-1 ml-10">
                <div className="flex ml-5 justify-between items-center">
                  <MyButton
                    title="Message"
                    backgroundColor="bg-primary-100"
                    color="text-white"
                    width="w-22"
                    height="h-10"
                    onClick={handleMessage}
                  />

                  <div className="relative mr-[15%]">
                    <Icon
                      icon="bi:three-dots"
                      className="size-4 cursor-pointer"
                      onClick={() => setSelectedReport(true)}
                    />
                  </div>
                </div>

                {selectedReport && (
                  <div ref={menuRef} className="absolute right-0">
                    <ReportMenu isReported={isReport} userId={id.toString()} />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
            {isReport && (
              <ReportCard
                onClose={() => setIsReport(false)}
                type="user"
                entityId={profileUser._id}
                reportedId={profileUser._id}
              />
            )}
          </div>

          {!isMe && (
            <div>
              <button
                onClick={() => setModalOpen(true)}
                className={`ml-[13%] mt-3 rounded-lg px-4 py-2 text-white ${
                  relation === "bff"
                    ? "bg-yellow-500"
                    : relation === "senderRequestBff"
                      ? "bg-yellow-300"
                      : relation === "receiverRequestBff"
                        ? "bg-yellow-700"
                        : relation === "friend"
                          ? "bg-green-500"
                          : relation === "following"
                            ? "bg-blue-500"
                            : relation === "follower"
                              ? "bg-purple-500"
                              : relation === "blocked"
                                ? "bg-red-500"
                                : relation === "blockedBy"
                                  ? "bg-gray-500"
                                  : "bg-gray-400"
                }`}
              >
                {relation === "bff"
                  ? "Best friend"
                  : relation === "senderRequestBff"
                    ? "Sending friend request"
                    : relation === "receiverRequestBff"
                      ? "Friend request"
                      : relation === "friend"
                        ? "Friend"
                        : relation === "following"
                          ? "Following"
                          : relation === "follower"
                            ? "Follower"
                            : relation === "blocked"
                              ? "Blocked"
                              : relation === "blockedBy"
                                ? "Blocked by"
                                : "Stranger"}
              </button>

              {isModalOpen && (
                <RelationModal
                  relation={relation}
                  onClose={() => setModalOpen(false)}
                  id={id}
                  setRelation={setRelation}
                />
              )}
            </div>
          )}

          <div className="w-full flex justify-center">
            <div className="flex gap-[95px] w-fit">
              <div>
                <InfomationUser
                  user={profileUser}
                  setProfileUser={setProfileUser}
                  isMe={isMe}
                />
              </div>
              <div className="w-[645px] flex flex-col gap-8">
                <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
                <RenderContentPage
                  activeTab={activeTab}
                  profileUser={profileUser}
                  profileBasic={profileBasic}
                  isMe={isMe}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-bold text-2xl text-dark100_light100 h-screen  justify-center flex items-center mx-auto">
          <div className="dark:hidden">
            <Image
              src="/assets/images/CannotFound.png"
              alt="not found"
              width={300}
              height={300}
              className="mx-auto"
            />
            <div className="ml-16"> User not found.</div>
          </div>
          <div className="hidden dark:block">
            <Image
              src="/assets/images/Screenshot 2024-09-25 225618.png"
              alt="not found"
              width={300}
              height={300}
              className="mx-auto"
            />
            <div className="ml-16"> User not found.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
