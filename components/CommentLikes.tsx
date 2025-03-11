"use client";

import React, { useState } from "react";
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
  const [currentLikesLocal, setCurrentLikesLocal] = useState(currentLikes);

  const handleLikeComment = async () => {
    if (currentLikesLocal.includes(userId)) {
      setCurrentLikesLocal(currentLikesLocal.filter((like) => like !== userId));
    } else {
      setCurrentLikesLocal([...currentLikesLocal, userId]);
    }
    addLikeToCommentAction({ userId, commentId });
  };

  return (
    <div className="flex items-center">
      <button onClick={handleLikeComment} className="cursor-pointer">
        <FaHeart
          color={currentLikesLocal.includes(userId) ? "red" : "gray"}
          className="w-5 h-5"
        />
      </button>
      <span className="ml-2">{currentLikesLocal.length}</span>
    </div>
  );
};

export default Likes;
