import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";

const page = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      author: {},
    },
  });

  return (
    <div className="flex grow  justify-center ">
      <div className="max-w-xl grow">
        {posts.map((post) => (
          <Card className="px-8 block mb-3" key={post.id}>
            <div className="flex  items-center gap-2">
              <div className="rounded-full overflow-hidden h-10 w-10">
                {post.author.image ? (
                  <Image
                    src={post.author.image as string}
                    width={40}
                    height={40}
                    alt=""
                  />
                ) : (
                  <div className="flex items-center justify-center text-white bg-purple-500 h-10 w-10">
                    {post.author.name?.charAt(0)}
                  </div>
                )}
              </div>
              {post.author.name}
            </div>
            <Image
              src={post.picture_url}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto mt-3"
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
