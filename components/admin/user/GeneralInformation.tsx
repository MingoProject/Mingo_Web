"use client";
import Image from "next/image";
import React from "react";
import { format } from "date-fns"; // Import format từ date-fns
import LableValue from "@/components/header/LableValue";
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

const GeneralInformation = ({ item }: { item: User }) => {
  return (
    <div className="w-full pt-4 flex flex-col">
      <div
        className="self-center"
        style={{
          width: "837px",
          height: "177px",
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
      <div className="flex flex-col p-4">
        <LableValue label="Address" value={item.address} />
        <LableValue label="Nickname" value={item.nickName} />
      </div>
    </div>
  );
};

export default GeneralInformation;
