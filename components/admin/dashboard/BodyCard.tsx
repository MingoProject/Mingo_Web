import TotalCard from "@/components/cards/TotalCard";
import React from "react";
import Notification from "./Notification";

const BodyCard = () => {
  return (
    <div className="flex w-full items-end ">
      <div className="flex w-8/12 justify-start gap-16 ">
        <TotalCard title="Users" amount={1000} plus={15} />
        <TotalCard title="Posts" amount={1000} plus={15} />
        <TotalCard title="Reports" amount={1000} plus={15} />
      </div>
      <div className="mr-16 w-4/12  rounded-[10px] border p-4 shadow-md">
        <Notification />
      </div>
    </div>
  );
};

export default BodyCard;
