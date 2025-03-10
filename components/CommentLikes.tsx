"use client";

import React from "react";
import { FaHeart } from "react-icons/fa";
import { addLikeToCommentAction } from "@/app/actions/likeActions";

const Likes = ({
  userId,
  commentId,
  currentLikes,
}: {
  userId: string;
  commentId: string;
  currentLikes: string[];
}) => {
  function handleLikeComment(): void {
    addLikeToCommentAction({ userId, commentId });
  }

  return (
    <div className="flex items-center mt-1">
      <button onClick={handleLikeComment} className="cursor-pointer">
        <FaHeart
          color={currentLikes.includes(userId) ? "red" : "gray"}
          className="w-5 h-5"
        />
      </button>
      <span className="ml-2">{currentLikes.length}</span>
    </div>
  );
};

export default Likes;
