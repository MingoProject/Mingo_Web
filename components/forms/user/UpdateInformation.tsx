import HobbyCard from "@/components/cards/other/HobbyCard";
import NameCard from "@/components/cards/other/NameCard";
import Button from "@/components/ui/button";
import ButtonClose from "@/components/ui/buttonClose";
import DatePickerTitle from "@/components/ui/datePickerTitle";
import InputTitle from "@/components/ui/inputTitle";
import SelectTitle from "@/components/ui/selectTitle";
import { UserResponseDTO } from "@/dtos/UserDTO";
import { updateInfo } from "@/lib/services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

interface InfomationUserProps {
  user: UserResponseDTO;
  setProfileUser: any;
  onClose: () => void;
}

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
  user,
  setProfileUser,
  onClose,
}: InfomationUserProps) => {
  const [formValues, setFormValues] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    nickName: user?.nickName || "",
    gender: user?.gender || false,
    job: user?.job || "",
    address: user?.address || "",
    relationShip: user?.relationShip || "",
    birthDay: user?.birthDay?.split("T")[0] || "", // chỉ lấy ngày nếu có ISO date
    attendDate: user?.attendDate || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
  });

  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    user?.hobbies
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies((prev: any) =>
      prev.includes(hobby)
        ? prev.filter((h: any) => h !== hobby)
        : [...prev, hobby]
    );
  };

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
          setProfileUser((prevProfile: any) => ({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="background-light200_dark200 max-w-2xl text-dark100_light100 my-32 max-h-screen w-4/5 overflow-y-auto rounded-md bg-white py-6 shadow-lg">
        <NameCard name="Update Information" />
        <div className="flex space-x-4 mt-4 px-5">
          {/* <div className="w-full">
            <label className="block text-sm font-medium ">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              className="background-light800_dark400 mt-1 w-full rounded-md border border-gray-300 p-2"
            />
          </div> */}
          <InputTitle
            label="First Name"
            placeholder="Enter your first name"
            value={formValues.firstName}
            onChange={handleChange}
          />
          <InputTitle
            label="Last Name"
            placeholder="Enter your last name"
            value={formValues.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4 flex space-x-4 px-5">
          <SelectTitle
            label="Gender"
            value={formValues.gender ? "true" : "false"}
            onChange={handleChange}
            options={["Male", "Female"]}
          />
          <InputTitle
            label="Nickname"
            placeholder="Enter your nickname"
            value={formValues.nickName}
            onChange={handleChange}
          />
        </div>
        <div className="mt-4 w-full space-y-4 px-5">
          {/* Job */}
          <div className="block space-y-4">
            <InputTitle
              label="Job"
              placeholder="Enter your job"
              value={formValues.job}
              onChange={handleChange}
            />
            {/* Address */}
            <InputTitle
              label="Address"
              placeholder="Enter your address"
              value={formValues.address}
              onChange={handleChange}
            />
          </div>
          {/* Relationship */}
          <div className="flex space-x-4">
            <SelectTitle
              label="Relationship"
              value={formValues.relationShip}
              onChange={handleChange}
              name="relationShip"
              options={[
                "Single",
                "In a relationship",
                "Married",
                "Divorced",
                "Widowed",
              ]}
            />
            <DatePickerTitle
              label="Date of birth"
              value={formValues.birthDay}
              onChange={handleChange}
            />
          </div>
        </div>
        {/* Hobbies */}
        <div className="mt-4 h-12 px-5">
          <label className="block text-sm font-medium ">Hobbies</label>
          <div className="mt-2 grid h-full grid-rows-1 gap-2 custom-scrollbar overflow-auto">
            <div className="flex w-max gap-2">
              {Object.entries(hobbyIcons).map(([name, icon]) => (
                <HobbyCard
                  key={name}
                  name={name}
                  icon={icon}
                  isSelected={selectedHobbies.includes(name)}
                  onClick={() => handleHobbyToggle(name)}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-10 flex justify-end space-x-2 px-5">
          <Button
            title="Close"
            size="small"
            color="transparent"
            border="border border-border-100"
            fontColor="text-dark100_light100"
            onClick={onClose}
          />
          <Button title="Save" size="small" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default UpdateInformation;
