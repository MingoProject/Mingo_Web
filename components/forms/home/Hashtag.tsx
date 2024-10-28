import React from "react";
import Hashtags from "../../../fakeData/Hashtags";

const Hashtag = () => {
  return (
    <div>
      <div className=" mx-auto h-auto w-[70%] rounded-lg  pt-3 ">
        <div>
          <div className="flex h-[39px] w-[150px] items-center justify-center rounded-r-lg border border-primary-100 bg-primary-100 text-white">
            Hashtags
          </div>
        </div>
        <ul className="ml-3 mt-3 space-y-2">
          {Hashtags.map((hashtag) => (
            <li key={hashtag.hashtag_id} className="text-dark100_light500">
              {hashtag.hashtag_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Hashtag;
