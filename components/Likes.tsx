"use client";

import React from "react";
import { FaHeart } from "react-icons/fa";
import { addLikeAction } from "@/app/actions/likeActions";

const Likes = ({
  userId,
  postId,
  currentLikes,
}: {
  userId: string;
  postId: string;
  currentLikes: string[];
}) => {
  function handlePost(): void {
    addLikeAction({ postId });
  }

  return (
    <div className="flex items-center mt-3">
      <button onClick={handlePost} className="cursor-pointer">
        <FaHeart color={currentLikes.includes(userId) ? "red" : "gray"} />
      </button>
      <span className="ml-2">{currentLikes.length}</span>
    </div>
  );
};

export default Likes;
