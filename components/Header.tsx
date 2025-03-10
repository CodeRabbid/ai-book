import React from "react";
import aiBookLogo from "../assets/aiBook.svg";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import prisma from "@/lib/prisma";

const Header = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
  });
  return (
    <header className="fixed flex w-full m-w-inherit bg-white">
      <div className="grow-0 p-3 cursor-pointer">
        <Link href={"/"}>
          <Image src={aiBookLogo} alt="logo" height={35} />
        </Link>
      </div>
      <div className="flex items-center justify-center grow-100000">
        Searchbar
      </div>
      <div className="flex items-center mx-3 grow-0">
        {session && session?.user ? (
          <>
            <Link href={"/create"}>
              <Button variant="default" className="mr-2">
                + Create
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="rounded-full overflow-hidden h-10 w-10 cursor-pointer">
                  {user?.image ? (
                    <Image
                      src={user.image as string}
                      alt=""
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="h-10 w-10"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center text-white  h-10 w-10"
                      style={{
                        backgroundColor: user?.randomColor as string,
                      }}
                    >
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <form action={handleSignOut} className="flex justify-end">
                  <Button variant="default" type="submit">
                    Sing Out
                  </Button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
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
