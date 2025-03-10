"use client";
import React, { FormEvent } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { addCommentToPost } from "@/app/actions/commentAction";

type HTMLElementEvent<T extends HTMLElement> = FormEvent & {
  target: T;
  currentTarget: T;
};

const CommentInput = ({
  profilePicture,
  authorId,
  authorName,
  postId,
}: {
  profilePicture: string;
  authorId: string;
  postId: string;
  authorName: string;
}) => {
  const submitComment = async (e: HTMLElementEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = e.target.comment.value;
    if (content !== "") {
      await addCommentToPost({ postId, content, authorId });
    }
    e.target.reset();
  };

  return (
    <div className="flex mt-3 h-10 items-center gap-2">
      <div className="rounded-full overflow-hidden h-10 w-10 shrink-0">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            className="h-10 w-10"
          />
        ) : (
          <div className="flex items-center justify-center text-white bg-purple-500 h-10 w-10">
            {authorName?.charAt(0)}
          </div>
        )}
      </div>
      <form onSubmit={submitComment} className="w-full">
        <Input name="comment" placeholder="Add a comment..."></Input>
      </form>
    </div>
  );
};

export default CommentInput;
