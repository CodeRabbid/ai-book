"use client";
import { fetchPosts } from "@/app/actions/fetchAction";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import { PostInterface, SessionInterface, UserInterface } from "@/types/types";
import { AiFillCloseCircle } from "react-icons/ai";

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
          user={user}
          key={post.id}
          setShowComments={setShowComments}
        />
      ))}
      <div ref={ref} />
      <div
        className={`bg-white fixed h-[400px] bottom-[-400px] w-full m-w-inherit  ${
          showComments ? "translate-y-[-400px]" : "hide"
        } transition-all`}
      >
        <AiFillCloseCircle
          className="absolute top-2 right-2"
          size={30}
          color={"gray"}
          onClick={() => setShowComments(false)}
        />
        <div className="flex justify-center pr-2 pt-2 font-bold text-[19px]">
          Comments
        </div>
      </div>
    </>
  );
};

export default LoadMore;
