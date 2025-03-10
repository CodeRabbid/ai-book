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
  //   const session = await auth();

  const comment = await prisma.comment.create({
    data: {
      postId,
      authorId,
      content,
    },
  });

  //   const post = await prisma.post.update({
  //     where: { id: postId },
  //     data: {
  //       comments: {
  //         push: comment,
  //       },
  //     },
  //   });

  //   post;

  revalidatePath("/");
};
