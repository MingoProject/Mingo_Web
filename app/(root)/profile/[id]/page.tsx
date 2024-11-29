"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/services/user.service";
import Background from "@/components/forms/personalPage/Background";
import Avatar from "@/components/forms/personalPage/Avatar";
import Bio from "@/components/forms/personalPage/Bio";
import InfomationUser from "@/components/forms/personalPage/InfomationUser";
import Tab from "@/components/forms/personalPage/Tab";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";
import { checkRelation } from "@/lib/services/relation.service";

const ProfilePage = () => {
  const { id }: any = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [relation, setRelation] = useState<string>("");
  const [relationStatus, setRelationStatus] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res: any = await checkRelation(userId, id);
          if (!res) {
            setRelation("stranger"); // Người lạ nếu không có mối quan hệ
            setRelationStatus(false);
          } else {
            const { relation, status, sender, receiver } = res;

            if (relation === "bff") {
              setRelation("bff");
            } else if (relation === "friend") {
              if (status) {
                setRelation("friend"); // Là bạn
              } else if (userId === sender) {
                setRelation("following"); // Đang theo dõi
              } else if (userId === receiver) {
                setRelation("follower"); // Người theo dõi
              }
            } else if (relation === "block") {
              if (userId === sender) {
                setRelation("blocked"); // Bạn đã chặn người khác
              } else if (userId === receiver) {
                setRelation("blockedBy"); // Bị người khác chặn
              }
            } else {
              setRelation("stranger"); // Mặc định là người lạ
            }
            setRelationStatus(status); // Cập nhật trạng thái
          }
        }
      } catch (error) {
        console.error("Error fetching relation:", error);
      }
    };
    check();
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (id) {
          const data = await getMyProfile(id);
          setProfile(data.userProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="background-light700_dark400 h-full pt-20">
      <Background profile={profile} setProfile={setProfile} />

      <div className="mt-[30px] flex">
        <Avatar profile={profile} setProfile={setProfile} />

        <div className="ml-[5%]">
          <h1 className="text-dark100_light500 text-[25px]">
            {profile?.firstName} {profile?.lastName}
            {profile?.nickName && <span> ({profile?.nickName})</span>}
          </h1>
          <Bio profile={profile} setProfile={setProfile} />
        </div>
      </div>

      <button
        className={`ml-[15%] mt-3 rounded-lg px-4 py-2 text-white ${
          relation === "bff"
            ? "bg-yellow-500"
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
          ? "Bạn thân"
          : relation === "friend"
            ? "Bạn bè"
            : relation === "following"
              ? "Đang theo dõi"
              : relation === "follower"
                ? "Người theo dõi"
                : relation === "blocked"
                  ? "Đã chặn"
                  : relation === "blockedBy"
                    ? "Bị chặn"
                    : "Người lạ"}
      </button>

      <div>
        <InfomationUser
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          nickName={profile?.nickName}
          gender={profile?.gender}
          job={profile?.job}
          hobbies={profile?.hobbies}
          address={profile?.address}
          relationShip={profile?.relationShip}
          birthDay={profile?.birthDay}
          attendDate={profile?.attendDate}
          phoneNumber={profile?.phoneNumber}
          email={profile?.email}
          setProfile={setProfile}
        />
      </div>

      <Tab activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mx-[5%] my-5">
        <RenderContentPage activeTab={activeTab} />
      </div>
    </div>
  );
};

export default ProfilePage;
