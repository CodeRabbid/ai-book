"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import Image from "next/image";
import { addCommentToPost } from "@/app/actions/commentAction";
import { generateComment } from "@/app/actions/generateAction";

type HTMLElementEvent<T extends HTMLElement> = FormEvent & {
  target: T;
  currentTarget: T;
};

const CommentInput = ({
  postStory,
  profilePicture,
  authorId,
  authorName,
  profileColor,
  postId,
}: {
  postStory: string;
  profilePicture: string;
  authorId: string;
  profileColor: string;
  postId: string;
  authorName: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const textInput = useRef<HTMLInputElement>(null);

  // const submitComment = async (e: HTMLElementEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const content = e.target.comment.value;
  //   if (content !== "") {
  //     await addCommentToPost({ postId, content, authorId });
  //   }
  //   e.target.reset();
  // };

  const handleGenerate = async () => {
    const generatedComment = await generateComment(postStory);
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
        await addCommentToPost({ postId, content, authorId });
      }
      setInputValue("");
    }
  };

  // const handleKeyDown = (event: KeyboardEvent) => {
  //   if (event.key === "Enter") {
  //     alert("");
  //   }
  // };

  return (
    <div className="flex mt-3 h-10 items-center gap-2 w-full grow">
      <div className="rounded-full overflow-hidden h-10 w-10 shrink-0">
        {profilePicture ? (
          <Image
            src={profilePicture}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
            className="h-10 w-10"
          />
        ) : (
          <div
            className="flex items-center justify-center text-white  h-10 w-10"
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
          placeholder="Add a comment..."
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
  );
};

export default CommentInput;
function useFocus(): [any, any] {
  throw new Error("Function not implemented.");
}
