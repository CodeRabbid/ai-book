"use client";
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

import Image from "next/image";
import { addReply } from "@/app/actions/commentAction";
import { generateReply } from "@/app/actions/generateAction";

const ReplyInput = ({
  previousComments,
  className,
  profilePicture,
  authorId,
  authorName,
  profileColor,
  comment,
  postStory,
  setShowReplies,
}: {
  previousComments: string[];
  className: string;
  profilePicture: string;
  authorId: string;
  authorName: string;
  profileColor?: string;
  comment: CommentType;
  postStory: string;
  setShowReplies: (bool: boolean) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const textInput = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    const generatedComment = await generateReply(postStory, previousComments);
    setInputValue(generatedComment);
    textInput.current?.focus();
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const content = event.currentTarget.value;
      if (content !== "") {
        await addReply({ commentId: comment.id, content, authorId });
      }
      setShowReplies(true);
      setInputValue("");
    }
  };

  return (
    <div className={className}>
      <div className="flex mt-3 mb-2 items-center gap-2">
        <div className="rounded-full overflow-hidden h-6 w-6 shrink-0">
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className="h-6 w-6"
            />
          ) : (
            <div
              className="flex items-center text-xs capitalize justify-center text-white   h-6 w-6"
              style={{
                backgroundColor: profileColor as string,
              }}
            >
              {authorName?.charAt(0)}
            </div>
          )}
        </div>
        <div className="rounded-full border-solid border-[1px] justify-between pl-4 flex w-full">
          <input
            className="w-full text-[14px] focus:outline-none "
            name="comment"
            ref={textInput}
            placeholder="Add a reply..."
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className="rounded-full border-solid border-[2px] border-white bg-black text-white cursor-pointer py-2 px-4 text-[14px]"
            onClick={handleGenerate}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyInput;
