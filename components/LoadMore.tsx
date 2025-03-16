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
      <CommentSection
        post={post as PostInterface}
        session={session}
        user={user}
        showComments={showComments}
        setShowComments={setShowComments}
      />
    </>
  );
};

export default LoadMore;
