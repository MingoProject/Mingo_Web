import React from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@/components/ui/menubar"; // import component bạn vừa tạo

const FilterPost = ({ selectedFilter, setSelectedFilter }: any) => {
  const applyFilter = (filterKey: string) => {
    setSelectedFilter(filterKey);
    // Logic lọc bài viết theo filterKey, ví dụ:
    console.log(`Filtering posts by: ${filterKey}`);
  };

  return (
    <Menubar className="text-dark100_light500 background-light800_dark400 w-full max-w-md">
      <MenubarMenu>
        <MenubarTrigger className="text-sm">Filter Options</MenubarTrigger>
        <MenubarContent className="text-dark100_light500 background-light800_dark400">
          {/* <MenubarLabel>Lọc bài viết theo</MenubarLabel> */}
          <MenubarItem
            onSelect={() => applyFilter("Mới nhất")}
            className={selectedFilter === "Mới nhất" ? "" : ""}
          >
            Mới nhất
          </MenubarItem>
          <MenubarItem
            onSelect={() => applyFilter("Cũ nhất")}
            className={selectedFilter === "Cũ nhất" ? "" : ""}
          >
            Cũ nhất
          </MenubarItem>
          <MenubarItem
            onSelect={() => applyFilter("Hot nhất")}
            className={selectedFilter === "Hot nhất" ? " " : ""}
          >
            Số lượt like nhiều nhất
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onSelect={() => console.log("Clear Filters")}>
            Xóa bộ lọc
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default FilterPost;
