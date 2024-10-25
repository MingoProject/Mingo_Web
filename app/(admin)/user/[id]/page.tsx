"use client"; // Đảm bảo dòng này là dòng đầu tiên

import ActivitiesList from "@/components/admin/user/ActivitiesList";
import FriendList from "@/components/admin/user/FriendList";
import GeneralInformation from "@/components/admin/user/GeneralInformation";
import OtherInformation from "@/components/admin/user/OtherInformation";
import PostList from "@/components/admin/user/PostList";
import HeaderWithButton from "@/components/header/HeaderWithButton";
import TilteIcon from "@/components/header/TilteIcon";
import { userData } from "@/components/shared/data";
import { faAddressCard } from "@fortawesome/free-solid-svg-icons";
import React from "react";

// Định nghĩa kiểu cho params
interface Params {
  id: number; // hoặc number tùy thuộc vào cách bạn định nghĩa ID trong dữ liệu của bạn
}

// Nhận params từ props và xác định kiểu cho nó
const Page = ({ params }: { params: Params }) => {
  const { id } = params; // Lấy ID người dùng từ params

  // Tìm dữ liệu người dùng theo ID
  const userDetail = userData.find((user) => user.id === Number(id));

  if (!userDetail) {
    return <div>User not found</div>; // Xử lý trường hợp không tìm thấy người dùng
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <HeaderWithButton title="User Detail" type={1} />
      <div className="w-full shadow-sm rounded-[10px] p-4">
        <TilteIcon title="General Information" icon={faAddressCard} />
        <GeneralInformation item={userDetail} />
        <TilteIcon title="Other Information" icon={faAddressCard} />
        <OtherInformation item={userDetail} />
        <TilteIcon title="Friends" />
        <FriendList />
        <TilteIcon title="Activities" />
        <ActivitiesList />
        <TilteIcon title="Post" />
        <PostList />
      </div>
    </div>
  );
};

export default Page; // Đảm bảo tên thành phần viết hoa
