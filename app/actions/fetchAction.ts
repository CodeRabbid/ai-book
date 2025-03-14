"use server";

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
