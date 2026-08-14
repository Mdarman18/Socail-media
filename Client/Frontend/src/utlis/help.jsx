import React from "react";
import { images } from "../data/data";

const Help = () => {
  return (
    <div className="flex items-center gap-3">
      {images.map((ele, index) => (
        <img
          key={index}
          className="h-10 w-10 rounded-full object-cover"
          src={ele}
          alt=""
        />
      ))}

      <div className="flex flex-col items-center">
        <button className="rounded-3xl bg-blue-500 px-3 py-1 text-white">
          Follow
        </button>

        <span className="text-sm text-gray-500">1.2k</span>
      </div>
    </div>
  );
};

export default Help;
