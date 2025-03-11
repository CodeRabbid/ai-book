import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { auth } from "@/auth";
import { dateToPeriod } from "@/lib/utils";
import PostImage from "@/components/PostImage";

const page = async () => {
  const session = await auth();
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {},
    },
  });

  return (
    <div className="flex grow justify-center">
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
            <PostImage pictureUrl={post.picture_url} postId={post.id} />
            <div className="mt-4">
              {post.storyParagraphs.map((storyParagraph, index) => (
                <div key={index}>{storyParagraph}</div>
              ))}
            </div>
            <PostLikes
              userId={session?.user.id as string}
              currentLikes={post.likes}
              postId={post.id}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
