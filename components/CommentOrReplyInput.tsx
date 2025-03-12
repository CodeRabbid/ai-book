"use client";
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

import Image from "next/image";
import { addCommentToPost, addReply } from "@/app/actions/commentAction";
import { generateComment, generateReply } from "@/app/actions/generateAction";
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FaChevronDown } from "react-icons/fa";

const moodList = [
  { value: "neutral", label: "Neutral" },
  { value: "rude", label: "Rude" },
  { value: "dad-joke", label: "Dad joke" },
  { value: "deep", label: "Deep" },
  { value: "silly", label: "Silly" },
];

const ReplyInput = ({
  type,
  previousComments,
  className,
  profilePicture,
  authorId,
  authorName,
  postId,
  profileColor,
  comment,
  postStory,
  setShowReplies,
}: {
  type: string;
  previousComments: string[];
  className?: string;
  profilePicture: string;
  authorId: string;
  authorName: string;
  profileColor?: string;
  comment?: CommentType;
  postStory: string;
  postId?: string;
  setShowReplies?: (bool: boolean) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [checkedState, setCheckedState] = useState(
    new Array(moodList.length).fill(false)
  );
  const textInput = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    let generatedComment;
    if (type === "comment") {
      generatedComment = await generateComment({
        postStory,
        moods: moodList
          .map((mood, index) => {
            if (checkedState[index]) return mood.value;
          })
          .filter((mood) => {
            return mood !== undefined;
          }),
      });
    } else {
      generatedComment = await generateReply({
        postStory,
        previousComments,
        moods: moodList
          .map((mood, index) => {
            if (checkedState[index]) return mood.value;
          })
          .filter((mood) => {
            return mood !== undefined;
          }),
      });
    }

    setInputValue(generatedComment);
    adjustTextAreaLineHeight();
    adjustTextAreaLineHeight();
    textInput.current?.focus();
  };

  const adjustTextAreaLineHeight = () => {
    if (textInput.current) {
      textInput.current.style.height = "inherit";
      textInput.current.style.height = ` ${textInput.current.scrollHeight}px`;
    }
  };

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
    adjustTextAreaLineHeight();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const content = event.currentTarget.value;
    if (event.key === "Enter" && content !== "") {
      event.preventDefault();
      if (type === "reply" && comment && setShowReplies) {
        await addReply({ commentId: comment.id, content, authorId });
        setShowReplies(true);
      } else if (type === "comment" && postId) {
        await addCommentToPost({
          postId,
          content,
          authorId,
        });
      }
      setInputValue("");
    }
  };

  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  return (
    <div className={className}>
      <div className="flex items-start mt-3 mb-2 gap-2">
        <div
          className={`rounded-full overflow-hidden ${
            type === "comment" ? "h-10 w-10" : "h-6 w-6"
          } shrink-0`}
        >
          {profilePicture ? (
            <Image
              src={profilePicture}
              alt=""
              width={0}
              height={0}
              sizes="100vw"
              className={type === "comment" ? "h-10 w-10" : "h-6 w-6"}
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
        <div className="rounded-[20px] border-solid border-[1px] flex-col pl-4 pt-3 flex w-full">
          <div className="pr-4">
            <textarea
              className="w-full text-[14px] focus:outline-none resize-none"
              name="comment"
              ref={textInput}
              placeholder={`Add a ${type}...`}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-l-full border-y-solid border-y-[2px] border-y-white border-l-solid border-l-[2px] border-l-white bg-black text-white cursor-pointer py-2 px-4 text-[14px]"
              onClick={handleGenerate}
            >
              Generate
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-[1px] rounded-r-full border-y-solid border-y-[2px] border-y-white border-r-solid border-r-[2px] border-r-white bg-black text-white cursor-pointer py-2 p pr-4 pl-3 text-[14px]">
                  <FaChevronDown size={13} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <div className="flex flex-col m-1">
                  {moodList.map((mood, index) => (
                    <div
                      className="flex items-center mx-1 my-1"
                      key={mood.value}
                    >
                      <input
                        type="checkbox"
                        name={mood.value}
                        value={mood.value}
                        checked={checkedState[index]}
                        onChange={() => handleOnChange(index)}
                      />
                      <label
                        htmlFor={mood.value}
                        className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {mood.label}
                      </label>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyInput;
