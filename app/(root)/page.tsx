import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { auth } from "@/auth";
import CommentInput from "@/components/CommentInput";
import CommentLikes from "@/components/CommentLikes";
import { dateToPeriod } from "@/lib/utils";

const page = async () => {
  const session = await auth();
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {},
      comments: { orderBy: { createdAt: "desc" }, include: { author: {} } },
    },
  });

  return (
    <div className="flex grow  justify-center">
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
            <PostLikes
              userId={session?.user.id as string}
              currentLikes={post.likes}
              postId={post.id}
            />
            <CommentInput
              profilePicture={session?.user.image as string}
              authorId={session?.user.id as string}
              postId={post.id}
            />
            <div className="mt-5">
              {post.comments.map((comment) => (
                <div key={comment.id} className="mt-3">
                  <div className="flex">
                    <div className="h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={comment.author.image as string}
                        alt=""
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center">
                        <div className="text-sm">{comment.author.name}</div>
                        <div className="text-sm ml-2">
                          {dateToPeriod(comment.createdAt)}
                        </div>
                      </div>
                      <div className="mt-1">{comment.content}</div>
                      <CommentLikes
                        userId={session?.user.id as string}
                        currentLikes={comment.likes}
                        commentId={comment.id}
                      />
                    </div>
                  </div>
                </div>
              ))}{" "}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
