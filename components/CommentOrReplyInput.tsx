"use client";
import React, { ChangeEvent, useRef, useState } from "react";

import Image from "next/image";
import { addCommentToPost, addReply } from "@/app/actions/commentAction";
import { generateComment, generateReply } from "@/app/actions/generateAction";
import { DropdownMenu, DropdownMenuContent } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { timeout } from "@/lib/utils";
import { IoSend } from "react-icons/io5";
import { CustomSlider } from "./CustomSlider";
import LoadingButton from "./LoadingButton";
import { Form } from "./ui/form";
import { useForm } from "react-hook-form";
import { CommentInterface } from "@/types/types";
import ProfilePicture from "./ProfilePicture";

const moodList = [
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
  size,
  setShowReplies,
  updateComments,
}: {
  type: string;
  previousComments: string[];
  className?: string;
  profilePicture: string;
  authorId: string;
  authorName: string;
  profileColor?: string;
  comment?: CommentInterface;
  postStory: string;
  size?: string;
  postId?: string;
  setShowReplies?: (bool: boolean) => void;
  updateComments: () => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [checkedState, setCheckedState] = useState(
    new Array(moodList.length).fill(false)
  );
  const [wordCount, setWordcount] = useState<number>(12);
  const textInput = useRef<HTMLTextAreaElement>(null);

  const form = useForm();

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
        wordCount,
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
        wordCount,
      });
    }

    setInputValue(generatedComment);
    adjustTextAreaLineHeight();
    await timeout(40);
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

  const handleSend = async () => {
    if (inputValue !== "") {
      if (type === "reply" && comment && setShowReplies) {
        await addReply({
          commentId: comment.id,
          content: inputValue,
          authorId,
        });
        setShowReplies(true);
      } else if (type === "comment" && postId) {
        await addCommentToPost({
          postId,
          content: inputValue,
          authorId,
        });
      }
      updateComments();
      setInputValue("");
    }
  };

  const handleOnChange = (position: number) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  };

  const handleSetWordCount = (event: Event, value: number | number[]) => {
    setWordcount(value as number);
  };

  return (
    <div className={className}>
      <div className="flex items-start mt-3 mb-2 gap-2">
        <div
          className={`rounded-full overflow-hidden ${
            type === "comment" ? "h-10 w-10" : "h-6 w-6"
          } shrink-0`}
        >
          <ProfilePicture
            size={size as string}
            image={profilePicture}
            profileColor={profileColor}
            name={authorName}
          />
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
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleGenerate)}
                className="space-y-8"
              >
                <LoadingButton
                  className="rounded-l-full border-y-solid border-y-[2px] border-y-white border-l-solid border-l-[2px] border-l-white bg-black text-white cursor-pointer pb-[19px] pt-[18px] pr-[14px] text-[14px] w-23"
                  pending={form.formState.isSubmitting}
                >
                  Generate
                </LoadingButton>
              </form>
            </Form>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-[1px] rounded-r-full border-y-solid border-y-[2px] border-y-white   bg-black text-white cursor-pointer py-2 p pr-4 pl-3 text-[14px]">
                  <FaChevronDown size={13} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="flex flex-col  px-4 pt-4 pb-2">
                  <div className="grid grid-cols-2 gap-3">
                    {moodList.map((mood, index) => (
                      <div className="flex items-center" key={mood.value}>
                        <input
                          className="accent-black cursor-pointer h-5 w-5 "
                          type="checkbox"
                          id={mood.value}
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
                  <div className="mt-4 text-sm font-bold">Words:</div>
                  <CustomSlider
                    min={3}
                    max={120}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    value={wordCount}
                    onChange={handleSetWordCount}
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              className="ml-[1px] rounded-full  border-white border-solid border-[2px]   bg-black text-white cursor-pointer py-2 p px-3 text-[14px]"
              onClick={handleSend}
            >
              <IoSend size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyInput;
