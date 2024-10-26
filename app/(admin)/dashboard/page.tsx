import React from "react";
import HeaderNoButton from "../../../components/header/HeaderNoButton";
import BodyCard from "../../../components/admin/dashboard/BodyCard";
import BodyTable from "../../../components/admin/dashboard/BodyTable";
const page = () => {
  return (
    <div className="background-light700_dark400 flex size-full flex-col p-4 pl-8">
      <HeaderNoButton />
      <BodyCard />
      <BodyTable />
    </div>
  );
};

export default page;
