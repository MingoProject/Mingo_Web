import Link from "next/link";
import { Icon } from "@iconify/react";
import { SheetClose } from "@/components/ui/sheet";

interface NavbarTabProps {
  item: {
    route: string;
    icon: string;
    label: string;
  };
  isActive: boolean;
  type: "drawer" | "link";
  toggleDrawer?: (route: string) => void;
}

const NavbarTab = ({ item, isActive, type, toggleDrawer }: NavbarTabProps) => {
  const baseClass =
    "flex cursor-pointer items-center justify-center gap-[20px] bg-transparent";
  const activeClass =
    "background-light400_dark400 text-dark100_light100 rounded-[12px] px-[15px] py-[10px]";
  const inactiveClass = "text-dark100_light100";
  const content = (
    <>
      <Icon className="text-[24px]" icon={item.icon} />
      {isActive && <p className="text-[16px] font-medium">{item.label}</p>}
    </>
  );
  if (type === "drawer") {
    return (
      <div
        onClick={() => toggleDrawer?.(item.route)}
        className={`${isActive ? activeClass : inactiveClass} ${baseClass}`}
      >
        {content}
      </div>
    );
  }

  return (
    <SheetClose asChild>
      <Link
        href={item.route}
        className={`${isActive ? activeClass : inactiveClass} ${baseClass}`}
      >
        {content}
      </Link>
    </SheetClose>
  );
};

export default NavbarTab;
