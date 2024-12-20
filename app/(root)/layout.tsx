import Navbar from "@/components/shared/navbar/Navbar";
import { ChatItemProvider } from "@/context/ChatItemContext";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChatItemProvider>
      <main className="background-light800_dark400 relative h-full">
        <Navbar />
        <div className=" background-light800_dark400 flex h-full">
          <section className=" background-light800_dark400 flex flex-1 flex-col">
            <div className=" background-light800_dark400 mx-auto size-full">
              {children}
            </div>
          </section>
        </div>
      </main>
    </ChatItemProvider>
  );
};

export default Layout;
