import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { auth } from "@/auth";
import CommentInput from "@/components/CommentInput";
import Comment from "@/components/Comment";

const page = async () => {
  const session = await auth();
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {},
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: {}, comments: {} },
      },
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
                <div key={comment.id} className="mt-7 w-full">
                  <Comment
                    size={"large"}
                    comment={comment}
                    userId={session?.user.id as string}
                    profilePicture={session?.user.image as string}
                  />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default page;
