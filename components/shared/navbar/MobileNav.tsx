"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

const NavContent = () => {
  const pathname = usePathname();
  return (
    <section className="flex h-full flex-col gap-4 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`${
                isActive
                  ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                  : "text-dark100_light500"
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Icon
                className=" text-2xl text-light-500"
                icon={item.icon}
              ></Icon>

              <p className={`${isActive ? "font-medium" : "font-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => {
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
        {/* <FontAwesomeIcon
          icon={faBars}
          className="text-dark100_light500 ml-3 hidden text-2xl  sm:flex"
        /> */}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="background-light700_dark300 border-none"
      >
        <Link href="/" className="flex items-center gap-1">
          <p className="text-dark100_light500 text-2xl">
            Min<span className="text-2xl text-primary-100 ">gle</span>
          </p>
        </Link>
        {/* <div className="ml-5 mt-14 flex flex-col items-start">
          <div className="mb-14 flex items-center">
            <Link href="/" className="text-2xl text-light-500">
              <FontAwesomeIcon icon={faHouse} />
            </Link>
            <span className="text-dark100_light500 ml-5 text-2xl">Home</span>
          </div>
          <div className="mb-14 flex items-center">
            <Link href="/" className="text-2xl text-light-500">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Link>
            <span className="text-dark100_light500 ml-5 text-2xl">Search</span>
          </div>
          <div className="mb-14 flex items-center">
            <Link href="/" className="text-2xl text-light-500">
              <FontAwesomeIcon icon={faBell} />
            </Link>
            <span className="text-dark100_light500 ml-5 text-2xl">
              Notification
            </span>
          </div>
          <div className="flex items-center">
            <Link href="/" className="text-2xl text-light-500">
              <FontAwesomeIcon icon={faMessage} />
            </Link>
            <span className="text-dark100_light500 ml-5 text-2xl">Message</span>
          </div>
        </div> */}
        <div>
          <SheetClose asChild>
            <NavContent />
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
