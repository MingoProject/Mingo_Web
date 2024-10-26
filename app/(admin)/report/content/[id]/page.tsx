import React from "react";
import { userData, posts } from "@/components/shared/data";
import HeaderWithButton from "@/components/header/HeaderWithButton";
import TilteIcon from "@/components/header/TilteIcon";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import PostedUser from "@/components/admin/content/PostedUser";
import ReportInformation from "@/components/admin/report/ReportInformation";

interface Params {
  id: number;
}

const Page = ({ params }: { params: Params }) => {
  const { id } = params;

  const userDetail = userData.find((user) => user.id === Number(id));
  const postDetail = posts.find((post) => post.id === Number(id));

  if (!userDetail) {
    return <div>User not found</div>;
  }

  return (
    <div className="text-dark100_light500 background-light700_dark400 flex  size-full flex-col p-4">
      <HeaderWithButton title="Report Content Detail" type={2} />
      <div className="w-full rounded-[10px] p-4 shadow-sm">
        <TilteIcon title="Created User" icon={faAddressCard} />
        <PostedUser item={userDetail} />
        <TilteIcon title="Reported User" icon={faAddressCard} />
        <PostedUser item={userDetail} />
        <TilteIcon title="Report Information" icon={faAddressCard} />
        {postDetail ? (
          <ReportInformation item={postDetail} />
        ) : (
          <div>Post not found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
