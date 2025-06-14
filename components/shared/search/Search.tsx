// component/search/Search.tsx
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Thay đổi import
import Input from "@/components/ui/input";
import NameCard from "@/components/cards/other/NameCard";

const recentSearches = ["h", "a", "u", "y", "1"];

const Search = ({ closeDrawer }: any) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();
  const [filteredSearches, setFilteredSearches] =
    useState<string[]>(recentSearches);

  const handleDeleteSearch = (search: string) => {
    setFilteredSearches((prevSearches) =>
      prevSearches.filter((item) => item !== search)
    );
    console.log(`Deleted search: ${search}`);
  };

  const handleSearch = () => {
    if (closeDrawer) closeDrawer();
    if (searchTerm.trim()) {
      router.push(`/result-search?page=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSearches(recentSearches);
    } else {
      setFilteredSearches(
        recentSearches.filter((search) =>
          search.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  return (
    <>
      <div className="flex justify-between items-center mr-10">
        <NameCard name="Search" />
        <Icon
          icon="mingcute:close-line"
          className="text-dark100_light100  text-[20px]"
          onClick={closeDrawer}
        />
      </div>

      <div className="px-10 py-5 flex flex-col gap-[15px]">
        <div>
          <Input
            iconSrc="iconoir:search"
            placeholder="search"
            readOnly={false}
            cursor="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className=" text-[14px] font-semibold text-dark100_light100">
            Recently
          </span>
          <span className=" text-[14px] font-normal text-primary-100 hover:underline cursor-pointer">
            Clear all
          </span>
        </div>

        <ul className="space-y-1">
          {filteredSearches.length > 0 ? (
            filteredSearches.map((search, index) => (
              <li
                key={index}
                className="flex cursor-pointer items-center justify-between rounded-md px-5 py-2 hover:bg-light-700 dark:hover:bg-dark-400"
              >
                <span className="text-dark100_light100 text-[16px] font-normal">
                  {search}
                </span>

                <div className="p-[7px] background-light400_dark400 rounded-full">
                  <Icon
                    icon="mdi:close"
                    className="text-primary-100 size-[20px]"
                    onClick={() => handleDeleteSearch(search)}
                  />
                </div>
              </li>
            ))
          ) : (
            <p className="text-dark100_light100">No results found</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default Search;
