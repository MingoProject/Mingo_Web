"use client";
import Image from "next/image";
import React from "react";
import { format } from "date-fns"; // Import format từ date-fns
import LableValue from "@/components/header/LableValue";
import MyButton from "@/components/shared/MyButton";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  fullname: string;
  gender: string;
  address: string;
  nickName: string;
  gmail: string;
  phone: string;
  status: number; // Trạng thái người dùng (ví dụ: 'active', 'inactive')
  job: string; // Nghề nghiệp
  bio: string; // Giới thiệu về bản thân
  hobbies: string[]; // Sở thích (danh sách)
  enrolled: Date; // Ngày tham gia (đăng ký)
};

const PostedUser = ({ item }: { item: User }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/user/${item.id}`);
  };
  return (
    <div className="w-full py-4 flex flex-col ">
      <div className="w-full flex gap-24 p-4 pt-8">
        <div
          className="self-center rounded-[10px]"
          style={{
            width: "115px",
            height: "130px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Image
            src="/assets/images/background.jpg"
            alt="background"
            layout="fill" // Lấp đầy khung
            objectFit="cover" // Cắt ảnh để phù hợp với khung
          />
        </div>
        <div className="flex flex-col self-center ">
          <LableValue label="Fullname" value={item.fullname} />
          <LableValue
            label="Date of birth"
            value={format(item.enrolled, "PPP")}
          />
          <LableValue label="Gender" value={item.gender} />
        </div>
        <div className="flex flex-col self-center">
          <LableValue label="ID" value={item.id.toString()} />
          <LableValue label="Email" value={item.gmail} />
          <LableValue label="Phone Number" value={item.phone} />
        </div>
      </div>
      <div className="self-start px-4">
        <MyButton
          title="See detail"
          icon={faEye}
          backgroundColor="bg-primary-100"
          color="text-white"
          width="w-[117px]"
          height="h-[35px]"
          fontSize="text-[14px]"
          onClick={handleNavigate}
        />
      </div>
    </div>
  );
};

export default PostedUser;
