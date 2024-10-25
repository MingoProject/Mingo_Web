"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { format } from "date-fns"; // Import format từ date-fns
import LableValue from "@/components/header/LableValue";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Table from "@/components/shared/Table";
import { posts } from "@/components/shared/data";

type Post = {
  id: number;
  userId: number;
  content: string;
  createAt: Date;
  location: string;
  hashtag: string[];
  tag: string[];
  privacy: string;
  attachment: { id: number; src: string }[];
  like: number;
  share: number;
  reaction: { type: string; count: number }[];
  comment: {
    commentId: number;
    author: string;
    createAt: Date;
    content: string;
    parentComment?: number;
  }[];
};

const columns = [
  {
    header: "Author",
    accessor: "author",
    className: " text-lg font-md",
  },
  {
    header: "Comment ID",
    accessor: "id",
    className: "hidden md:table-cell text-lg font-md",
  },
  {
    header: "Create Date",
    accessor: "type",
    className: "hidden lg:table-cell text-lg font-md",
  },
  {
    header: "Content",
    accessor: "content",
    className: " text-lg font-md",
  },
  {
    header: "Parent Comment",
    accessor: "type",
    className: " text-lg font-md",
  },
];

const PostInformation = ({ item }: { item: Post }) => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const handleNavigate = () => {
    router.push(`/user/${item.id}`);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");

  //Sorted
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKeys;
    direction: "ascending" | "descending";
  }>({
    key: "commentId",
    direction: "ascending",
  });
  type SortableKeys = "author" | "commentId" | "createdDate" | "content";

  const getValueByKey = (item: (typeof posts)[0], key: SortableKeys) => {
    switch (key) {
      case "author":
        return item.comment.map((item) => {
          item.author;
        });
      case "commentId":
        return item.comment.map((item) => {
          item.commentId;
        });
      case "createdDate":
        return item.comment.map((item) => {
          item.createAt;
        });
      case "content":
        return item.comment.map((item) => {
          item.content;
        });
      default:
        return "";
    }
  };

  const sorted = [...posts].sort((a, b) => {
    const aValue = getValueByKey(a, sortConfig.key);
    const bValue = getValueByKey(b, sortConfig.key);

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  const requestSort = (key: SortableKeys) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const renderRow = (item: Post) => {
    return item.comment.map((comment) => (
      <tr
        key={comment.commentId} // Sử dụng commentId làm key
        className="border-t border-gray-300 my-4 text-sm dark:text-dark-360"
      >
        <td className="px-4 py-2">
          <Link href={`/user/${item.userId}`}>
            <h3>{comment.author}</h3>
            <p className="text-xs text-gray-500">#00{item.id}</p>
          </Link>
        </td>
        <td className="px-4 py-2 hidden lg:table-cell">
          <p className="text-sm">{comment.commentId}</p>
        </td>
        <td className="px-4 py-2 hidden lg:table-cell">
          <p className="text-sm ">
            <div className="flex flex-col w-full ">
              <p>{format(comment.createAt, "PPP")}</p>
              <p className="text-xs text-gray-500 pt-1">
                {new Date(comment.createAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          </p>
        </td>
        <td className="px-4 py-2 hidden lg:table-cell">
          <p className="text-sm ">{comment.content}</p>
        </td>
        <td className="px-4 py-2 hidden lg:table-cell">
          <p className="text-sm ">{comment.parentComment ?? "N/A"}</p>
        </td>
      </tr>
    ));
  };

  return (
    <div className="w-full py-4 flex flex-col ">
      <div className="w-full flex gap-24 p-4 pb-0">
        <div className="flex flex-col self-center ">
          <LableValue label="Post ID" value={item.id.toString()} />

          <LableValue label="Content" value={item.content} />
        </div>
        <div className="flex flex-col self-center">
          <LableValue
            label="Date of birth"
            value={format(item.createAt, "PPP")}
          />
          <LableValue label="Location" value={item.id.toString()} />
        </div>
      </div>
      <div className="w-full px-4 flex flex-col">
        <LableValue label="Hastag" value={item.hashtag.join(", ")} />
        <LableValue label="Tag" value={item.hashtag.join(", ")} />
      </div>
      <div className="w-full flex gap-60 px-4">
        <div className="flex flex-col self-center ">
          <LableValue label="Type" value={"status"} />
        </div>
        <div className="flex flex-col self-center">
          <LableValue label="Privacy" value={item.privacy} />
        </div>
      </div>
      <div className="w-full px-4 flex flex-col">
        <LableValue label="Like" value={item.like.toString()} />
        <LableValue label="Share" value={item.share.toString()} />
      </div>
      <div className="w-full px-4 flex flex-col gap-4">
        <LableValue label="Attachment" />
        <div className="grid grid-cols-5 gap-4">
          {item.attachment
            .slice(0, showAll ? item.attachment.length : 15)
            .map((attachment, index) => (
              <Image
                key={index}
                src={attachment.src}
                height={165}
                width={195}
                alt="attachment"
                className="w-full h-auto object-cover"
              />
            ))}
        </div>
        {item.attachment.length > 15 && !showAll && (
          <button
            className="mt-4 text-blue-500"
            onClick={() => setShowAll(true)}
          >
            <p className="text-primary-100"> Xem thêm</p>
          </button>
        )}
        {showAll && (
          <button
            className="mt-4 text-blue-500"
            onClick={() => setShowAll(false)}
          >
            <p className="text-primary-100">Ẩn bớt</p>
          </button>
        )}
      </div>
      <LableValue label="Comment" />
      <Table
        columns={columns}
        renderRow={renderRow}
        data={sorted} // Pass sorted data to the table
        onSort={(key: string) => requestSort(key as SortableKeys)} // Sorting function
      />
    </div>
  );
};

export default PostInformation;
