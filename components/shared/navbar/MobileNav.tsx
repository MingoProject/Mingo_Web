import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faBell,
  faMessage,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <FontAwesomeIcon
          icon={faBars}
          className="text-dark100_light500 ml-3 hidden text-2xl  sm:flex"
        />
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
        <div className="ml-5 mt-14 flex flex-col items-start">
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
        </div>
        <div>
          <SheetClose asChild></SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
