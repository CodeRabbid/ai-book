"use server";

import prisma from "@/lib/prisma";
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
      postId,
      authorId,
      content,
    },
  });

  revalidateTag("my-app-user");
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
  revalidateTag("my-app-user");
  revalidatePath("/");
};
