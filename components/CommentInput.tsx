"use client";
import React, { ChangeEvent, useRef, useState, KeyboardEvent } from "react";
import Image from "next/image";
import { addCommentToPost } from "@/app/actions/commentAction";
import { generateComment } from "@/app/actions/generateAction";
import { FaChevronDown } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const moodList = [
  { value: "neutral", label: "Neutral" },
  { value: "rude", label: "Rude" },
  { value: "dad-joke", label: "Dad joke" },
  { value: "deep", label: "Deep" },
  { value: "silly", label: "Silly" },
];

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

  const [checkedState, setCheckedState] = useState(
    new Array(moodList.length).fill(false)
  );

  const handleGenerate = async () => {
    const generatedComment = await generateComment({
      postStory,
      moods: moodList
        .map((mood, index) => {
          if (checkedState[index]) return mood.value;
        })
        .filter((mood) => {
          return mood !== undefined;
        }),
    });
    setInputValue(generatedComment);
    textInput.current?.focus();
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const content = event.currentTarget.value;
      if (content !== "") {
        await addCommentToPost({
          postId,
          content,
          authorId,
        });
      }
      setInputValue("");
    }
  };

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
                <div className="flex items-center mx-1 my-1" key={mood.value}>
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
  );
};

export default CommentInput;
