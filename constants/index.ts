import { NavbarLink, SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const navbarLinks: NavbarLink[] = [
  {
    icon: "fluent:home-20-regular",
    route: "/",
    label: "Home",
  },
  {
    icon: "iconoir:search",
    route: "/search",
    label: "Search",
  },
  {
    icon: "pepicons-pencil:bell",
    route: "/notifications",
    label: "Notifications",
  },
  {
    icon: "ant-design:message-outlined",
    route: "/message",
    label: "Messages",
  },
];

export const sidebarLinks: SidebarLink[] = [
  {
    icon: "majesticons:home-line",
    route: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: "hugeicons:contact-book",
    route: "/user",
    label: "User",
  },
  {
    icon: "hugeicons:note-edit",
    route: "/post",
    label: "Post",
  },
  {
    icon: "carbon:course",
    route: "/report",
    label: "Report",
  },
];

export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
};
