import React from "react";
import aiBookLogo from "../assets/aiBook.svg";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="fixed flex w-full m-w-inherit">
      <div className="grow-0 p-3">
        <Link href={"/"}>
          <Image src={aiBookLogo} alt="logo" height={40} />
        </Link>
      </div>
      <div className="flex items-center grow-100000">Searchbar</div>
      <div className="flex items-center mx-3 grow-0">
        <Link href={"/login"}>
          <button className="cursor-pointer bg-black text-white p-3">
            Login
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
