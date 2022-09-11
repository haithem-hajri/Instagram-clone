import React from "react";
import InstaIcon from "../icons/InstaIcon";
const AuthNavbar = () => {
  return (
    <div className="h-16 border-b border-solid border-gray-100 fixed w-full z-50 top-0 bg-white ">
      <div className="nav-wrapper max-w-6xl h-full m-auto flex justify-center items-center  ">
        <h2 className="text-center">
          <InstaIcon />
        </h2>
      </div>
    </div>
  );
};

export default AuthNavbar;
