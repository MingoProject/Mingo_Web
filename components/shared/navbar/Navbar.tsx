"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "./Theme";
import Search from "../search/Search";
import { getMyProfile } from "@/lib/services/user.service";
import SettingModal from "./SettingModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import Notification from "../notification/Notification";

export const notifications = [
  {
    id: 1,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "John Doe đã thích bài viết của bạn.",
    createdAt: "2024-09-28T14:35:00Z",
  },
  {
    id: 2,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Alice đã bình luận về bài viết của bạn: 'Thật tuyệt vời!'",
    createdAt: "2024-09-28T13:20:00Z",
  },
  {
    id: 3,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Bob đã gửi cho bạn một lời mời kết bạn.",
    createdAt: "2024-09-28T12:05:00Z",
  },
  {
    id: 4,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Charlie đã chia sẻ bài viết của bạn.",
    createdAt: "2024-09-27T18:15:00Z",
  },
  {
    id: 5,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Diana đã nhắc đến bạn trong một bình luận.",
    createdAt: "2024-09-27T16:45:00Z",
  },
  {
    id: 6,
    avatar:
      "https://i.pinimg.com/originals/d5/d7/a1/d5d7a147b4693d7c1d8951dee97d2b0e.jpg",
    content: "Eve đã thích ảnh hồ sơ mới của bạn.",
    createdAt: "2024-09-27T15:30:00Z",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { profile, setProfile, logout } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const profileData = await getMyProfile(userId);
          if (isMounted) {
            setProfile(profileData.userProfile);
          }
        }
      } catch (err) {
        setError("Failed to fetch profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleDrawer = (drawerType: any) => {
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

  if (loading) return <div className="mt-96">Loading...</div>;
  if (error) return <div className="mt-96">Error: {error}</div>;

  return (
    <nav className="flex-between background-light700_dark300 fixed z-50 h-[79px] w-full gap-5 border-b p-6 dark:border-transparent sm:px-5 md:flex md:flex-row md:items-center">
      <Link href="/" className="flex items-center gap-1">
        <p className="text-dark100_light500 text-3xl">
          Min<span className="text-3xl text-primary-100 ">gle</span>
        </p>
      </Link>

      {/* Sidebar links */}
      <div className="hidden w-auto sm:flex md:flex sm:justify-center">
        <Sheet>
          {navbarLinks.map((item) => {
            // Check if the route is for a drawer (Search, Notifications) or a regular link
            const isDrawerLink =
              item.route === "/search" || item.route === "/notifications";

            // Modify the active condition to check both the pathname and activeDrawer state for drawer links
            const isActive = isDrawerLink
              ? activeDrawer === item.route // Use activeDrawer for Search and Notifications
              : pathname === item.route; // Use pathname for regular links

            return isDrawerLink ? (
              <div
                key={item.route}
                onClick={() => toggleDrawer(item.route)}
                className={`${
                  isActive
                    ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                    : "text-dark100_light500"
                } ml-[12%] flex h-[43px] cursor-pointer items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Icon className="text-2xl text-light-500" icon={item.icon} />
                {isActive && (
                  <p className={`${isActive ? "font-medium" : "font-medium"}`}>
                    {item.label}
                  </p>
                )}
              </div>
            ) : (
              <SheetClose asChild key={item.route}>
                <Link
                  href={item.route}
                  className={`${
                    isActive
                      ? "background-light600_dark200 text-dark100_light500 rounded-lg"
                      : "text-dark100_light500"
                  } ml-[12%] flex h-[43px] items-center justify-start gap-4 bg-transparent p-4`}
                >
                  <Icon className="text-2xl text-light-500" icon={item.icon} />
                  {isActive && (
                    <p
                      className={`${isActive ? "font-medium" : "font-medium"}`}
                    >
                      {item.label}
                    </p>
                  )}
                </Link>
              </SheetClose>
            );
          })}
        </Sheet>
      </div>

      {/* Right side options */}
      <div className="flex-between w-auto ">
        <Theme />
        {profile ? (
          <SettingModal
            profile={profile}
            setProfile={setProfile}
            logout={logout}
          />
        ) : (
          <Link href="/sign-in">
            <Button className="rounded bg-primary-100 px-4 py-2 text-white">
              Login
            </Button>
          </Link>
        )}
      </div>

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
            {activeDrawer === "/search" && (
              <>
                <Search closeDrawer={closeDrawer} />
              </>
            )}
            {activeDrawer === "/notifications" && (
              <Notification closeDrawer={closeDrawer} />
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
