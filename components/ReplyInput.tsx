"use client";
import React, { FormEvent } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { addCommentToComment } from "@/app/actions/commentAction";

type HTMLElementEvent<T extends HTMLElement> = FormEvent & {
  target: T;
  currentTarget: T;
};

const CommentOnCommentInput = ({
  className,
  profilePicture,
  authorId,
  commentId,
  setShowReplies,
}: {
  className: string;
  profilePicture: string;
  authorId: string;
  commentId: string;
  setShowReplies: (bool: boolean) => void;
}) => {
  const submitComment = async (e: HTMLElementEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = e.target.comment.value;
    if (content !== "") {
      await addCommentToComment({ commentId, content, authorId });
    }
    setShowReplies(true);
    e.target.reset();
  };

  return (
    <div className={className}>
      <div className="flex mt-3 mb-2 items-center gap-2">
        <div className="rounded-full overflow-hidden h-6 w-6 shrink-0">
          <Image
            src={profilePicture}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            className="h-6 w-6"
          />
        </div>
        <form onSubmit={submitComment} className="w-full">
          <Input name="comment" placeholder="Add a comment..."></Input>
        </form>
      </div>
    </div>
  );
};

export default CommentOnCommentInput;
