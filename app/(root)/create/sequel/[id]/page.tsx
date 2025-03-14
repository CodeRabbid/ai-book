import GenerateForm from "@/components/GenerateSequelForm";
import { Card } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import React from "react";
import Image from "next/image";
import PostLikes from "@/components/PostLikes";
import { auth } from "@/auth";
import { dateToPeriod } from "@/lib/utils";
import { User } from "@prisma/client";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const prequelId = (await params).id;

  let p = await prisma.post.findFirst({
    where: {
      id: prequelId,
    },
    include: {
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
    const p2 = await prisma.post.findFirst({
      where: {
        id: p.prequelId,
      },
      include: {
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
    <div className="flex grow justify-center">
      <div className="max-w-xl grow">
        {prequels.map(
          (prequel) =>
            prequel && (
              <Card
                className="px-8 block mb-3"
                key={prequel.id}
                id={prequel.id}
              >
                <div className="flex  items-center gap-2">
                  <div className="rounded-full overflow-hidden h-10 w-10">
                    {prequel.author.image ? (
                      <Image
                        src={prequel.author.image as string}
                        width={40}
                        height={40}
                        alt=""
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center text-white  h-10 w-10"
                        style={{
                          backgroundColor: prequel.author.randomColor as string,
                        }}
                      >
                        {prequel.author.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[14px]">{prequel.author.name}</div>
                    <div className="text-[14px]">
                      {dateToPeriod(prequel.createdAt)}
                    </div>
                  </div>
                </div>
                <Image
                  src={prequel.picture_url as string}
                  alt=""
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto mt-3"
                />
                <div className="mt-4">
                  {prequel.story?.split("\n").map((storyParagraph, index) => (
                    <div key={index}>{storyParagraph}</div>
                  ))}
                </div>
                <PostLikes
                  className="mt-4"
                  userId={session?.user.id as string}
                  currentLikes={prequel.likes as string[]}
                  postId={prequel.id as string}
                />
              </Card>
            )
        )}
        <GenerateForm
          question="What should be the theme for the sequel?"
          placeholder='e.g. "come back" or "ironic twist", leave blank to keep it random'
          prequels={prequels as { id: string; story: string }[]}
          user={session?.user as User}
        />
      </div>
    </div>
  );
};

export default page;
