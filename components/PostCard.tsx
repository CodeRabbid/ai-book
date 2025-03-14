import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { auth } from "@/auth";
import { dateToPeriod } from "@/lib/utils";
import PostImage from "@/components/PostImage";
import { Button } from "@/components/ui/button";
import Comment from "@/components/Comment";
import CommentInput from "@/components/CommentOrReplyInput";
import LoadMore from "@/components/LoadMore";

const PostCard = ({
  post,
  session,
  user,
}: {
  post: any;
  session: any;
  user: any;
}) => {
  return (
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
          <div className="text-[14px]">{dateToPeriod(post.createdAt)}</div>
        </div>
      </div>
      <PostImage pictureUrl={post.picture_url} postId={post.id} />
      <div className="mt-4">
        {post.story
          .split("\n")
          .map((storyParagraph: string[], index: number) => (
            <div key={index}>{storyParagraph}</div>
          ))}
      </div>
      <div className="flex justify-between items-center mt-3">
        <PostLikes
          userId={session?.user.id as string}
          currentLikes={post.likes}
          postId={post.id}
        />
        <a href={`/create/sequel/${post.id}#${post.id}`}>
          <Button>Generate Sequel</Button>
        </a>
      </div>
      {session?.user && (
        <CommentInput
          className="mt-5"
          type="comment"
          previousComments={[]}
          postStory={post.story}
          postId={post.id as string}
          profilePicture={session?.user.image as string}
          profileColor={user?.randomColor as string}
          authorId={session?.user.id as string}
          authorName={post.author.name as string}
        />
      )}
      <div className="mt-5">
        {post.comments.map((comment: CommentType) => (
          <div key={comment.id} className="mt-3 w-full">
            <Comment
              previousComments={[]}
              size={"large"}
              comment={comment as CommentType}
              authorName={session?.user.name as string}
              userId={session?.user.id as string}
              profileColor={user?.randomColor as string}
              profilePicture={session?.user.image as string}
              postStory={post.story}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PostCard;
