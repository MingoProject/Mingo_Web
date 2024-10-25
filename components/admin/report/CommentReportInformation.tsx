"use client";
import Image from "next/image";
import React, { useState } from "react";
import { format } from "date-fns"; // Import format từ date-fns
import LableValue from "@/components/header/LableValue";

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

const CommentReportInformation = ({ item }: { item: Post }) => {
  const [showAll, setShowAll] = useState(false);
  const [showAllProof, setShowAllProof] = useState(false);

  return (
    <div className="w-full flex flex-col ">
      <div className="w-full flex gap-60 p-4 pb-0">
        <div className="flex flex-col self-center">
          <LableValue label="Comment ID" value={item.id.toString()} />
          <LableValue label="Type" value={item.id.toString()} />
        </div>
        <div className="flex flex-col self-center ">
          <LableValue
            label="Create Time"
            value={format(item.createAt, "dd/MM/yyyy 'at' HH:mm")}
          />
          <LableValue
            label="Report Time"
            value={format(item.createAt, "dd/MM/yyyy 'at' HH:mm")}
          />
        </div>
      </div>
      <div className="flex flex-col px-4">
        <LableValue label="Content" value={item.content} />
      </div>
      <div className="w-full px-4 flex flex-col gap-4">
        <LableValue label="Attachment" />
        <div className="grid grid-cols-5 gap-4">
          {item.attachment
            ?.slice(0, showAll ? item.attachment.length : 15)
            .map((attachment, index) => {
              console.log("Rendering attachment:", attachment); // Debug line
              return (
                <Image
                  key={index}
                  src={attachment.src}
                  height={165}
                  width={195}
                  alt="attachment"
                  className="w-full h-auto object-cover"
                />
              );
            })}
        </div>
        {item.attachment?.length > 15 && !showAll && (
          <button
            className="mt-4 text-blue-500"
            onClick={() => setShowAll(true)}
          >
            Show All
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
      <div className="w-full px-4 flex flex-col gap-4">
        <LableValue label="Proof" />
        <div className="grid grid-cols-5 gap-4">
          {item.attachment
            ?.slice(0, showAllProof ? item.attachment.length : 15)
            .map((attachment, index) => {
              console.log("Rendering attachment:", attachment); // Debug line
              return (
                <Image
                  key={index}
                  src={attachment.src}
                  height={165}
                  width={195}
                  alt="attachment"
                  className="w-full h-auto object-cover"
                />
              );
            })}
        </div>
        {item.attachment?.length > 15 && !showAllProof && (
          <button
            className="mt-4 text-blue-500"
            onClick={() => setShowAllProof(true)}
          >
            Show All
          </button>
        )}
        {showAllProof && (
          <button
            className="mt-4 text-blue-500"
            onClick={() => setShowAllProof(false)}
          >
            <p className="text-primary-100">Ẩn bớt</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentReportInformation;
