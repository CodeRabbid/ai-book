"use client";

import React from "react";
import Image from "next/image";
import { CommentInterface } from "@/types/types";

const ProfilePicture = ({
  size,
  image,
  profileColor,
  name,
}: {
  size: string;
  image?: string;
  profileColor?: string;
  name?: string;
}) => {
  return size === "large" ? (
    <div className="rounded-full overflow-hidden h-10 w-10 shrink-0">
      {image ? (
        <Image
          src={image as string}
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
            backgroundColor: profileColor as string,
          }}
        >
          {name?.charAt(0)}
        </div>
      )}
    </div>
  ) : (
    <div className="rounded-full overflow-hidden h-6 w-6 shrink-0">
      {image ? (
        <Image
          src={image as string}
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
            backgroundColor: profileColor as string,
          }}
        >
          {name?.charAt(0)}
        </div>
      )}
    </div>
  );
};
export default ProfilePicture;
