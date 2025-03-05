import React from "react";
import aiBookLogo from "../assets/aiBook.svg";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";
import { Button } from "./ui/button";

const Header = async () => {
  const session = await auth();
  return (
    <header className="fixed flex w-full m-w-inherit">
      <div className="grow-0 p-3 cursor-pointer">
        <Link href={"/"}>
          <Image src={aiBookLogo} alt="logo" height={40} />
        </Link>
      </div>
      <div className="flex items-center justify-center grow-100000">
        Searchbar
      </div>
      <div className="flex items-center mx-3 grow-0">
        {session && session?.user ? (
          <>
            <form action={handleSignOut}>
              <Button variant="default" type="submit">
                Sing Out
              </Button>
            </form>
            <span>{session.user?.name}</span>
          </>
        ) : (
          <div className="flex gap-1">
            <Link href={"/auth/signin"}>
              <Button variant="default" type="submit">
                Sign in
              </Button>
            </Link>
            <Link href={"/auth/signup"}>
              <Button variant="default" type="submit">
                Sign up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
