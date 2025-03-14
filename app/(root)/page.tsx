import prisma from "@/lib/prisma";
import React from "react";
import { auth } from "@/auth";
import LoadMore from "@/components/LoadMore";
import { SessionInterface, UserInterface } from "@/types/types";

const page = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
  });

  return (
    <>
      <div className="flex grow justify-center">
        <div className="max-w-xl grow">
          <LoadMore
            session={session as SessionInterface}
            user={user as UserInterface}
          />
        </div>
      </div>
    </>
  );
};

export default page;
