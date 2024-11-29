import { Button } from "@/components/ui/button";
import { updateUserBio } from "@/lib/services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const Bio = ({ profile, setProfile }: any) => {
  const [showEditBio, setShowEditBio] = useState(false);
  const [bio, setBio] = useState(profile?.bio || "");
  const [me, setMe] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId && userId === profile._id) {
      setMe(true);
    }
  }, [profile._id]);

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
          setProfile((prevProfile: any) => ({
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
    <div className="mt-[30px]">
      <span className="text-dark100_light500">
        {profile?.bio || "Bio not provided"}
      </span>
      {me && (
        <Icon
          icon="solar:pen-broken"
          className="ml-auto text-lg text-primary-100"
          onClick={() => setShowEditBio(true)}
        />
      )}

      {showEditBio && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="background-light700_dark300 text-dark100_light500 my-32 max-h-screen w-[90%] overflow-y-auto rounded-lg bg-white p-6 shadow-lg md:w-4/5 lg:w-1/2">
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
              <Button
                className="bg-gray-300 text-black"
                onClick={() => setShowEditBio(false)}
              >
                Close
              </Button>
              <Button
                className="bg-primary-100 text-white"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bio;
