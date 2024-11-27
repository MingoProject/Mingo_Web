import { Button } from "@/components/ui/button";
import { formattedDate } from "@/lib/utils";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import UpdateInformation from "./UpdateInformation";

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

const InfomationUser = ({
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
}: InfomationUserProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="mx-[10%] mt-4 rounded-lg border py-4">
      <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
        Detailed Information
      </div>
      <div className="ml-[5%] mt-4 block w-full">
        <div>
          {job && (
            <div>
              <span className="text-dark100_light500">
                Job: <span className="font-semibold">{job}</span>
              </span>
            </div>
          )}
          {address && (
            <div className="mt-4 flex w-full items-center">
              <div className="text-dark100_light500">
                <span>Address: </span>
                <span className="font-semibold">{address}</span>
              </div>
            </div>
          )}
          {hobbies.length > 0 && (
            <div className="mt-4 flex items-center">
              <span className="text-dark100_light500">Hobbies: </span>
              <div className="text-dark100_light500 flex w-4/5 overflow-x-auto">
                {hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="mx-2 flex items-center rounded-lg border px-2 py-1"
                  >
                    <Icon
                      icon={hobbyIcons[hobby] || "mdi:help-circle-outline"} // Default icon nếu không tìm thấy
                      className="mr-1 text-xl text-primary-100"
                    />
                    <span>{hobby}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {relationShip && (
            <div className="mt-4">
              <span className="text-dark100_light500">
                Relationship:{" "}
                <span className="font-semibold">{relationShip}</span>
              </span>
            </div>
          )}
          {showDetails && (
            <>
              {birthDay && (
                <div className="mt-4">
                  <span className="text-dark100_light500">
                    Birthday:{" "}
                    <span className="font-semibold">
                      {formattedDate(birthDay)}
                    </span>
                  </span>
                </div>
              )}
              {gender && (
                <div className="mt-4">
                  <span className="text-dark100_light500">
                    Gender:{" "}
                    <span className="font-semibold">
                      {gender ? "Male" : "Female"}
                    </span>
                  </span>
                </div>
              )}
              {attendDate && (
                <div className="mt-4">
                  <span className="text-dark100_light500">
                    Attend date:{" "}
                    <span className="font-semibold">
                      {formattedDate(attendDate)}
                    </span>
                  </span>
                </div>
              )}
              {phoneNumber && (
                <div className="mt-4">
                  <span className="text-dark100_light500">
                    Phone number:{" "}
                    <span className="font-semibold">{phoneNumber}</span>
                  </span>
                </div>
              )}
              {email && (
                <div className="mt-4">
                  <span className="text-dark100_light500">
                    Email: <span className="font-semibold">{email}</span>
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="mr-[5%] flex items-center">
        <Button
          className="ml-[5%] mr-[2%] mt-4 text-left  text-primary-100"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hidden" : "See all"}
        </Button>
        <Icon
          icon="solar:pen-broken"
          className="ml-auto text-2xl text-primary-100"
          onClick={() => setShowEdit(true)}
        />
      </div>
      {showEdit && (
        <UpdateInformation
          firstName={firstName}
          lastName={lastName}
          nickName={nickName}
          gender={gender}
          job={job}
          hobbies={hobbies}
          address={address}
          relationShip={relationShip}
          birthDay={birthDay}
          attendDate={attendDate}
          phoneNumber={phoneNumber}
          email={email}
          setProfile={setProfile}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
};

export default InfomationUser;
