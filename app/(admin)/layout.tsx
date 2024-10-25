"use client";
import Sidebar from "@/components/shared/sidebar/Sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex w-full cursor-default bg-white">
      <div className=" bg-white">
        <Sidebar />
      </div>

      <div className={`ml-64 w-[84%] bg-white`}>
        <section className="h-screen w-full ">
          <div className="background-light500_dark200">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
