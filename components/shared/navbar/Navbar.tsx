import Link from "next/link";
import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faMagnifyingGlass,
  faBell,
  faMessage,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Theme from "./Theme";
import MobileNav from "./MobileNav";

const Navbar = () => {
  return (
    <nav className="flex-between background-light700_dark300 fixed z-50 w-full gap-5 p-6 sm:px-12">
      <Link href="/" className="flex items-center gap-1">
        <p className="text-dark100_light500 text-2xl">
          Min<span className="text-2xl text-primary-100 ">gle</span>
        </p>
        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </p>
      </Link>
      <div className="hidden w-auto  sm:flex">
        <Link href="/" className="mr-16 md:mr-20">
          <FontAwesomeIcon
            icon={faHouse}
            className="text-2xl text-light-500 "
          />
        </Link>
        <Link href="/" className="mr-16 md:mr-20">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-2xl text-light-500 "
          />
        </Link>
        <Link href="/" className="mr-16 md:mr-20">
          <FontAwesomeIcon icon={faBell} className="text-2xl text-light-500 " />
        </Link>
        <Link href="/" className="">
          <FontAwesomeIcon
            icon={faMessage}
            className="text-2xl text-light-500 "
          />
        </Link>
      </div>
      <div className="flex-between w-auto">
        <Theme />
        <Link href="/" className="mr-3 text-primary-100 ">
          <p className="hidden md:block">Huỳnh Nguyễn</p>
        </Link>
        <Link href="/" className="">
          <Image
            src="/assets/images/4d7b4220f336f18936a8c33a557bf06b.jpg"
            alt="Avatar"
            width={30}
            height={30}
            className="rounded-full"
          />
        </Link>
        <div className="flex w-auto  sm:hidden">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
