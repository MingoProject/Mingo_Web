"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { useChatItemContext } from "@/context/ChatItemContext";
import { getListChat } from "@/lib/services/message.service";

const ProfilePage = () => {
  const { id }: any = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [relation, setRelation] = useState<string>("");
  const { profile } = useAuth();
  const [isMe, setIsMe] = useState(false);
  const { allChat, setAllChat } = useChatItemContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

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
    const check = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res: any = await checkRelation(userId, id);
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
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (id) {
          const data = await getMyProfile(id);
          setProfileUser(data.userProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profileUser) return <div>Loading...</div>;

  const handleMessage = async (id: string) => {
    try {
      const normalChats = await getListChat();
      console.log(normalChats, "Normal Chats");
      setAllChat(normalChats);

      const userId = localStorage.getItem("userId");

      // Kiểm tra nếu không có `allChat` nào có boxId trùng với id
      const existChat = allChat.find((item) => item?.receiverId === id);
      if (existChat) {
        router.push(`/message/${existChat.id}`);
      } else {
        router.push(`/message/${id}`);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  };
  return (
    <div className="background-light700_dark400 h-full pt-20">
      <Background profileUser={profileUser} setProfileUser={setProfileUser} />

      <div className="mt-[30px] flex">
        <Avatar profileUser={profileUser} setProfileUser={setProfileUser} />

        <div className="ml-[5%]">
          <h1 className="text-dark100_light500 text-[25px]">
            {profileUser?.firstName} {profileUser?.lastName}
            {profileUser?.nickName && <span> ({profileUser?.nickName})</span>}
          </h1>
          <Bio profileUser={profileUser} setProfileUser={setProfileUser} />
        </div>
        {!isMe ? (
          <MyButton
            title="Message"
            backgroundColor="bg-primary-100"
            color="text-white"
            width="w-22"
            height="h-10"
            onClick={() => handleMessage(id)}
          />
        ) : (
          ""
        )}
      </div>

      {!isMe && (
        <>
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
        </>
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
  );
};

export default ProfilePage;
