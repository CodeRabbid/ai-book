"use client";
import { fetchPosts, PostType } from "@/app/actions/fetchAction";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";

let page = 0;

const LoadMore = ({ session, user }: { session: any; user: any }) => {
  const { ref, inView } = useInView();
  const [posts, setPosts] = useState<PostType[]>([]);

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
        <PostCard post={post} session={session} user={user} key={post.id} />
      ))}
      <div ref={ref}>Load More</div>
    </>
  );
};

export default LoadMore;
