"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navbarLinks } from "@/constants";
import Search from "../search/Search";
import Notification from "../notification/Notification";

const MobileNav = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState("");

  const toggleDrawer = (drawerType: string) => {
    if (activeDrawer === drawerType) {
      setDrawerOpen(false);
      setActiveDrawer("");
    } else {
      setDrawerOpen(true);
      setActiveDrawer(drawerType);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveDrawer("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          alt="menu"
          width={30}
          height={30}
          className="invert-colors ml-3 sm:hidden"
        />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light700_dark300 border-none"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <p className="text-dark100_light500 text-2xl">
            Min<span className="text-2xl text-primary-100 ">gle</span>
          </p>
        </Link>

        {/* Sidebar Links */}
        <section className="text-dark100_light500 flex h-full flex-col gap-4 pt-16">
          {navbarLinks.map((item) => {
            const isDrawerLink =
              item.route === "/search" || item.route === "/notifications";

            const isActive = isDrawerLink
              ? activeDrawer === item.route
              : (pathname.includes(item.route) && item.route.length > 1) ||
                pathname === item.route;

            return isDrawerLink ? (
              <div
                key={item.route}
                onClick={() => toggleDrawer(item.route)}
                className={`${
                  isActive
                    ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                    : "text-dark100_light500"
                } flex h-[43px] cursor-pointer items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Icon className="text-2xl text-light-500" icon={item.icon} />

                <p
                  className={`text-light-500 ${isActive ? "font-medium" : "font-medium"}`}
                >
                  {item.label}
                </p>
              </div>
            ) : (
              <SheetClose asChild key={item.route}>
                <Link
                  href={item.route}
                  className={`${
                    isActive
                      ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                      : "text-dark100_light500"
                  } flex h-[43px] items-center justify-start gap-4 bg-transparent p-4`}
                >
                  <Icon className="text-2xl text-light-500" icon={item.icon} />

                  <p
                    className={` ${isActive ? "text-dark100_light500 font-medium" : "font-medium text-light-500"}`}
                  >
                    {item.label}
                  </p>
                </Link>
              </SheetClose>
            );
          })}
        </section>
      </SheetContent>

      {/* Drawer Content */}
      {isDrawerOpen && (
        <div className="background-light700_dark300 fixed left-0 top-16 z-50 size-full shadow-lg md:w-1/2 lg:w-2/5">
          <div className="p-6">
            <button
              className="absolute right-4 top-4 text-lg"
              onClick={closeDrawer}
            >
              <Icon
                icon="mingcute:close-line"
                className="text-dark100_light500 mt-5"
              />
            </button>
            {activeDrawer === "/search" && <Search closeDrawer={closeDrawer} />}
            {activeDrawer === "/notifications" && (
              <Notification closeDrawer={closeDrawer} />
            )}
          </div>
        </div>
      )}
    </Sheet>
  );
};

export default MobileNav;
