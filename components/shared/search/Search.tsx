// component/search/Search.tsx
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Thay đổi import

const recentSearches = ["h", "a", "u", "y", "1"];

const Search = ({ closeDrawer }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [filteredSearches, setFilteredSearches] = useState(recentSearches);

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteSearch = (search: any) => {
    setFilteredSearches((prevSearches) =>
      prevSearches.filter((item) => item !== search)
    );
    console.log(`Deleted search: ${search}`);
  };

  const handleSearch = () => {
    closeDrawer();
    router.push(`/result-search?page=${encodeURIComponent(searchTerm)}`);
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
      <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
        Search
      </div>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search..."
            className="text-dark100_light500 h-10 grow rounded-l-lg border border-primary-100 bg-transparent px-4 focus:outline-none focus:ring"
          />
          <button
            className="h-10 rounded-r-lg bg-primary-100 px-4 text-white"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <h2 className="mb-2 text-lg font-normal text-primary-100">Recently</h2>
        <ul className="space-y-1">
          {filteredSearches.map((search, index) => (
            <li
              key={index}
              className="flex cursor-pointer items-center justify-between rounded-md px-5 py-2 hover:bg-light-700 dark:hover:bg-dark-400"
            >
              <span className="text-dark100_light500">{search}</span>
              <button onClick={() => handleDeleteSearch(search)}>
                <Icon icon="mdi:close" className="text-dark100_light500" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Search;
