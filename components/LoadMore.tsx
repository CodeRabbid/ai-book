"use client";

import { fetchPosts } from "@/app/actions/postAction";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import { PostInterface, SessionInterface, UserInterface } from "@/types/types";
import { Spinner } from "./ui/spinner";

const LoadMore = ({
  session,
  user,
}: {
  session: SessionInterface;
  user: UserInterface;
}) => {
  const { ref, inView } = useInView();
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (inView) {
      fetchPosts(page).then((newPosts) => {
        setPosts([...posts, ...newPosts]);
        setPage(page + 1);
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
          user={user}
          id={post.id}
        />
      ))}

      <div ref={ref}>
        <Spinner size={"small"} />
      </div>
    </>
  );
};

export default LoadMore;
