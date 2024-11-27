import { Button } from "@/components/ui/button";
import { updateInfo } from "@/lib/services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

interface InfomationUserProps {
  firstName: string;
  lastName: string;
  nickName: string;
  gender: boolean;
  job: string;
  hobbies: string[];
  address: string;
  relationShip: string;
  birthDay: string;
  attendDate: string;
  phoneNumber: string;
  email: string;
  setProfile: any;
  onClose: () => void;
}

// hobbyIcons.ts
export const hobbyIcons: Record<string, string> = {
  Soccer: "mdi:soccer",
  Swimming: "mdi:swim",
  Running: "mdi:run",
  Reading: "mdi:book-open",
  Gaming: "mdi:controller-classic",
  Cooking: "mdi:chef-hat",
  Traveling: "mdi:airplane",
  Programming: "mdi:code-tags",
  Photography: "mdi:camera",
  Painting: "mdi:palette",
  Dancing: "mdi:dance-ballroom",
  Yoga: "mdi:yoga",
  Cycling: "mdi:bike",
  Fishing: "mdi:fishing",
  Gardening: "mdi:flower",
  Crafting: "mdi:scissors-cutting",
  "Watching Movies": "mdi:movie-open",
  "Listening to Music": "mdi:music",
  "Playing Chess": "mdi:chess-king",
  Singing: "mdi:microphone",
};

const UpdateInformation = ({
  firstName,
  lastName,
  nickName,
  gender,
  job,
  hobbies,
  address,
  relationShip,
  birthDay,
  attendDate,
  phoneNumber,
  email,
  setProfile,
  onClose,
}: InfomationUserProps) => {
  const [formValues, setFormValues] = useState({
    firstName,
    lastName,
    nickName,
    gender,
    job,
    hobbies,
    address,
    relationShip,
    birthDay,
    attendDate,
    phoneNumber,
    email,
  });

  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(hobbies);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Xử lý thay đổi sở thích
  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies((prev: any) =>
      prev.includes(hobby)
        ? prev.filter((h: any) => h !== hobby)
        : [...prev, hobby]
    );
  };

  // Xử lý lưu thông tin
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const params = {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          nickName: formValues.nickName,
          gender: formValues.gender,
          job: formValues.job,
          hobbies: selectedHobbies,
          address: formValues.address,
          relationShip: formValues.relationShip,
          birthDay: new Date(formValues.birthDay),
        };

        const response = await updateInfo(params, token);

        if (response?.status) {
          setProfile((prevProfile: any) => ({
            ...prevProfile,
            firstName: response?.newProfile.firstName,
            lastName: response?.newProfile.lastName,
            nickName: response?.newProfile.nickName,
            gender: response?.newProfile.gender,
            job: response?.newProfile.job,
            hobbies: response?.newProfile.hobbies,
            address: response?.newProfile.address,
            relationShip: response?.newProfile.relationShip,
            birthDay: response?.newProfile.birthDay,
          }));
          onClose();
        } else {
          console.error("Failed to update user information");
        }
      } else {
        console.log("invalid token");
      }
      // Tạo đối tượng params từ formValues và selectedHobbies
    } catch (err) {
      console.error("Error updating user information:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="background-light700_dark300 text-dark100_light500 my-32 max-h-screen w-4/5 overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold text-primary-100">
          Update Information
        </h2>
        <div className="flex space-x-4">
          <div className="w-full">
            <label className="block text-sm font-medium ">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium ">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-4">
          <div className="w-full">
            <label className="block text-sm font-medium ">Relationship</label>
            <select
              name="gender"
              value={formValues.gender ? "true" : "false"} // Chuyển boolean thành string "true" hoặc "false"
              onChange={handleChange}
              className="background-light800_dark400 mt-1 h-11 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">Select Gender</option>
              <option value="true">Male</option>
              <option value="false">Female</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium ">Nickname</label>
            <input
              type="text"
              name="nickName"
              value={formValues.nickName}
              onChange={handleChange}
              className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div>
        </div>
        <div className="mt-4 w-full space-y-4">
          {/* Job */}
          <div className="block lg:flex lg:space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium ">Job</label>
              <input
                type="text"
                name="job"
                value={formValues.job}
                onChange={handleChange}
                className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>
            {/* Address */}
            <div className="mt-4 w-full lg:mt-0">
              <label className="block text-sm font-medium ">Address</label>
              <input
                type="text"
                name="address"
                value={formValues.address}
                onChange={handleChange}
                className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
          {/* Relationship */}
          <div className="flex space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium ">Relationship</label>
              <select
                name="relationShip"
                value={formValues.relationShip}
                onChange={handleChange}
                className="background-light800_dark400 mt-1 h-11 w-full rounded-md border border-gray-300 p-2"
              >
                <option value="">Select Relationship</option>
                <option value="Single">Single</option>
                <option value="In a relationship">In a relationship</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium ">Birthday</label>
              <input
                type="date"
                name="birthDay"
                value={formValues.birthDay}
                onChange={handleChange}
                className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </div>
        </div>
        {/* Hobbies */}
        <div className="mt-4 h-12">
          <label className="block text-sm font-medium ">Hobbies</label>
          <div className="mt-2 grid h-full grid-rows-1 gap-2 overflow-x-auto">
            <div className="flex w-max gap-2">
              {Object.keys(hobbyIcons).map((hobby) => (
                <div
                  key={hobby}
                  className={`flex items-center space-x-2 rounded-lg border px-2 py-1 ${
                    selectedHobbies.includes(hobby)
                      ? "bg-primary-100 text-white"
                      : "background-light800_dark400"
                  }`}
                  onClick={() => handleHobbyToggle(hobby)}
                >
                  <Icon icon={hobbyIcons[hobby]} className="text-xl" />
                  <span>{hobby}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-10 flex justify-end space-x-2">
          <Button className="bg-gray-300 text-black" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-primary-100 text-white" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateInformation;
