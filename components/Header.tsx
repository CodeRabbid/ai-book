import React from "react";
import aiBookLogo from "../assets/aiBook.svg";
import Image from "next/image";

const Header = () => {
  return (
    <header className="fixed flex w-full m-w-inherit">
      <div className="grow-0 p-3">
        <Image src={aiBookLogo} alt="logo" height={40} />
      </div>
      <div className="flex items-center grow-100000">Searchbar</div>
      <div className="flex items-center mx-3 grow-0">Login</div>
    </header>
  );
};

export default Header;
