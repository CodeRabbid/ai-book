"use client";
import { fetchComments, fetchPosts } from "@/app/actions/fetchAction";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import {
  CommentInterface,
  PostInterface,
  SessionInterface,
  UserInterface,
} from "@/types/types";
import { AiFillCloseCircle } from "react-icons/ai";
import Comment from "./Comment";
import ReplyInput from "./CommentOrReplyInput";

let page = 0;

const LoadMore = ({
  session,
  user,
}: {
  session: SessionInterface;
  user: UserInterface;
}) => {
  const { ref, inView } = useInView();
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [post, setPost] = useState<PostInterface>();
  const [comments, setComments] = useState<CommentInterface[]>([]);

  useEffect(() => {
    if (inView) {
      fetchPosts(page).then((newPosts) => {
        setPosts([...posts, ...newPosts]);
        page++;
      });
    }
  }, [inView, posts]);

  return (
    <>
      {posts.map((post) => (
        <PostCard
          post={post}
          session={session}
          key={post.id}
          setShowComments={setShowComments}
          setPost={setPost}
          setComments={setComments}
        />
      ))}
      <div ref={ref} />
      <div
        className={`bg-white fixed h-[500px] bottom-[-500px] w-full m-w-inherit  ${
          showComments ? "translate-y-[-500px]" : "hide"
        } transition-all`}
      >
        <AiFillCloseCircle
          className="absolute top-2 right-2"
          size={30}
          color={"gray"}
          onClick={() => {
            setComments([]);
            setShowComments(false);
          }}
        />
        <div className="flex justify-center pt-4 font-bold text-[19px]">
          Comments
        </div>
        <div className="p-4">
          <ReplyInput
            className="mt-5"
            type="comment"
            previousComments={[]}
            postStory={post?.story as string}
            postId={post?.id as string}
            profilePicture={session?.user.image as string}
            profileColor={user?.randomColor as string}
            authorId={session?.user.id as string}
            authorName={post?.author.name as string}
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
    </>
  );
};

export default LoadMore;
