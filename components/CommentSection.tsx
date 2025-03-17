"use client";
import { fetchComments } from "@/app/actions/fetchAction";
import React, { useEffect, useState } from "react";
import {
  CommentInterface,
  PostInterface,
  SessionInterface,
  UserInterface,
} from "@/types/types";
import { AiFillCloseCircle } from "react-icons/ai";
import Comment from "./Comment";
import ReplyInput from "./CommentOrReplyInput";

const CommentSection = ({
  post,
  session,
  user,
  showComments,
  setShowComments,
}: {
  post: PostInterface;
  session: SessionInterface;
  user: UserInterface;
  showComments: boolean;
  setShowComments: (showComments: boolean) => void;
}) => {
  const [comments, setComments] = useState<CommentInterface[]>([]);

  useEffect(() => {
    if (showComments) {
      fetchComments(post?.id as string).then((newComments) =>
        setComments(newComments)
      );
    }
  }, [showComments, post?.id]);

  return (
    <div
      className={`bg-white rounded-t-xl shadow-3xl fixed h-[calc(70vh)] bottom-[calc(-70vh)] w-full m-w-inherit  ${
        showComments ? "translate-y-[calc(-70vh)] " : "invisible"
      } transition-all`}
    >
      <AiFillCloseCircle
        className="absolute top-3 right-3"
        size={30}
        color={"gray"}
        onClick={() => {
          setComments([]);
          setShowComments(false);
        }}
      />
      <div className="flex justify-center py-4 font-bold text-[19px]">
        Comments
      </div>
      <div
        className={`h-[calc(100%-44.5px)] no-scrollbar overscroll-none overflow-scroll`}
      >
        <div className="md:px-8 px-4 pb-10">
          <ReplyInput
            className="mt-5"
            type="comment"
            previousComments={[]}
            postStory={post?.story as string}
            postId={post?.id as string}
            profilePicture={session?.user.image as string}
            profileColor={user?.randomColor as string}
            authorId={session?.user.id as string}
            authorName={session?.user.name as string}
            size={"large"}
            updateComments={() =>
              fetchComments(post?.id as string).then((newComments) =>
                setComments(newComments)
              )
            }
          />
          {comments.map(
            (comment) =>
              showComments && (
                <Comment
                  className="mt-3"
                  previousComments={[]}
                  comment={comment}
                  userId={user.id}
                  authorName={comment.author.name}
                  profileColor={comment.author.randomColor as string}
                  profilePicture={comment.author.image as string}
                  postStory={post?.story as string}
                  size={"large"}
                  key={comment.id}
                  updateComments={() =>
                    fetchComments(post?.id as string).then((newComments) =>
                      setComments(newComments)
                    )
                  }
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
