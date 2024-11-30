import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light800_dark400 relative">
      <Navbar />
      <div className=" flex">
        <section className=" background-light800_dark400 flex flex-1 flex-col">
          <div className=" background-light800_dark400 mx-auto w-full">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Layout;
