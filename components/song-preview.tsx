"use client";

import { CirclePlus, Ellipsis, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

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

export const SongPreview = ({ index, title, artist, feats, plays, duration, isCover }: { index: number, title: string, artist: string, feats: string[], plays: number, duration: string, isCover: boolean }) => {

  const [songCover, setSongCover] = useState<string | null>(null);
  const [featsState, setFeatsState] = useState<Array<string> | null>(null);

  useEffect(() => {
    if (isCover) {
      setSongCover('/cover.jpg');
    }
  }, [isCover]);

  useEffect(() => {
    const fetchFeats = async () => {
      setFeatsState(null);
      const featNames: string[] = [];
      for (const artistId of feats) {
        try {
          const res = await axios.get(`http://127.0.0.1:8000/api/artists/${artistId}/`);
          featNames.push(res.data.name);
          console.log(res.data.name);
        } catch (err) {
          console.error("Error fetching artist data:", err);
        }
      }
      if (featNames.length > 0) {
        setFeatsState(featNames);
      }
    }
    fetchFeats();
  }, [feats]);
  return (
    <div className="w-full flex hover:bg-white/5 transition-colors cursor-pointer group items-center rounded-xl md:py-3 py-2 px-2 md:px-0">
      <div className={`w-full hidden md:block ${isCover ? 'max-w-[40px]' : 'max-w-[65px]'} text-center text-lg font-medium`}>
        <span className=" group-hover:hidden">
          {index + 1}
        </span>
        <button className=" hover:scale-105 w-full hidden group-hover:flex active:scale-95 transition-all cursor-pointer rounded-full items-center justify-center">
          <Play
            className=" text-white md:size-[24px] size-[20px]"
            fill="white"
          />
        </button>
      </div>
      {songCover && (
        <Image
          src={songCover}
          alt={title}
          width={50}
          height={50}
          className="rounded-lg w-12 h-12 md:w-12 md:h-12 object-cover mr-3"
        />)}
      <div className=" w-full flex flex-col">
        <h1 className=" font-semibold md:text-lg text-md truncate">{title}</h1>
        <p className=" text-white/50 text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium">
          <span className=" hover:underline">
            {artist}
          </span>
          {featsState && featsState.length > 0 && (
            <span className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
              {","}
              {featsState.join(", ")}
            </span>
          )}
        </p>
      </div>
      <div className=" w-full hidden lg:block max-w-[400px] group-hover:text-white transition-colors text-center text-white/50 font-medium">
        {String(plays).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
      </div>
      <button className=" group-hover:opacity-100 md:block hidden opacity-0 transition-opacity w-max">
        <CirclePlus
          className=" text-white/50 group-hover:text-white transition-colors"
          size={20}
        />
      </button>
      <div className=" w-full md:block hidden font-medium text-white/50 transition-colors group-hover:text-white max-w-[150px] text-center">
        {duration.startsWith('00:') ? duration.substring(3) : duration}
      </div>
      <button>
        <Ellipsis
          className=" text-white/50 group-hover:text-white transition-colors md:hidden"
          size={20}
        />
      </button>
    </div >
  );
};
