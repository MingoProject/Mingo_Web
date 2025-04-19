import ButtonClose from "@/components/ui/buttonClose";
import { updateUserBio } from "@/lib/services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const Bio = ({ profileUser, setProfileUser }: any) => {
  const [showEditBio, setShowEditBio] = useState(false);
  const [bio, setBio] = useState(profileUser?.bio || "");
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const userId = localStorage.getItem("userId");

    if (userId && userId === profileUser._id) {
      if (isMounted) {
        setIsMe(true);
      }
    }
    return () => {
      isMounted = false; // Cleanup: Mark the component as unmounted
    };
  }, [profileUser._id]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(e.target.value);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const params = {
          bio,
        };

        const response = await updateUserBio(params, token);

        if (response?.status) {
          setProfileUser((prevProfile: any) => ({
            ...prevProfile,
            bio: response?.newProfile.bio,
          }));
          setShowEditBio(false);
        } else {
          console.error("Failed to update user information");
        }
      } else {
        console.log("Invalid token");
      }
    } catch (err) {
      console.error("Error updating user information:", err);
    }
  };

  return (
    <div className="mt-[15px]">
      <span className="text-dark100_light100 font-normal text-[20px]">
        {profileUser?.bio || "Bio not provided"}
      </span>
      <div className=" w-full">
        {isMe && (
          <div className="p-[7px] flex ml-auto  w-fit background-light400_dark400 rounded-full">
            <Icon
              icon="solar:pen-broken"
              className="text-primary-100 size-[20px]"
              onClick={() => setShowEditBio(true)}
            />
          </div>
        )}
      </div>

      {showEditBio && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="background-light700_dark300 text-dark100_light500 my-32 max-h-screen w-[90%] overflow-y-auto rounded-md bg-white p-6 shadow-lg md:w-4/5 lg:w-1/2">
            <div className="mt-4">
              <h2 className="mb-4 text-xl font-semibold text-primary-100">
                Update Bio
              </h2>
              <textarea
                className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
                value={bio}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="mt-10 flex justify-end space-x-2">
              <ButtonClose onClick={() => setShowEditBio(false)} />

              <button
                className="bg-primary-100 text-white"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bio;
