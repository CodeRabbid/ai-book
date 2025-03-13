import { auth } from "@/auth";
import GenerateForm from "@/components/GenerateSequelForm";
import { User } from "@prisma/client";
import React from "react";

const Page = async () => {
  const session = await auth();
  return (
    <GenerateForm
      question="What should your story be about?"
      placeholder='e.g. "Dragon chasing a princess", leave blank to keep it random'
      user={session?.user as User}
    />
  );
};

export default Page;
