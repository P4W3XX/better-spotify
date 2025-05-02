"use client";

import { CirclePlus, Ellipsis, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrentSongStore } from "@/store/current-song";
import { motion } from "framer-motion";

const PlayAnimation = ({ isPlaying }: { isPlaying: boolean }) => {
  if (!isPlaying) return null;
  return (
    <div className=" flex space-x-1 group-hover:hidden items-center justify-center">
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

export const SongPreview = ({ index, title, artist, feats, plays, duration, isCover, id, isIndex, isPlays, isDuration, artistId }: { index: number, title: string, artist?: string, feats: string[], plays: number, duration: string, isCover: boolean, id: string, isIndex: boolean, isPlays: boolean, isDuration: boolean, artistId?: number }) => {

  const [songCover, setSongCover] = useState<string | null>(null);
  const [featsState, setFeatsState] = useState<Array<string> | null>(null);
  const [artistName, setArtistName] = useState<string | null>(null);
  const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const action = useCurrentSongStore((state) => state.action);

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
          featNames.push(res.data.username);
          console.log(res.data.name);
        } catch (err) {
          console.error("Error fetching artist data:", err);
        }
      }
      if (featNames.length > 0) {
        setFeatsState(featNames);
      }
    }

    const fetchArtistName = async () => {
      if (!artistId) return;
      try {
        const res = await axios.get(`http://127.0.1:8000/api/artists/${artistId}/`);
        setArtistName(res.data.username);
        console.log(res.data.username);
      } catch (err) {
        console.error("Error fetching artist data:", err);
      }
    }
    fetchArtistName();
    fetchFeats();
  }, [feats]);
  return (
    <div onClick={() => {
      setCurrentSongID(id.toString());
    }} className="w-full flex hover:bg-white/5 relative transition-colors cursor-pointer group items-center rounded-xl md:py-2 py-2 md:px-2">
      <div className={`w-full hidden md:block ${isCover ? isIndex ? 'max-w-[40px]' : 'max-w-[0px]' : 'max-w-[65px]'} text-center text-lg font-medium`}>
        {currentSongID === id.toString() && (
          <PlayAnimation isPlaying={action === "Play"} />
        )}
        {isIndex && (
          <span className={` group-hover:hidden ${currentSongID === id.toString() ? 'hidden' : 'block'}`}>
            {index + 1}
          </span>
        )}
        {isIndex && (
          <button onClick={() => {
            setCurrentSongID(id.toString());
            if (currentSongID === id.toString()) {
              if (action === "Play") {
                setAction("Pause");
              } else {
                setAction("Play");
              }
            } else {
              setAction("Play");
            }
          }} className={` hover:scale-105 w-full group-hover:flex active:scale-95 transition-all ${currentSongID === id.toString() && action === "Pause" ? 'flex' : 'hidden'} cursor-pointer rounded-full items-center justify-center`}>
            {currentSongID === id.toString() ? (
              action === "Play" ? (
                <Pause className=" text-white md:size-[24px] size-[20px]"
                  fill="white" />
              ) : (
                <Play className=" text-white md:size-[24px] size-[20px]"
                  fill="white" />
              )
            ) : (
              <Play
                className=" text-white md:size-[24px] size-[20px]"
                fill="white"
              />
            )}
          </button>
        )}
      </div>
      {songCover && (
        <div className=" max-w-[48px] w-full relative mr-3">
          {!isIndex && (<button onClick={() => {
            setCurrentSongID(id.toString());
            if (currentSongID === id.toString()) {
              if (action === "Play") {
                setAction("Pause");
              } else {
                setAction("Play");
              }
            } else {
              setAction("Play");
            }
          }} className={` hover:scale-105  group-hover:flex absolute top-0 left-0 w-max h-max right-0 mx-auto bottom-0 my-auto active:scale-95 transition-all ${currentSongID === id.toString() && action === "Pause" ? 'flex' : 'hidden'} cursor-pointer rounded-full items-center justify-center`}>
            {currentSongID === id.toString() ? (
              action === "Play" ? (
                <Pause className=" text-white md:size-[24px] size-[20px]"
                  fill="white" />
              ) : (
                <Play className=" text-white md:size-[24px] size-[20px]"
                  fill="white" />
              )
            ) : (
              <Play
                className=" text-white md:size-[24px] size-[20px]"
                fill="white"
              />
            )}
          </button>
          )}
          <Image
            unoptimized
            src={songCover}
            alt={title}
            width={50}
            height={50}
            className="rounded-lg w-12 h-12 md:w-12 md:h-12 object-cover"
          /></div>)}
      <div className=" w-full flex flex-col">
        <h1 className=" font-semibold md:text-lg text-md truncate">{title}</h1>
        <p className=" text-white/50 text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium">
          <span className=" hover:underline">
            {artistName ? artistName : artist}
          </span>
          {featsState && featsState.length > 0 && (
            <span className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
              {","}
              {featsState.join(", ")}
            </span>
          )}
        </p>
      </div>
      {isPlays && (
        <div className=" w-full hidden lg:block max-w-[400px] group-hover:text-white transition-colors text-center text-white/50 font-medium">
          {String(plays).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
        </div>
      )}
      <button className={` group-hover:opacity-100 md:block ${!isDuration && 'mr-3'} hidden opacity-0 transition-opacity w-max`}>
        <CirclePlus
          className=" text-white/50 group-hover:text-white transition-colors"
          size={20}
        />
      </button>
      {isDuration && (
        <>
          <div className=" w-full md:block hidden font-medium text-white/50 transition-colors group-hover:text-white max-w-[150px] text-center">
            {duration.startsWith('00:') ? duration.substring(3) : duration}
          </div>

          <button>
            <Ellipsis
              className=" text-white/50 group-hover:text-white transition-colors md:hidden"
              size={20}
            />
          </button>
        </>
      )}
    </div >
  );
};
