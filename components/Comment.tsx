"use client";

import React, { useState } from "react";
import ReplyInput from "./ReplyInput";
import CommentLikes from "./CommentLikes";
import Image from "next/image";
import { dateToPeriod } from "@/lib/utils";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Comment = ({
  previousComments,
  comment,
  userId,
  profilePicture,
  profileColor,
  authorName,
  postStory,
  size,
}: {
  previousComments: string[];
  comment: CommentType;
  userId: string;
  authorName: string;
  profileColor: string;
  profilePicture: string;
  postStory: string;
  size: string;
}) => {
  const [showCommentIntut, setShowCommentIntut] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const router = useRouter();

  const handleReplyClick = () => {
    if (!userId) {
      router.push("/auth/signin");
    } else {
      setShowCommentIntut(true);
    }
  };

  console.log(previousComments);

  return (
    <div className="flex w-full">
      {size === "large" ? (
        <div className="rounded-full overflow-hidden h-10 w-10 shrink-0">
          {comment.author?.image ? (
            <Image
              src={comment.author?.image as string}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="h-10 w-10"
            />
          ) : (
            <div
              className="flex items-center justify-center text-white h-10 w-10"
              style={{
                backgroundColor: comment.author?.randomColor as string,
              }}
            >
              {comment?.author?.name?.charAt(0)}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-full overflow-hidden h-6 w-6 shrink-0">
          {comment.author?.image ? (
            <Image
              src={comment.author?.image as string}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="h-6 w-6"
            />
          ) : (
            <div
              className="flex items-center justify-center text-xs capitalize text-white h-6 w-6"
              style={{
                backgroundColor: comment.author?.randomColor as string,
              }}
            >
              {comment?.author?.name?.charAt(0)}
            </div>
          )}
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
            onClick={handleReplyClick}
            className="rounded-full ml-2 text-xs py-2 px-3 hover:bg-gray-100"
          >
            Reply
          </button>
        </div>
        <ReplyInput
          previousComments={[...previousComments, comment.content]}
          className={`${showCommentIntut ? "" : "hidden"}`}
          profilePicture={profilePicture as string}
          profileColor={profileColor}
          authorId={userId as string}
          authorName={authorName}
          comment={comment}
          postStory={postStory}
          setShowReplies={setShowReplies}
        />
        <button
          className={`text-[13px] flex items-center cursor-pointer rounded-full px-3 py-2 hover:bg-blue-100 ${
            comment.comments?.length == 0 ? "hidden" : ""
          }`}
          onClick={() => setShowReplies(!showReplies)}
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
                  previousComments={[...previousComments, comment.content]}
                  authorName={authorName}
                  comment={reply}
                  userId={userId}
                  profilePicture={profilePicture}
                  profileColor={profileColor}
                  postStory={postStory}
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
