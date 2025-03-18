"use client";

import React, { useState } from "react";
import ReplyInput from "./CommentOrReplyInput";
import CommentLikes from "./CommentLikes";
import { cn, dateToPeriod } from "@/lib/utils";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { CommentInterface } from "@/types/types";
import ProfilePicture from "./ProfilePicture";

const Comment = ({
  className,
  previousComments,
  comment,
  userId,
  profilePicture,
  profileColor,
  authorName,
  postStory,
  size,
  postLanguage,
  updateComments,
}: {
  className?: string;
  previousComments: string[];
  comment: CommentInterface;
  userId: string;
  authorName: string;
  profileColor?: string;
  profilePicture?: string;
  postStory: string;
  size: string;
  postLanguage: string;
  updateComments: () => void;
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

  return (
    <div className={cn(className)}>
      <div className="flex w-full">
        <ProfilePicture
          size={size}
          image={comment.author.image as string}
          profileColor={comment.author.randomColor as string}
          name={comment.author.name}
        />
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
            type="reply"
            previousComments={[...previousComments, comment.content]}
            className={`${showCommentIntut ? "" : "hidden"}`}
            profilePicture={profilePicture as string}
            profileColor={profileColor}
            authorId={userId as string}
            authorName={authorName}
            comment={comment}
            postStory={postStory}
            setShowReplies={setShowReplies}
            updateComments={updateComments}
            postLanguage={postLanguage}
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
                    postLanguage={postLanguage}
                    size={"small"}
                    updateComments={updateComments}
                  />
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
