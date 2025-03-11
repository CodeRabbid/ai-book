"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
      postId,
      authorId,
      content,
    },
  });

  revalidatePath("/");
};

export const addReply = async ({
  commentId,
  content,
  authorId,
}: {
  commentId: string;
  content: string;
  authorId: string;
}) => {
  await prisma.comment.create({
    data: {
      commentId,
      authorId,
      content,
    },
  });

  revalidatePath("/");
};
