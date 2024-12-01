import Favorite from "@/components/home/Favorite";
import Setting from "@/components/home/Setting";
import ViewProfile from "@/components/home/ViewProfile";
import { Button } from "@/components/ui/button";
import {
  faGear,
  faFloppyDisk,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from "@radix-ui/react-menubar";
import React, { useEffect, useState } from "react";
import MobileNav from "./MobileNav";
import Image from "next/image";
import { PostYouLikeDTO } from "@/dtos/PostDTO";
import {
  getPostsLikedByUser,
  getPostsSavedByUser,
} from "@/lib/services/setting.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Save from "@/components/home/Save";

const SettingModal = ({ profile, setProfile, logout }: any) => {
  const router = useRouter();

  const [isSetting, setIsSetting] = useState(false);
  const [isViewProfile, setIsViewProfile] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [listLikePosts, setListLikePosts] = useState<PostYouLikeDTO[]>([]);
  const [listSavePosts, setListSavePosts] = useState<PostYouLikeDTO[]>([]);

  useEffect(() => {
    if (!isFavorite || !profile?._id) return;

    let isMounted = true;

    const fetchPostsData = async () => {
      try {
        const listPost = await getPostsLikedByUser(profile._id);
        if (isMounted) {
          setListLikePosts(listPost);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsData();

    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [isFavorite, profile?._id]); // Safely access profile._id

  useEffect(() => {
    if (!isSave || !profile?._id) return; // Ensure profile and _id are available

    let isMounted = true; // Flag to check if the component is still mounted

    const fetchPostsData = async () => {
      try {
        const listPost = await getPostsSavedByUser(profile._id); // Fetch saved posts
        if (isMounted) {
          setListSavePosts(listPost); // Set saved posts if component is still mounted
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsData();

    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [isSave, profile?._id]); // Safely access profile._id

  const handleIsSetting = () => {
    setIsSetting(true);
  };

  const closeSetting = () => {
    setIsSetting(false);
  };

  const closeViewProfile = () => {
    setIsViewProfile(false);
  };

  const handleIsFavorite = () => {
    setIsFavorite(true);
  };

  const closeFavorite = () => {
    setIsFavorite(false);
  };

  const handleIsSave = () => {
    setIsSave(true);
  };

  const closeSave = () => {
    setIsSave(false);
  };

  const handleLogout = async () => {
    try {
      logout();
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };
  return (
    <>
      <Link href="/" className="mr-3 text-primary-100 ">
        <p className="hidden md:block">
          {profile.firstName} {profile.lastName}
        </p>
      </Link>
      <Menubar className="relative border-none bg-transparent   shadow-none focus:outline-none">
        <MenubarMenu>
          <MenubarTrigger>
            {" "}
            <Image
              src={profile?.avatar || "/assets/images/capy.jpg"}
              alt="Avatar"
              width={30}
              height={30}
              className="size-7 rounded-full object-cover"
            />
          </MenubarTrigger>
          <MenubarContent className="text-dark100_light500 background-light700_dark300 mt-2 h-auto w-52 border-none font-sans text-sm ">
            <MenubarItem className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20  ">
              <Link href={`/profile/${profile._id}`} className="">
                <div className="flex items-center gap-2">
                  <Image
                    src={profile?.avatar || "/assets/images/capy.jpg"}
                    alt="Avatar"
                    width={30}
                    height={30}
                    className="size-8 rounded-full object-cover"
                  />
                  <p className="text-ellipsis whitespace-nowrap  text-base font-normal">
                    Personal page
                  </p>
                </div>
              </Link>
            </MenubarItem>
            <MenubarItem
              onClick={handleIsSetting}
              className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20"
            >
              {" "}
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faGear}
                  className="text-dark100_light500"
                />
                <p className="text-ellipsis whitespace-nowrap  text-base">
                  Setting
                </p>
              </div>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onClick={handleIsSave}
              className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20"
            >
              {" "}
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  className="text-dark100_light500"
                />
                <p className="text-ellipsis whitespace-nowrap  text-base">
                  Saved posts
                </p>
              </div>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem
              onClick={handleIsFavorite}
              className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20"
            >
              {" "}
              <div className="flex items-center gap-2 ">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-dark100_light500"
                />
                <p className="text-ellipsis whitespace-nowrap  text-base">
                  Liked posts
                </p>
              </div>
            </MenubarItem>
            <MenubarItem className="flex cursor-pointer items-center px-4 py-2 before:border-none after:border-none focus:outline-none dark:hover:bg-primary-100/20">
              {" "}
              <Button
                onClick={handleLogout}
                className="h-[30px] w-full bg-primary-100 text-center text-base text-white"
              >
                Logout
              </Button>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="flex w-auto  sm:hidden">
        <MobileNav />
      </div>
      {isViewProfile && <ViewProfile onClose={closeViewProfile} />}
      {isSetting && <Setting onClose={closeSetting} />}
      {isFavorite && <Favorite post={listLikePosts} onClose={closeFavorite} />}
      {isSave && <Save post={listSavePosts} onClose={closeSave} />}
    </>
  );
};

export default SettingModal;
