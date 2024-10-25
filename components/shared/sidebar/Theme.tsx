"use client";
import React from "react";

import { useTheme } from "@/context/ThemeProvider";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Image from "next/image";
import { themes } from "@/constants";
import "@/styles/theme.css";

const Theme = () => {
  const { mode, setMode } = useTheme();
  return (
    <Menubar className="relative mt-2 border-none bg-transparent shadow-none">
      <MenubarMenu>
        <MenubarTrigger>
          {mode === "light" ? (
            <Image
              src="/assets/icons/sun.svg"
              alt="sun"
              width={20}
              height={20}
              className="active-theme"
            />
          ) : (
            <Image
              src="/assets/icons/moon.svg"
              alt="moon"
              width={20}
              height={20}
              className="active-theme"
            />
          )}
        </MenubarTrigger>
        <MenubarContent
          className="absolute -right-12 mt-3 min-w-[120px]
        rounded border border-white bg-white
       py-2 dark:border-black dark:bg-dark-100
        "
        >
          {themes.map((item) => (
            <MenubarItem
              key={item.value}
              className={`flex items-center gap-4 px-2.5 py-2 
              hover:bg-primary-100 focus:bg-primary-100 
              dark:focus:bg-primary-100
              ${
                mode === item.value
                  ? "font-regular text-primary-100  hover:text-white"
                  : "text-dark400_light600 font-regular  hover:text-white"
              } `}
              onClick={() => {
                setMode(item.value);
                if (item.value !== "system") {
                  localStorage.theme = item.value;
                } else {
                  localStorage.removeItem("theme");
                }
              }}
            >
              <Image
                src={item.icon}
                alt={item.value}
                width={16}
                height={16}
                className={`${mode === item.value && "active-theme"}`}
              />
              <p
              // className={` ${
              //   mode === item.value
              //     ? "text-primary-100 font-regular  hover:text-white"
              //     : "text-dark400_light600 font-regular  hover:text-white"
              // } `}
              >
                {item.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Theme;
