"use client";

import { CirclePlus, Ellipsis, LoaderCircle, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useCurrentSongStore } from "@/store/current-song";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

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

export const SongPreview = ({ index, title, artist, feats, plays, duration, isCover, id, isIndex, isPlays, isDuration, artistId,
  isIndecent, cover }: { index: number, title: string, artist?: string, feats?: [{ id: number, username: string }], plays: number, duration: string, isCover: boolean, id: string, isIndex: boolean, isPlays: boolean, isDuration: boolean, artistId?: number, isIndecent: boolean, cover: string }) => {

  const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const action = useCurrentSongStore((state) => state.action);
  const isLoading = useCurrentSongStore((state) => state.isLoading);
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);


  const handleSongAction = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCurrentSongID(id.toString(), true);
    if (currentSongID.url === id.toString()) {
      setAction(action === "Play" ? "Pause" : "Play");
    } else {
      setAction("Play");
    }
  };

  return (
    <div onMouseEnter={() => {
      setIsHover(true);
    }} onMouseLeave={() => {
      setIsHover(false);
    }} onClick={handleSongAction} className="w-full flex hover:bg-white/5 relative transition-colors cursor-pointer group items-center rounded-xl md:py-2 py-2 md:px-2">
      <div className={`w-full hidden md:block ${isCover ? isIndex ? 'max-w-[40px]' : 'max-w-[0px]' : 'max-w-[65px]'} text-center text-lg font-medium`}>
        {(isLoading && currentSongID.url === id.toString()) ? (
          <div className="w-full flex items-center justify-center">
            <LoaderCircle className="text-white animate-spin stroke-4 stroke-white" size={20} />
          </div>
        ) : (
          <>
            {currentSongID.url === id.toString() && (
              <PlayAnimation isPlaying={action === "Play"} />)}

            {isIndex && (
              <span className={` group-hover:hidden ${currentSongID.url === id.toString() ? 'hidden' : 'block'}`}>
                {index + 1}
              </span>
            )}
            {isIndex && (
              <button onClick={handleSongAction} className={` hover:scale-105 w-full group-hover:flex active:scale-95 transition-all ${currentSongID.url === id.toString() && action === "Pause" ? 'flex' : 'hidden'} cursor-pointer rounded-full items-center justify-center`}>
                {currentSongID.url === id.toString() ? (
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
          </>
        )}
      </div>
      {cover && (
        <div className=" max-w-[48px] w-full relative mr-3">
          {!isIndex && (
            isLoading && currentSongID.url === id.toString() ? (
              <div className="w-full flex items-center justify-center absolute my-auto top-0 right-0 left-0 bottom-0 mx-auto">
                <LoaderCircle className="text-white animate-spin stroke-4 stroke-white" size={20} />
              </div>
            ) : (
              <button onClick={(e) => handleSongAction(e)} className={` hover:scale-105  group-hover:flex absolute top-0 left-0 bg-black/50 h-full w-full right-0 mx-auto bottom-0 my-auto active:scale-95 flex group-hover:opacity-100 transition-all cursor-pointer ${currentSongID.url === id.toString() ? 'opacity-100' : 'opacity-0'} rounded-md items-center justify-center`}>
                {currentSongID.url === id.toString() ? (
                  action === "Play" ? (
                    isHover ? (
                      <Pause className=" text-white md:size-[24px] size-[20px]"
                        fill="white" />
                    ) : (
                      <PlayAnimation isPlaying={true} />
                    )
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
            ))}
          {isCover && (
            <Image
              unoptimized
              src={cover}
              alt={title}
              width={50}
              height={50}
              className="rounded-lg w-12 h-12 md:w-12 md:h-12 object-cover"
            />)}</div>)}
      <div className=" w-full flex flex-col">
        <h1 className=" font-semibold md:text-lg text-md truncate">{title}</h1>
        <div className=" text-white/50 flex text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium">
          {isIndecent && (
            <div className=" size-4 min-w-[16px] flex items-center text-xs justify-center rounded-[2px] bg-white/30 font-medium mr-1">E</div>
          )}

          <span onClick={(e) => {
            e.stopPropagation();
            if (artistId) {
              router.push(`/profile/${artistId}`);
            } else {
              router.push(`/profile/${artist}`);
            }
          }} className=" text-white/50 hover:underline group-hover:text-white font-medium transition-colors text-xs">{artist}</span>

          {/* {Object.values(isLoading).some((loading) => loading) ? (
            <Skeleton className=" w-[50px] h-[10px] rounded-lg" />
          ) : (
            feats && feats.length > 0 && (
              <span onClick={(e) => {
                e.stopPropagation();
                if (artistId && feats && feats.length > 0) {
                  router.push(`/profile/${feats && feats.length > 0 ? feats[0] : ''}`);
                } else {
                  router.push(`/profile/${artist}`);
                }
              }} className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
                {" ,"}
                {feats.join(", ")}
              </span>
            )
          )} */}
          {/* <span className="text-white/50 hover:underline group-hover:text-white font-medium transition-colors text-xs">{artist}</span> */}
          {feats && feats.length > 0 &&
            <>
              {','}
              {feats.map((feat, index) => (
                <span key={feat.id} onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/profile/${feat.id}`);
                }} className=" text-white/50 hover:underline group-hover:text-white transition-colors text-xs">{feat.username}{index === feats.length - 1 ? '' : ', '}</span>
              ))}
            </>
          }
        </div>
      </div>
      {
        isPlays && (
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
      {
        isDuration && (
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
        )
      }
    </div >
  );
};