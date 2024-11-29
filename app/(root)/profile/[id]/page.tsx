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
import RelationModal from "@/components/forms/profile/RelationAction";

const ProfilePage = () => {
  const { id }: any = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [relation, setRelation] = useState<string>("");
  const [relationStatus, setRelationStatus] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res: any = await checkRelation(userId, id);
          if (!res) {
            setRelation("stranger");
            setRelationStatus(false);
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
            setRelationStatus(status);
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
        onClick={() => setModalOpen(true)}
        className={`ml-[15%] mt-3 rounded-lg px-4 py-2 text-white ${
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
          _id={profile?._id}
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
