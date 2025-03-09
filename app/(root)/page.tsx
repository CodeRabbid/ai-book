import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";

const page = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="flex grow  justify-center ">
      <div className="max-w-xl grow">
        {posts.map((post) => (
          <Card className="px-8 block mb-3" key={post.id}>
            <Image
              src={post.picture_url}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
            />
            <div className="mt-4">
              {post.storyParagraphs.map((storyParagraph, index) => (
                <div key={index}>{storyParagraph}</div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
