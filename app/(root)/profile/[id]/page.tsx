"use client"; // Đặt directive này ở đầu file để chuyển thành Client Component.

import { useParams } from "next/navigation"; // Thay thế next/router bằng next/navigation
import { useEffect, useState } from "react";
import { getMyProfile } from "@/lib/services/user.service";
import Background from "@/components/forms/personalPage/Background";
import Avatar from "@/components/forms/personalPage/Avatar";
import Bio from "@/components/forms/personalPage/Bio";
import InfomationUser from "@/components/forms/personalPage/InfomationUser";
import Tab from "@/components/forms/personalPage/Tab";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";

const ProfilePage = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (id) {
          const data = await getMyProfile(id);
          console.log("profile", data);
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
