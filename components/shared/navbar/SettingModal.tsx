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
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChangePassword from "@/components/forms/user/setting/ChangePassword";
import { getMyLikedPosts, getMySavedPosts } from "@/lib/services/user.service";
import Button from "@/components/ui/button";
import { PostResponseDTO } from "@/dtos/PostDTO";
import SavedPosts from "@/components/forms/user/setting/SavedPosts";
import LikedPosts from "@/components/forms/user/setting/LikedPosts";

const SettingModal = ({ profile, logout }: any) => {
  const router = useRouter();
  const [isSetting, setIsSetting] = useState(false);
  const [isViewProfile, setIsViewProfile] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [likedPosts, setLikedPosts] = useState<PostResponseDTO[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostResponseDTO[]>([]);

  useEffect(() => {
    if (!isFavorite || !profile?._id) return;

    let isMounted = true;

    const fetchLikedPostsData = async () => {
      try {
        const listPost = await getMyLikedPosts(profile._id);
        if (isMounted) {
          setLikedPosts(listPost);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchLikedPostsData();

    return () => {
      isMounted = false;
    };
  }, [isFavorite, profile?._id]);

  useEffect(() => {
    if (!isSave || !profile?._id) return; // Ensure profile and _id are available

    let isMounted = true; // Flag to check if the component is still mounted

    const fetchSavedPostsData = async () => {
      try {
        const listPost = await getMySavedPosts(profile._id); // Fetch saved posts
        // console.log(listPost);
        if (isMounted) {
          setSavedPosts(listPost); // Set saved posts if component is still mounted
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchSavedPostsData();

    return () => {
      isMounted = false;
    };
  }, [isSave, profile?._id]);

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
      <Link href="/" className=" text-primary-100">
        <p className="hidden lg:block text-[16px] font-semibold">
          {profile.firstName} {profile.lastName}
        </p>
      </Link>
      <Menubar className="relative border-none bg-transparent  shadow-none focus:outline-none">
        <MenubarMenu>
          <MenubarTrigger>
            {" "}
            <Image
              src={profile?.avatar || "/assets/images/capy.jpg"}
              alt="Avatar"
              width={40}
              height={40}
              className="size-[40px] rounded-full object-cover"
            />
          </MenubarTrigger>
          <MenubarContent className="text-dark100_light100 rounded-[10px]  background-light200_dark200 mt-2 h-auto w-52 border-none font-sans text-sm ">
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
                  Change Password
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
                title="Logout"
                size="large"
                color="bg-primary-100"
                fontColor="text-dark100_light100"
                onClick={() => handleLogout()}
              />
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="flex w-auto  sm:hidden">
        <MobileNav />
      </div>
      {isSetting && <ChangePassword onClose={closeSetting} />}
      {isFavorite && (
        <LikedPosts
          onClose={closeFavorite}
          likedPosts={likedPosts}
          setLikedPosts={setLikedPosts}
        />
      )}
      {isSave && (
        <SavedPosts
          savedPosts={savedPosts}
          setSavedPosts={setSavedPosts}
          onClose={closeSave}
        />
      )}
    </>
  );
};

export default SettingModal;
