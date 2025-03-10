"use client";

import React, { useState } from "react";
import ReplyInput from "./ReplyInput";
import CommentLikes from "./CommentLikes";
import Image from "next/image";
import { dateToPeriod } from "@/lib/utils";
import { FaChevronDown } from "react-icons/fa";

interface Comment {
  author?: { name: string };
  createdAt: Date;
  content: string;
  likes: string[];
  id: string;
  comments?: Comment[];
}

const Comment = ({
  comment,
  userId,
  profilePicture,
  size,
}: {
  comment: Comment;
  userId: string;
  profilePicture: string;
  size: string;
}) => {
  const [showCommentIntut, setShowCommentIntut] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex w-full">
      {size === "large" ? (
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
      ) : (
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
      )}

      <div className="ml-3 w-full">
        <div className="flex items-center">
          <div className="text-[13px]">{comment.author?.name}</div>
          <div className="text-[13px] ml-2">
            {dateToPeriod(comment.createdAt)}
          </div>
        </div>
        <div className="text-[14px] mt-1">{comment.content}</div>
        <div className="flex items-center mt-1">
          <CommentLikes
            userId={userId as string}
            currentLikes={comment.likes}
            commentId={comment.id}
          />
          <button
            onClick={() => setShowCommentIntut(true)}
            className="rounded-full ml-2 text-xs py-2 px-3 hover:bg-gray-100"
          >
            Reply
          </button>
        </div>
        <ReplyInput
          className={`${showCommentIntut ? "" : "hidden"}`}
          profilePicture={profilePicture as string}
          authorId={userId as string}
          commentId={comment.id}
        />
        <button
          className={`text-[13px] flex items-center cursor-pointer rounded-full px-3 py-2 hover:bg-blue-100 ${
            comment.comments?.length == 0 ? "hidden" : ""
          }`}
          onClick={() => setShowReplies(true)}
        >
          <FaChevronDown
            color={"#065fd4"}
            className={`${showReplies ? "rotate-[180deg]" : ""}`}
          />
          <span className="ml-2 text-[#065fd4] font-bold">
            {comment.comments?.length}
            {comment.comments?.length === 1 ? " reply" : " replies"}
          </span>
        </button>
        <div className="mt-2">
          {showReplies ? (
            comment.comments?.map((reply) => (
              <div key={reply.id}>
                <Comment
                  comment={reply}
                  userId={userId}
                  profilePicture={profilePicture}
                  size={"small"}
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
