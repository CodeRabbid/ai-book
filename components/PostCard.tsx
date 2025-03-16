import { Card } from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { dateToPeriod } from "@/lib/utils";
import PostImage from "@/components/PostImage";
import { Button } from "@/components/ui/button";
import {
  CommentInterface,
  PostInterface,
  SessionInterface,
} from "@/types/types";
import { FaCommentDots } from "react-icons/fa";
import { fetchComments } from "@/app/actions/fetchAction";

const PostCard = ({
  post,
  session,
  setShowComments,
  setPost,
  setComments,
}: {
  post: PostInterface;
  session: SessionInterface;
  setShowComments: (showComments: boolean) => void;
  setPost: (post: PostInterface) => void;
  setComments: (newComments: CommentInterface[]) => void;
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
        {post.story.split("\n").map((storyParagraph: string, index: number) => (
          <div key={index}>{storyParagraph}</div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-4">
          <PostLikes
            userId={session?.user.id as string}
            currentLikes={post.likes}
            postId={post.id}
          />
          <FaCommentDots
            className="cursor-pointer"
            color="gray"
            size={21.86}
            onClick={() => {
              setShowComments(true);
              setPost(post);
              fetchComments(post.id).then((newComments) =>
                setComments(newComments)
              );
            }}
          />
        </div>
        <a href={`/create/sequel/${post.id}#${post.id}`}>
          <Button>Generate Sequel</Button>
        </a>
      </div>
    </Card>
  );
};

export default PostCard;
