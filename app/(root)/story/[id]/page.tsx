import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { auth } from "@/auth";
import { dateToPeriod } from "@/lib/utils";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();

  const id = (await params).id;

  const post = await prisma.post.findFirst({
    where: {
      id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      sequels: true,
      author: {},
    },
  });

  return (
    <div className="flex grow justify-center">
      <div className="max-w-xl grow">
        {post && (
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
                  <div
                    className="flex items-center justify-center text-white  h-10 w-10"
                    style={{
                      backgroundColor: post.author.randomColor as string,
                    }}
                  >
                    {post.author.name?.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-[14px]">{post.author.name}</div>
                <div className="text-[14px]">
                  {dateToPeriod(post.createdAt)}
                </div>
              </div>
            </div>
            <Image
              src={post.picture_url as string}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto mt-3"
            />
            <div className="mt-4">
              {post.story?.split("\n").map((storyParagraph, index) => (
                <div key={index}>{storyParagraph}</div>
              ))}
            </div>
            <PostLikes
              className="mt-4"
              userId={session?.user.id as string}
              currentLikes={post.likes as string[]}
              postId={post.id as string}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default page;
