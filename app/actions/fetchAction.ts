"use server";

import prisma from "@/lib/prisma";
import { PostInterface } from "@/types/types";

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
    },
    take: PAGE_SIZE,
    skip: PAGE_SIZE * page,
  });
  return posts;
};
