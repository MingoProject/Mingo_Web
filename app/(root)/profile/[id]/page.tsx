"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getMyProfile } from "@/lib/services/user.service";
import Background from "@/components/forms/personalPage/Background";
import Avatar from "@/components/forms/personalPage/Avatar";
import Bio from "@/components/forms/personalPage/Bio";
import InfomationUser from "@/components/forms/personalPage/InfomationUser";
import Tab from "@/components/forms/personalPage/Tab";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";
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

const ProfilePage = () => {
  const { id }: any = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [relation, setRelation] = useState<string>("");
  const { profile } = useAuth();
  const [isMe, setIsMe] = useState(false);
  const { allChat, setAllChat } = useChatItemContext();
  const { filteredChat, setFilteredChat } = useChatItemContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const [isReport, setIsReport] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [selectedReport, setSelectedReport] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

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
              // setRelationStatus(false);
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
    <div className="background-light700_dark400 h-full pt-20">
      {!isBlocked ? (
        <div>
          <Background
            profileUser={profileUser}
            setProfileUser={setProfileUser}
          />

          <div className="mt-[30px] flex">
            <Avatar profileUser={profileUser} setProfileUser={setProfileUser} />

            <div className="ml-[5%]">
              <h1 className="text-dark100_light500 text-[25px]">
                {profileUser?.firstName} {profileUser?.lastName}
                {profileUser?.nickName && (
                  <span> ({profileUser?.nickName})</span>
                )}
              </h1>
              <Bio profileUser={profileUser} setProfileUser={setProfileUser} />
            </div>

            {!isMe ? (
              <div className="relative flex-1">
                <div className="flex justify-between items-center">
                  {/* Nút Message */}
                  <MyButton
                    title="Message"
                    backgroundColor="bg-primary-100"
                    color="text-white"
                    width="w-22"
                    height="h-10"
                    onClick={handleMessage}
                  />

                  {/* Nút ba chấm */}
                  <div className="relative mr-[15%]">
                    <Icon
                      icon="bi:three-dots"
                      className="size-4 cursor-pointer"
                      onClick={() => setSelectedReport(true)}
                    />
                  </div>
                </div>

                {/* Hiển thị menu */}
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

            {/* {selectedReport && (
      <div ref={menuRef}>
        <ReportMenu isReported={isReport} userId={id} />
      </div>
    )} */}
            {/* {selectedReport && (
<div className="absolute right-0 mt-2">
  <ReportMenu isReported={isReport} userId={id} />
</div>
)} */}
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

          <div>
            <InfomationUser
              firstName={profileUser?.firstName}
              lastName={profileUser?.lastName}
              nickName={profileUser?.nickName}
              gender={profileUser?.gender}
              job={profileUser?.job}
              hobbies={profileUser?.hobbies}
              address={profileUser?.address}
              relationShip={profileUser?.relationShip}
              birthDay={profileUser?.birthDay}
              attendDate={profileUser?.attendDate}
              phoneNumber={profileUser?.phoneNumber}
              email={profileUser?.email}
              _id={profileUser?._id}
              setProfileUser={setProfileUser}
            />
          </div>

          <Tab activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="mx-[5%] my-5">
            <RenderContentPage
              activeTab={activeTab}
              profileUser={profileUser}
              me={profile}
              isMe={isMe}
            />
          </div>
        </div>
      ) : (
        <div className="font-bold text-2xl text-dark100_light500 h-screen  justify-center flex items-center mx-auto">
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
