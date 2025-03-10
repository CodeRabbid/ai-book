"use client";

import React from "react";
import { FaHeart } from "react-icons/fa";
import { addLikeToPostAction } from "@/app/actions/likeActions";

const PostLikes = ({
  userId,
  postId,
  currentLikes,
}: {
  userId: string;
  postId: string;
  currentLikes: string[];
}) => {
  function handlePostLike(): void {
    addLikeToPostAction({ postId });
  }

  return (
    <div className="flex items-center mt-3">
      <button onClick={handlePostLike} className="cursor-pointer">
        <FaHeart
          color={currentLikes.includes(userId) ? "red" : "gray"}
          className="w-5 h-5"
        />
      </button>
      <span className="ml-2">{currentLikes.length}</span>
    </div>
  );
};

export default PostLikes;
