import LabelValue from "@/components/header/LableValue";
import React from "react";

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

const OtherInformation = ({ item }: { item: User }) => {
  return (
    <div className="w-full py-2 flex flex-col">
      <LabelValue
        label="Status"
        value={item.status === 0 ? "Inactive" : "Active"}
        valueColor={item.status === 0 ? "text-red-500" : "text-green-500"} // Màu cho giá trị
      />
      <LabelValue valueColor="font-normal" label="Job" value={item.job} />
      <LabelValue valueColor="font-normal" label="Bio" value={item.bio} />
      <LabelValue
        valueColor="font-normal"
        label="Hobbies"
        value={item.hobbies.join(", ")} // Hiển thị danh sách sở thích
      />
    </div>
  );
};

export default OtherInformation;
