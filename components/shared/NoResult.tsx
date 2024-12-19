import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center">
      <Image
        src="/assets/images/light-illustration.png"
        alt="No result illustration"
        width={270}
        height={270}
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        alt="No result illustration"
        width={270}
        height={270}
        className="hidden object-contain dark:flex"
      />

      <h2 className="text-dark100_light500 mt-5">{title}</h2>
      <p className="text-dark100_light500">{description}</p>

      <Link href={link}>
        <button className="mt-3 rounded-md border bg-primary-100 px-3 py-2 text-white">
          {linkTitle}
        </button>
      </Link>
    </div>
  );
};

export default NoResult;
