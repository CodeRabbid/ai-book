import React from "react";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";

const SequelsSection = ({
  sequels,
}: {
  sequels: { likes: string[]; id: string; picture_url: string }[];
}) => {
  console.log(sequels);
  return (
    sequels.length > 0 && (
      <div className="mt-2 h-fit">
        <div className="font-bold">Sequels: </div>
        <div className="relative h-35 overflow-scroll no-scrollbar ">
          <div className="absolute mt-2 w-fit  gap-2 flex  ">
            {sequels.map((sequel) => (
              <div key={sequel.id} className="shrink-0">
                <Image
                  src={sequel.picture_url}
                  alt={""}
                  width={100}
                  height={100}
                />
                <div className="flex gap-2 mt-2">
                  <FaHeart color={"gray"} className="w-5 h-5" />
                  {sequel.likes.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default SequelsSection;
