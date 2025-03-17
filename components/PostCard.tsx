"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { dateToPeriod } from "@/lib/utils";
import PostImage from "@/components/PostImage";
import { Button } from "@/components/ui/button";
import { PostInterface, SessionInterface, UserInterface } from "@/types/types";
import { FaCommentDots } from "react-icons/fa";
import SequelsSection from "./SequelsSection";
import CommentSection from "./CommentSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiDotsHorizontal } from "react-icons/hi";
import { deletePostAction } from "@/app/actions/postAction";
import { useRouter } from "next/navigation";

const PostCard = ({
  post,
  session,
  user,
  id,
}: {
  post: PostInterface;
  session: SessionInterface;
  user: UserInterface;
  id: string;
}) => {
  const router = useRouter();
  const [showComments, setShowComments] = useState<boolean>(false);
  const deletePost = async () => {
    await deletePostAction({ postId: post.id });
    router.push("/");
  };

  return (
    <>
      <Card className="px-8 block mb-3" key={post.id} id={id}>
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
            .map((storyParagraph: string, index: number) => (
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
              }}
            />
          </div>
          {post.author.id === user.id ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <HiDotsHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-36">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <a href={`/create/sequel/${post.id}#${post.id}`}>
                      Generate Sequel
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={deletePost}
                  >
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <a href={`/create/sequel/${post.id}#${post.id}`}>
              <Button>Generate Sequel</Button>
            </a>
          )}
        </div>
        <SequelsSection sequels={post.sequels} />
      </Card>
      <CommentSection
        post={post as PostInterface}
        session={session}
        user={user}
        showComments={showComments}
        setShowComments={setShowComments}
      />
    </>
  );
};

export default PostCard;
