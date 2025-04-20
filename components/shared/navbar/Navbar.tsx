"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sheet, SheetClose } from "@/components/ui/sheet";
import { navbarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Theme from "../theme/Theme";
import Search from "../search/Search";
import { getMyProfile } from "@/lib/services/user.service";
import SettingModal from "./SettingModal";
import { useAuth } from "@/context/AuthContext";
import Notification from "../notification/Notification";
import NavbarTab from "@/components/ui/navbarTab";

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
    <nav className="flex-between background-light200_dark200 fixed z-50 w-full py-[10px] px-[35px]">
      <Link href="/" className="flex items-center gap-1 w-[256px]">
        <p className="text-dark100_light100 text-[40px] font-medium logo">
          Min
          <span className="text-[40px] font-medium text-primary-100">gle</span>
        </p>
      </Link>

      <div className="hidden w-[32%] sm:flex gap-[84px]">
        <Sheet>
          {navbarLinks.map((item) => {
            const isDrawerLink =
              item.route === "/search" || item.route === "/notifications";

            const isActive = isDrawerLink
              ? activeDrawer === item.route
              : pathname === item.route;
            return (
              <NavbarTab
                key={item.route}
                item={item}
                isActive={isActive}
                type={isDrawerLink ? "drawer" : "link"}
                toggleDrawer={toggleDrawer}
              />
            );
          })}
        </Sheet>
      </div>

      <div className="flex justify-center items-center gap-4 w-[256px]">
        <Theme />
        {profile ? (
          <SettingModal profile={profile} logout={logout} />
        ) : (
          <Link href="/sign-in">
            <button className="rounded bg-primary-100 px-4 py-2 text-white">
              Login
            </button>
          </Link>
        )}
      </div>

      {isDrawerOpen && (
        <div className="background-light200_dark200 fixed left-0 top-16 z-50 size-full shadow-lg md:w-1/2 lg:w-1/3">
          <div className="mt-5">
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
