"use client";

import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { addLikeToPostAction } from "@/app/actions/likeActions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PostLikes = ({
  className,
  userId,
  postId,
  currentLikes,
}: {
  className?: string;
  userId?: string;
  postId: string;
  currentLikes: string[];
}) => {
  const [currentLikesLocal, setCurrentLikesLocal] = useState(currentLikes);
  const router = useRouter();

  const handlePostLike = async () => {
    if (!userId) {
      router.push("/auth/sigin");
    } else {
      if (currentLikesLocal.includes(userId)) {
        setCurrentLikesLocal(
          currentLikesLocal.filter((like) => like !== userId)
        );
      } else {
        setCurrentLikesLocal([...currentLikesLocal, userId]);
      }
      addLikeToPostAction({ postId });
    }
  };

  return (
    <div className={cn(className)}>
      <div className="flex items-center">
        <button onClick={handlePostLike} className="cursor-pointer">
          <FaHeart
            color={
              userId && currentLikesLocal.includes(userId) ? "red" : "gray"
            }
            className="w-5 h-5"
          />
        </button>
        <span className="ml-2">{currentLikesLocal.length}</span>
      </div>
    </div>
  );
};

export default PostLikes;
