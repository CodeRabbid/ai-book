"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PostImage = ({
  pictureUrl,
  postId,
}: {
  pictureUrl: string;
  postId: string;
}) => {
  const router = useRouter();
  const handleRedirectToStory = () => {
    router.push(`/story/${postId}`);
  };
  return (
    <div className="cursor-pointer">
      <Image
        src={pictureUrl}
        alt=""
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-auto mt-3"
        onClick={handleRedirectToStory}
      />
    </div>
  );
};

export default PostImage;
