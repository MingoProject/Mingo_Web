import React from "react";

type LabelValueProps = {
  label: string;
  value: string;
  labelColor?: string; // Màu cho label
  valueColor?: string; // Màu cho value
};

const LabelValue = ({
  label,
  value,
  labelColor = "text-light-500 ",
  valueColor = "font-bold", // Mặc định màu cho value
}: LabelValueProps) => {
  return (
    <p className="flex gap-2 text-[18px]">
      <span className={labelColor}>{label}:</span>
      <span className={`${valueColor} text-[18px]`}>{value}</span>{" "}
      {/* Sử dụng màu từ prop */}
    </p>
  );
};

export default LabelValue;
