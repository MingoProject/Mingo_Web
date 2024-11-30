"use client";
import { useEffect, useState } from "react";
import RenderSearch from "@/components/shared/search/RenderSearch";
import { getMyProfile } from "@/lib/services/user.service";

const ResultSearch = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const { searchParams } = new URL(window.location.href);
  const query = searchParams.get("page");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<any>(null);

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
      <div className="flex h-[39px] w-fit items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 px-4 text-white">
        Search results for: {query}
      </div>
      <div className="flex">
        <div className="m-10 mx-[5%] mb-5 ">
          <span
            className={` cursor-pointer ${
              activeTab === "posts"
                ? "border-b-2 border-primary-100 font-medium text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </span>
          <></>
          <span
            className={`ml-16 cursor-pointer ${
              activeTab === "friends"
                ? "border-b-2 border-primary-100 font-medium text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </span>
          {/* <span
          className={`cursor-pointer ${
            activeTab === "photos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("photos")}
        >
          Pictures
        </span>
        <span
          className={`cursor-pointer ${
            activeTab === "videos"
              ? "border-b-2 border-primary-100 font-medium text-primary-100"
              : "text-dark100_light500"
          }`}
          onClick={() => setActiveTab("videos")}
        >
          Videos
        </span> */}
        </div>
        <div className="my-5 ml-[20%] w-[543px]">
          <RenderSearch activeTab={activeTab} query={query} profile={profile} />
        </div>{" "}
      </div>

      <ul></ul>
    </div>
  );
};

export default ResultSearch;
