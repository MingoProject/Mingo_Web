"use client";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light800_dark400 flex w-full cursor-default">
      <div className=" bg-white">
        <Sidebar />
      </div>

      <div className={`background-light800_dark400 ml-64 w-[84%]`}>
        <section className="h-screen w-full ">
          <div className="background-light800_dark400">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
