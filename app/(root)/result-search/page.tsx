"use client";
import { useEffect, useState } from "react";
import RenderSearch from "@/components/shared/search/RenderSearch";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

const ResultSearch = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState<string | null>(null);
  const { profile } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setQuery(searchParams.get("page"));
    }
  }, [searchParams]);

  return (
    <div className="background-light700_dark400 h-full pt-20">
      <div className="flex h-[39px] w-fit items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 px-4 text-white">
        Search results for: {query}
      </div>
      <div className="flex">
        <div className="m-10 mx-[5%] mb-5 ">
          <span
            className={` cursor-pointer text-xl ${
              activeTab === "all"
                ? "border-b-2 border-primary-100 font-medium text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </span>
          <hr className="mb-5 border-transparent"></hr>
          <span
            className={` cursor-pointer text-xl ${
              activeTab === "posts"
                ? "border-b-2 border-primary-100 font-medium text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </span>
          <hr className="mb-5 border-transparent"></hr>
          <span
            className={`cursor-pointer text-xl ${
              activeTab === "users"
                ? "border-b-2 border-primary-100 font-medium text-primary-100"
                : "text-dark100_light500"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </span>
        </div>
        <div className="my-5 ml-[20%] w-[543px]">
          <RenderSearch activeTab={activeTab} query={query} profile={profile} />
        </div>{" "}
      </div>
    </div>
  );
};

export default ResultSearch;
