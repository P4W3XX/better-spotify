"use client";

import { CirclePlus, Ellipsis } from "lucide-react";

/*
const PlayAnimation = ({ isPlaying }: { isPlaying: boolean }) => {
  if (!isPlaying) return null;
  return (
    <div className=" flex space-x-1 items-center justify-center">
      <motion.div
        initial={{ scaleY: 0.4 }}
        animate={{
          scaleY: isPlaying ? 1 : 0.4,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        className="w-[5px] h-[20px] origin-center rounded-full bg-white"
      />
      <motion.div
        initial={{ scaleY: 0.4 }}
        animate={{
          scaleY: isPlaying ? 1 : 0.4,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          },
        }}
        className="w-[5px] h-[20px] origin-center rounded-full bg-white"
      />
      <motion.div
        initial={{ scaleY: 0.4 }}
        animate={{
          scaleY: isPlaying ? 1 : 0.4,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        className="w-[5px] h-[20px] origin-center rounded-full bg-white"
      />
    </div>
  );
};
*/

export const SongPreview = ({ index }: { index: number }) => {
  return (
    <div className="w-full flex hover:bg-white/5 transition-colors cursor-pointer group items-center rounded-xl md:py-3 py-2 px-2 md:px-0">
      <div className="w-full hidden max-w-[65px] text-center text-lg font-medium">
        {index + 1}
      </div>
      <div className=" w-full flex flex-col">
        <h1 className=" font-semibold text-lg">4X4</h1>
        <p className=" text-white/50 text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
          Travis Scott
        </p>
      </div>
      <div className=" w-full hidden md:block max-w-[400px] group-hover:text-white transition-colors text-center text-white/50 font-medium">
        843 293 829
      </div>
      <button className=" group-hover:opacity-100 md:block hidden opacity-0 transition-opacity w-max">
        <CirclePlus
          className=" text-white/50 group-hover:text-white transition-colors"
          size={20}
        />
      </button>
      <div className=" w-full md:block hidden font-medium text-white/50 transition-colors group-hover:text-white max-w-[150px] text-center">
        3:45
      </div>
      <button>
        <Ellipsis
          className=" text-white/50 group-hover:text-white transition-colors md:hidden"
          size={20}
        />
      </button>
    </div>
  );
};
