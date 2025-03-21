import GenerateForm from "@/components/GenerateSequelForm";
import prisma from "@/lib/prisma";
import React from "react";
import { auth } from "@/auth";
import { User } from "@prisma/client";
import PostCard from "@/components/PostCard";
import { PostInterface, SessionInterface, UserInterface } from "@/types/types";
import { Spinner } from "@/components/ui/spinner";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
  });
  const prequelId = (await params).id;

  let p: PostInterface | null = await prisma.post.findFirst({
    where: {
      id: prequelId,
    },
    include: {
      sequels: true,
      author: true,
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

  const prequels = [p];

  while (p?.prequelId) {
    const p2: PostInterface | null = await prisma.post.findFirst({
      where: {
        id: p.prequelId,
      },
      include: {
        sequels: true,
        author: true,
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
    prequels.push(p2);
    p = p2;
  }

  prequels.reverse();

  return (
    <>
      {prequels.length === 0 ? (
        <Spinner size={"small"} />
      ) : (
        <div className="flex grow justify-center">
          <div className="max-w-xl grow">
            {prequels.map(
              (prequel) =>
                prequel && (
                  <PostCard
                    post={prequel}
                    session={session as SessionInterface}
                    user={user as UserInterface}
                    key={prequel.id}
                    id={prequel.id}
                  />
                )
            )}
            <GenerateForm
              question="What should be the theme for the sequel?"
              placeholder='e.g. "come back" or "ironic twist", leave blank to keep it random'
              prequels={prequels as { id: string; story: string }[]}
              user={session?.user as User}
              post={prequels[prequels.length - 1] as PostInterface}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default page;
