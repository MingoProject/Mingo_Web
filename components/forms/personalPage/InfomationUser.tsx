import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface InfomationUserProps {
  job: string;
  hobbies: string[];
  address: string;
}

const InfomationUser = ({ job, hobbies, address }: InfomationUserProps) => {
  return (
    <div className="mx-[10%] mt-4 rounded-lg border py-4">
      <div className="flex h-[39px] w-[186px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100  text-white">
        Detailed infomation
      </div>
      <div className="ml-[5%] mt-4 block w-full ">
        <div>
          {job ? (
            <div>
              <span className="text-dark100_light500 ">
                Job: <span className="font-semibold">{job}</span>
              </span>
            </div>
          ) : null}{" "}
          {address ? (
            <div className="mt-4  flex w-full items-center">
              <div className="text-dark100_light500 block  w-2/3 justify-between lg:flex">
                {" "}
                {address ? (
                  <div>
                    <span className="text-dark100_light500 ">Address: </span>
                    <span className="text-dark100_light500 font-semibold">
                      {address}
                    </span>
                  </div>
                ) : null}
                {/* {address.district ? (
                  <div className="mt-4 lg:mt-0">
                    <span className="text-dark100_light500 ">District: </span>
                    <span className="text-dark100_light500 font-semibold">
                      {address.district}
                    </span>
                  </div>
                ) : null}
                {address.city ? (
                  <div className="mt-4 lg:mt-0">
                    <span className="text-dark100_light500 ">City: </span>
                    <span className="text-dark100_light500 font-semibold">
                      {address.city}
                    </span>
                  </div>
                ) : null}
                {address.country ? (
                  <div className="mt-4 lg:mt-0">
                    <span className="text-dark100_light500 ">Country: </span>
                    <span className="text-dark100_light500 font-semibold">
                      {address.country}
                    </span>
                  </div>
                ) : null} */}
              </div>
            </div>
          ) : null}{" "}
          {/* Hoặc bạn có thể không cần dòng này nếu không muốn hiển thị gì khi job là null */}
          {hobbies.length > 0 && (
            <div className="mt-4 flex items-center">
              <span className="text-dark100_light500 ">Hobbies: </span>
              <div className="text-dark100_light500 flex">
                {" "}
                {hobbies.map((hobby, index) => (
                  <div
                    key={index}
                    className="mx-2 flex items-center rounded-lg border px-2 py-1"
                  >
                    {/* <Icon
                      icon={hobby.icon}
                      className=" mr-1 text-xl text-primary-100"
                    />{" "} */}
                    {/* Hiển thị icon */}
                    <span>{hobby}</span> {/* Hiển thị tên sở thích */}
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
          {/* Hoặc bạn có thể không cần dòng này nếu không muốn hiển thị gì khi job là null */}
        </div>
      </div>
      <div className="mr-[5%] flex items-center ">
        <Button className="ml-[5%] mr-[2%] mt-4 bg-primary-100 text-white">
          {" "}
          Xem tất cả
        </Button>
        <Icon
          icon="solar:pen-broken"
          className="ml-auto text-2xl text-primary-100"
        ></Icon>
      </div>
    </div>
  );
};

export default InfomationUser;
