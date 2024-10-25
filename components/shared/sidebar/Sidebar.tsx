"use client";
import Link from "next/link";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Image from "next/image";
import Theme from "./Theme";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed z-50 h-screen w-64 border-r border-gray-100 bg-white p-6 shadow-md">
      <div className="flex flex-col items-center bg-white">
        <Image
          src="/assets/images/644ca5c74a1b194f2e0fabe66f3e4d60.jpg"
          alt="Avatar"
          width={60}
          height={60}
          priority
          className="mb-3 rounded-full"
        />
        <Link href="/admin/dashboard" className="text-dark400_primary100">
          <p className="hidden text-center md:block">Huỳnh Nguyễn</p>
        </Link>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <Icon
          icon="ion:search-outline"
          className="text-dark400_light600 mr-3 mt-2 text-2xl"
        />
        <Link href="/notification">
          <Icon
            icon="pepicons-pencil:bell"
            className="text-dark400_light600 mt-2 text-2xl"
          />
        </Link>

        <Theme />
      </div>

      <div className="mt-10">
        <span className="text-dark400_primary100 text-sm font-medium">
          Main menu
        </span>
      </div>

      <div className="mt-2 hidden sm:block">
        {sidebarLinks.map(({ route, icon, label }) => {
          const isActive =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          return (
            <Link
              key={route}
              href={route}
              className={`flex h-12 items-center gap-4 rounded-lg p-4 ${
                isActive
                  ? "primary-gradient text-light-500"
                  : "text-dark400_light600"
              }`}
            >
              <Icon
                icon={icon}
                className={`ml-2 text-2xl ${
                  isActive ? "text-light-500" : "text-dark400_light600"
                }`}
              />
              <p
                className={`${
                  isActive ? "text-light-500" : "text-dark400_light600"
                }`}
              >
                {label}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
