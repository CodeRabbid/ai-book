"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentInterface, PostInterface } from "@/types/types";

const PAGE_SIZE = 5;

export const fetchPosts = async (page: number) => {
  const posts: PostInterface[] = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {},
      comments: {
        include: {
          author: {},
          comments: {
            include: {
              author: {},
              comments: {
                include: {
                  author: {},
                  comments: {
                    include: {
                      author: {},
                      comments: {
                        include: {
                          author: {},
                          comments: {
                            include: {
                              author: {},
                              comments: {
                                include: {
                                  author: {},
                                  comments: {
                                    include: {
                                      author: {},
                                      comments: {
                                        include: { author: {}, comments: {} },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      sequels: true,
    },
    take: PAGE_SIZE,
    skip: PAGE_SIZE * page,
  });
  return posts;
};

export const fetchComments = async (postId: string) => {
  const comments: CommentInterface[] = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { postId },
    include: {
      author: {},
      comments: {
        include: {
          author: {},
          comments: {
            include: {
              author: {},
              comments: {
                include: {
                  author: {},
                  comments: {
                    include: {
                      author: {},
                      comments: {
                        include: {
                          author: {},
                          comments: {
                            include: {
                              author: {},
                              comments: {
                                include: {
                                  author: {},
                                  comments: {
                                    include: {
                                      author: {},
                                      comments: {
                                        include: { author: {}, comments: {} },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return comments;
};

export const deletePostAction = async ({ postId }: { postId: string }) => {
  await prisma.post.delete({
    where: { id: postId },
  });
};

export async function postStory({
  prequelId,
  story,
  picture,
  genre,
  lang,
  stage,
  languageLevel,
}: {
  prequelId?: string;
  story: string;
  picture: string;
  genre: string;
  lang: string;
  stage: string;
  languageLevel: string;
}) {
  const session = await auth();

  const post = await prisma.post.create({
    data: {
      prequelId,
      story,
      genre,
      language: lang,
      stage,
      languageLevel,
      picture_url: picture,
      authorId: session?.user.id as string,
    },
  });

  return post;
}
