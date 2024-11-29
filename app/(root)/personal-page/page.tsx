"use client";
import { useEffect, useState } from "react";
import RenderContentPage from "@/components/forms/personalPage/RenderContent";
import InfomationUser from "@/components/forms/personalPage/InfomationUser";
import { getMyProfile } from "@/lib/services/user.service";
import Background from "@/components/forms/personalPage/Background";
import Avatar from "@/components/forms/personalPage/Avatar";
import Tab from "@/components/forms/personalPage/Tab";
import Bio from "@/components/forms/personalPage/Bio";

function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const profileData = await getMyProfile(userId);
          setProfile(profileData.userProfile);
        }
      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="mt-96">Loading...</div>;
  if (error) return <div className="mt-96">Error: {error}</div>;

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
}

export default Page;
