"use client";

import { CirclePlus, Ellipsis, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrentSongStore } from "@/store/current-song";
import { motion } from "framer-motion";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

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
  isIndecent }: { index: number, title: string, artist?: string, feats?: string[], plays: number, duration: string, isCover: boolean, id: string, isIndex: boolean, isPlays: boolean, isDuration: boolean, artistId?: number, isIndecent: boolean }) => {

  const [songCover, setSongCover] = useState<string | null>(null);
  const [featsState, setFeatsState] = useState<Array<string> | null>(null);
  const [artistName, setArtistName] = useState<string | null>(null);
  const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const action = useCurrentSongStore((state) => state.action);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState({
    songCover: false,
    feats: false,
    artistName: false,
  });

  useEffect(() => {
    if (isCover && id) {
      const fetchSongCover = async () => {
        setSongCover(null);
        setIsLoading((prev) => ({ ...prev, songCover: true }));
        try {
          const res = await axios.get(`http://127.0.1:8000/api/songs/${id}/`);
          setSongCover(res.data.cover);
          console.log(res.data.cover);
        } catch (err) {
          console.error("Error fetching song cover:", err);
        } finally {
          setIsLoading((prev) => ({ ...prev, songCover: false }));
        }
      };
      fetchSongCover();
    }
  }, [isCover, id]);

  useEffect(() => {
    const fetchFeats = async () => {
      setFeatsState(null);
      setIsLoading((prev) => ({ ...prev, feats: true }));
      try {
        if (!feats || feats.length === 0) return;
        const featNames = await Promise.all(
          feats.map(async (artistId) => {
            const res = await axios.get(`http://127.0.0.1:8000/api/artists/${artistId}/`);
            return res.data.username;
          })
        );
        setFeatsState(featNames);
      } catch (err) {
        console.error("Error fetching artist data:", err);
      } finally {
        setIsLoading((prev) => ({ ...prev, feats: false }));
      }
    };

    const fetchArtistName = async () => {
      if (!artistId) return;
      setArtistName(null);
      setIsLoading((prev) => ({ ...prev, artistName: true }));
      try {
        const res = await axios.get(`http://127.0.1:8000/api/artists/${artistId}/`);
        setArtistName(res.data.username);
        console.log(res.data.username);
      } catch (err) {
        console.error("Error fetching artist data:", err);
      } finally {
        setIsLoading((prev) => ({ ...prev, artistName: false }));
      }
    };

    fetchArtistName();
    fetchFeats();
  }, [feats, artistId]);

  const handleSongAction = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCurrentSongID(id.toString());
    if (currentSongID === id.toString()) {
      setAction(action === "Play" ? "Pause" : "Play");
    } else {
      setAction("Play");
    }
  };

  return (
    <div onClick={handleSongAction} className="w-full flex hover:bg-white/5 relative transition-colors cursor-pointer group items-center rounded-xl md:py-2 py-2 md:px-2">
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
          <button onClick={handleSongAction} className={` hover:scale-105 w-full group-hover:flex active:scale-95 transition-all ${currentSongID === id.toString() && action === "Pause" ? 'flex' : 'hidden'} cursor-pointer rounded-full items-center justify-center`}>
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
          {!isIndex && (<button onClick={(e) => handleSongAction(e)} className={` hover:scale-105  group-hover:flex absolute top-0 left-0 bg-black/50 h-full w-full right-0 mx-auto bottom-0 my-auto active:scale-95 transition-all ${currentSongID === id.toString() && action === "Pause" ? 'flex' : 'hidden'} cursor-pointer rounded-md items-center justify-center`}>
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
          {Object.values(isLoading).some((loading) => loading) ? (
            <Skeleton className=" w-[50px] h-[50px] rounded-lg" />
          ) : (
            <Image
              unoptimized
              src={songCover}
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
          {Object.values(isLoading).some((loading) => loading) ? (
            <Skeleton className=" w-[50px] h-[10px] rounded-lg" />
          ) : (
            <span onClick={(e) => {
              e.stopPropagation();
              if (artistId) {
                router.push(`/profile/${artistId}`);
              } else {
                router.push(`/profile/${artist}`);
              }
            }} className=" text-white/50 hover:underline group-hover:text-white font-medium transition-colors text-xs">{artistId ? artistName : artist}</span>
          )}
          {Object.values(isLoading).some((loading) => loading) ? (
            <Skeleton className=" w-[50px] h-[10px] rounded-lg" />
          ) : (
            featsState && featsState.length > 0 && (
              <span onClick={(e) => {
                e.stopPropagation();
                if (artistId && featsState && featsState.length > 0) {
                  // Navigate to the first feat artist's profile (adjust as needed)
                  router.push(`/profile/${feats && feats.length > 0 ? feats[0] : ''}`);
                } else {
                  router.push(`/profile/${artist}`);
                }
              }} className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
                {" ,"}
                {featsState.join(", ")}
              </span>
            )
          )}
        </div>
      </div>
      {Object.values(isLoading).some((loading) => loading) ? (
        <Skeleton className=" w-[50px] h-[10px] rounded-lg" />
      ) : (
        isPlays && (
          <div className=" w-full hidden lg:block max-w-[400px] group-hover:text-white transition-colors text-center text-white/50 font-medium">
            {String(plays).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
          </div>
        ))}
      <button className={` group-hover:opacity-100 md:block ${!isDuration && 'mr-3'} hidden opacity-0 transition-opacity w-max`}>
        <CirclePlus
          className=" text-white/50 group-hover:text-white transition-colors"
          size={20}
        />
      </button>
      {Object.values(isLoading).some((loading) => loading) ? (
        <Skeleton className=" w-[50px] h-[10px] rounded-lg" />
      ) : (
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
        ))}
    </div >
  );
};
