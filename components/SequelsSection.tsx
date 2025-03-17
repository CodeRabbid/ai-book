import React from "react";

import Image from "next/image";
import { FaCommentDots, FaHeart } from "react-icons/fa";

const SequelsSection = ({
  sequels,
}: {
  sequels: {
    likes: string[];
    id: string;
    picture_url: string;
    commentsCount: number;
  }[];
}) => {
  return (
    sequels.length > 0 && (
      <div className="mt-2 h-fit">
        <div className="font-bold">Sequels: </div>
        <div className="relative h-35 overflow-scroll no-scrollbar ">
          <div className="absolute mt-2 w-fit  gap-2 flex  ">
            {sequels.map((sequel) => (
              <div key={sequel.id} className="shrink-0">
                <a href={`/create/sequel/${sequel.id}#${sequel.id}`}>
                  <Image
                    src={sequel.picture_url}
                    alt={""}
                    width={100}
                    height={100}
                  />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mt-2">
                      <FaHeart color={"gray"} size={20} />
                      {sequel.likes.length}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <FaCommentDots
                        className="cursor-pointer"
                        color="gray"
                        size={20}
                      />
                      {sequel.commentsCount}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default SequelsSection;
