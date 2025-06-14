"use client";
import { useEffect, useState } from "react";
import RenderSearch from "@/components/shared/search/RenderSearch";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import NameCard from "@/components/cards/other/NameCard";
import Tab from "@/components/ui/tab";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UserBasicInfo } from "@/dtos/UserDTO";

const ResultSearch = () => {
  const [activeTab, setActiveTab] = useState<"all" | "posts" | "users">("all");
  const [query, setQuery] = useState<string | null>(null);
  const { profile } = useAuth();
  const profileBasic: UserBasicInfo = {
    _id: profile?._id,
    avatar: profile?.avatar,
    firstName: profile?.firstName,
    lastName: profile?.lastName,
  };
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setQuery(searchParams.get("page"));
    }
  }, [searchParams]);

  return (
    <div className="background-light500_dark500 h-full pt-[70px] mt-[20px]">
      <div className="flex ">
        <div className="flex flex-col gap-4">
          <NameCard name={`Search results for ${query}`} />
          <div className="ml-[20px] flex flex-col gap-4">
            <div className="text-dark100_light100 flex gap-4">
              <Icon icon="majesticons:filter-line" className="size-6 " />
              <span className="text-4 font-semibold">Filter:</span>
            </div>
            <Tab
              content="All results"
              isActive={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            />
            <Tab
              content="Posts"
              isActive={activeTab === "posts"}
              onClick={() => setActiveTab("posts")}
            />
            <Tab
              content="Users"
              isActive={activeTab === "users"}
              onClick={() => setActiveTab("users")}
            />
          </div>
        </div>
        <div className="my-5 ml-[20%] w-[543px]">
          <RenderSearch
            activeTab={activeTab}
            query={query}
            profileBasic={profileBasic}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultSearch;
