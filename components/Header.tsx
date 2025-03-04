import React from "react";
import aiBookLogo from "../assets/aiBook.svg";
import Image from "next/image";

const Header = () => {
  return (
    <div className="flex justify-between">
      <div>
        <Image src={aiBookLogo} alt="logo" height={40} className="m-3" />
      </div>
      <div className="flex items-center mx-3">Login</div>
    </div>
  );
};

export default Header;
