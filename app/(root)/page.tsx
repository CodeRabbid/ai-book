import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";

const page = async () => {
  const posts = await prisma.post.findMany();

  console.log(posts);

  return (
    <div className="flex grow  justify-center p-4 ">
      <div className="max-w-2xl grow">
        {posts.map((post) => (
          <Card className="px-8 block mt-3" key={post.id}>
            <Image
              src={post.picture_url}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
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
