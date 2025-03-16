"use client";
import { fetchPosts } from "@/app/actions/fetchAction";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import { PostInterface, SessionInterface, UserInterface } from "@/types/types";
import CommentSection from "./CommentSection";

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
        <PostCard post={post} session={session} key={post.id} user={user} />
      ))}
      <div ref={ref} />
    </>
  );
};

export default LoadMore;
