"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import Image from "next/image";
import { addCommentToPost } from "@/app/actions/commentAction";

const CommentInput = ({
  profilePicture,
  authorId,
  postId,
}: {
  profilePicture: string;
  authorId: string;
  postId: string;
}) => {
  const submitComment = async (e: {
    [x: string]: any;
    preventDefault: () => void;
  }) => {
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
        <Image
          src={profilePicture}
          alt=""
          width={0}
          height={0}
          sizes="100vw"
          className="h-10 w-10"
        />
      </div>
      <form onSubmit={submitComment} className="w-full">
        <Input name="comment" placeholder="Add a comment..."></Input>
      </form>
    </div>
  );
};

export default CommentInput;
