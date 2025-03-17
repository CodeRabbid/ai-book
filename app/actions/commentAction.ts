"use server";

import prisma from "@/lib/prisma";
import { CommentInterface } from "@/types/types";
import { revalidatePath, revalidateTag } from "next/cache";

export const addCommentToPost = async ({
  postId,
  content,
  authorId,
}: {
  postId: string;
  content: string;
  authorId: string;
}) => {
  await prisma.comment.create({
    data: {
      originalPostId: postId,
      postId,
      authorId,
      content,
    },
  });

  await prisma.post.update({
    where: { id: postId },
    data: {
      commentsCount: { increment: 1 },
    },
  });

  revalidateTag("my-app-user");
  revalidatePath("/");
};

export const addReply = async ({
  comment,
  content,
  authorId,
}: {
  comment: CommentInterface;
  content: string;
  authorId: string;
}) => {
  await prisma.comment.create({
    data: {
      originalPostId: comment.originalPostId,
      commentId: comment.id,
      authorId,
      content,
    },
  });
  await prisma.post.update({
    where: { id: comment.originalPostId },
    data: {
      commentsCount: { increment: 1 },
    },
  });
  revalidateTag("my-app-user");
  revalidatePath("/");
};
