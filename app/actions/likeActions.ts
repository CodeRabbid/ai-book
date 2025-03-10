"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addLikeAction = async ({ postId }: { postId: string }) => {
  const session = await auth();

  const post = await prisma.post.findFirst({
    where: { id: postId },
  });

  if (post?.likes.includes(session?.user.id as string)) {
    await prisma.post.update({
      where: { id: postId },
      data: {
        likes: { set: post.likes.filter((like) => like !== session?.user.id) },
      },
    });
  } else {
    await prisma.post.update({
      where: { id: postId },
      data: { likes: { push: session?.user.id } },
    });
  }

  revalidatePath("/");
};

export const addLikeToCommentAction = async ({
  userId,
  commentId,
}: {
  userId: string;
  commentId: string;
}) => {
  const session = await auth();

  const comment = await prisma.comment.findFirst({
    where: { id: commentId },
  });

  if (comment?.likes.includes(userId as string)) {
    await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: {
          set: comment.likes.filter((like) => like !== session?.user.id),
        },
      },
    });
  } else {
    await prisma.comment.update({
      where: { id: commentId },
      data: { likes: { push: session?.user.id } },
    });
  }

  revalidatePath("/");
};
