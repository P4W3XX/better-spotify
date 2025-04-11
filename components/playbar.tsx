"use client";

import {
  ArrowBigLeft,
  ArrowBigRight,
  Maximize,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  Volume,
  Volume1,
  Volume2,
  VolumeOff,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { CirclePlus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState, useRef } from "react";
import { useCurrentSongStore } from "@/store/current-song";
import axios from "axios";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function PlayBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMounted, setIsMounted] = useState(false);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const action = useCurrentSongStore((state) => state.action);
  const isLooped = useCurrentSongStore((state) => state.isLooped);
  const setIsLooped = useCurrentSongStore((state) => state.setIsLooped);

  const [currentSongDetails, setCurrentSongDetails] = useState({
    title: "",
    artist: "",
    duration: "",
    albumID: "",
    url: "",
    cover: "",
    theme: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);


  const [currentTime, setCurrentTime] = useState("0:00");
  const [volumeState, setVolumeState] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setAction("Play");
        audio.currentTime = 0
      };

      const handleEnded = () => {
        if (isLooped === "all") {
          console.log("Looped all");
          audio.currentTime = 0;
          audio.play();
        }
        else if (isLooped === "one") {
          console.log("Looped one");
          audio.currentTime = 0;
          audio.play();
        }
        else { audio.currentTime = 0; setAction("Pause"); console.log("Ended"); }
      }

      const handleTimeUpdate = () => {
        setCurrentTime(formatSecondsToTime(Math.floor(audio.currentTime)));
      };


      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
      };
    }

  }, [currentSongDetails.url, isLooped]);

  useEffect(() => {
    setIsMounted(true);
  }, []);


  const formatTimeToSeconds = (timeString: string): number => {
    if (!timeString) return 0;

    const parts = timeString.split(':').map(part => parseInt(part, 10));

    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return (hours * 3600) + (minutes * 60) + seconds;
    } else if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return (minutes * 60) + seconds;
    }

    return 0;
  };

  const formatSecondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const handlePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setAction("Play");
      } else {
        audioRef.current.pause();
        setAction("Pause");
      }
    }
  }

  useEffect(() => {
    if (currentSongID) {
      if (action === "Play") {
        audioRef.current?.play();
      } else if (action === "Pause") {
        audioRef.current?.pause();
      }
    }
  }, [action]);



  useEffect(() => {
    console.log("Current song ID changed:", currentSongID);
    if (currentSongID) {
      axios
        .get(`http://127.0.0.1:8000/api/songs/${currentSongID}`)
        .then((response) => {
          const { title, artist, duration, album, file } = response.data;
          console.log("Fetched song details:", response.data);

          if (album) {
            axios.get(`http://127.0.0.1:8000/api/albums/${album}`)
              .then((albumResponse) => {
                setCurrentSongDetails({ title, artist, duration, cover: albumResponse.data.image, albumID: album, theme: albumResponse.data.theme, url: file });
              })
              .catch((error) => {
                console.error("Error fetching album cover:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching song details:", error);
        });
    }
  }, [currentSongID]);

  if (!isMounted) {
    return null;
  }
  if (isMobile) {
    return (
      <main className=" fixed z-50 bottom-[4rem] w-full right-0 left-0 mx-auto h-[6rem] pb-[.5rem] items-end flex bg-gradient-to-t from-black ">
        {currentSongDetails.url && (
          <audio src={currentSongDetails.url} autoPlay ref={audioRef} ></audio>
        )}
        <div style={{ backgroundColor: currentSongDetails.theme || "black" }} className=" w-[95%] left-0 right-0 items-center justify-between px-[6px] flex mx-auto h-[4rem] rounded-2xl">
          <div className=" flex items-center justify-start w-full h-full gap-x-2">
            {currentSongDetails.cover ? (
              <Image
                className=" rounded-lg h-[75%] size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
                src={currentSongDetails.cover || "/cover.jpg"}
                alt="cover"
                width={100}
                height={100}
                priority
              />
            ) : (
              <Image
                className=" rounded-xl h-[80%] size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
                src="/cover.jpg"
                alt="cover"
                width={100}
                height={100}
                priority
              />
            )}
            <div className=" w-full overflow-hidden">
              <div className="overflow-hidden w-full">
                <div className={`font-semibold text-md ${currentSongDetails.title?.length > 12 ? "whitespace-nowrap animate-marquee" : ""
                  }`}>
                  {currentSongDetails.title || "4x4"}
                </div>
              </div>
              <style jsx>{`
                @keyframes marquee {
                  0% { transform: translateX(150%); }
                  10% { transform: translateX(0%); }
                  90% { transform: translateX(0%); }
                  100% { transform: translateX(-150%); }
                }
                .animate-marquee {
                  animation: marquee 10s linear infinite;
                  animation-delay: 1s;
                  display: inline-block;
                  width: max-content;
                }
                `}</style>
              <style jsx>{`
            @keyframes marquee {
          0% { transform: translateX(100%); }
          15% { transform: translateX(0%); }
          85% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
            }
            .animate-marquee {
          animation: marquee 10s linear infinite;
      
            }
          `}</style>
              <p className=" text-white/50 text-[10px] w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
                {currentSongDetails.artist || "Travis Scott"}
              </p>
            </div>
          </div>
          <div className=" flex items-center justify-end w-[20%] gap-x-2 p-2 h-full">
            <button onClick={() => {
              handlePlay();
            }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              {action === "Play" ?
                <Pause fill="white" size={30} className=" text-white" /> :
                <Play
                  fill="white"
                  size={30}
                  className=" text-white"
                />
              }
            </button>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className=" w-full fixed bottom-0 p-2 justify-between z-[51] border-t items-center flex h-[6rem] bg-black">
        {currentSongDetails.url && (
          <audio src={currentSongDetails.url} autoPlay ref={audioRef} ></audio>
        )}
        <div className=" flex items-center gap-x-2">
          {currentSongDetails.cover ? (
            <Image
              className=" rounded-md size-[4.5rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
              src={currentSongDetails.cover}
              alt="cover"
              width={100}
              height={100}
              priority
            />
          ) : (
            <Image
              className=" rounded-xl size-[4.5rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
              src="/cover.jpg"
              alt="cover"
              width={100}
              height={100}
              priority
            />
          )}
          <div>
            <h1 className=" font-semibold text-lg">{currentSongDetails.title || "Murzyn"}</h1>
            <p className=" text-white/50 text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
              {currentSongDetails.artist || "Travis Scott"}
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className=" hover:scale-105 ml-5 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                  <CirclePlus className=" text-white md:size-[28px] size-[24px] opacity-50" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={10}
                className="font-medium z-[999] bg-white/20 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
              >
                Add to library
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

        </div>
        <div className=" flex flex-col items-center h-full justify-between w-full py-2 flex-1 max-w-[40%] lg:max-w-[35%]">
          <div className=" flex gap-x-5">
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Shuffle className=" text-white opacity-40 md:size-[20px] size-[24px]" />
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={10}
                    className="font-medium z-[999] bg-white/20 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
                  >
                    Shuffle
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <ArrowBigLeft
                fill="white"
                className=" text-white md:size-[28px] opacity-40 size-[24px]"
              />
            </button>
            <button onClick={() => {
              handlePlay();
            }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              {action === "Play" ?
                <Pause fill="white" className=" text-white md:size-[36px] size-[24px]" /> :
                <Play
                  fill="white"
                  className=" text-white md:size-[36px] size-[24px]"
                />
              }
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <ArrowBigRight
                fill="white"
                className=" text-white md:size-[28px] opacity-40 size-[24px]"
              />
            </button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={() => {
                    if (isLooped === "false") {
                      setIsLooped("all");
                    } else if (isLooped === "all") {
                      setIsLooped("one");
                    } else if (isLooped === "one") {
                      setIsLooped("false");
                    }
                  }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                    {isLooped === "false" ?
                      <Repeat className={` text-white md:size-[20px] opacity-40 size-[24px]`} />
                      :
                      (isLooped === "all" ?
                        <Repeat className={` text-white md:size-[20px] size-[24px]`} /> :
                        <Repeat1 className={` text-white md:size-[20px] size-[24px]`} />)
                    }
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="font-medium z-[999] bg-white/20 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
                >
                  {isLooped === "false" ? "Repeat Off" : (isLooped === "all" ? "Repeat All" : "Repeat One")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>
          <div className=" flex w-full gap-x-2 items-center">
            <p className=" text-xs text-white/50 font-medium">{
              formatSecondsToTime(formatTimeToSeconds(currentTime)) || "0:00"
            }</p>
            <Slider
              isThumb={true}
              defaultValue={[50]}
              step={1}
              min={0}
              onValueChange={(value) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = value[0];
                }
                setCurrentTime(formatSecondsToTime(value[0]));
              }}
              max={formatTimeToSeconds(currentSongDetails.duration) || 100}
              value={[formatTimeToSeconds(currentTime)]}
            />
            <p className=" text-xs text-white/50 font-medium">{formatSecondsToTime(formatTimeToSeconds(currentSongDetails.duration))}</p>
          </div>
        </div>
        <div className=" flex-1 max-w-[12%] min-w-[10rem] flex items-center justify-end gap-x-5 pr-2">
          <div className=" flex gap-x-2 w-full">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center" onClick={() => {
                    if (audioRef.current) {
                      audioRef.current.muted = !audioRef.current.muted;
                      setIsMuted(audioRef.current.muted);
                      setVolumeState(audioRef.current.volume * 100);
                    }
                  }}>
                    {!isMuted ? (volumeState > 75 ? (
                      <Volume2 className=" text-white md:size-[24px] stroke-2 opacity-50" />
                    ) : (
                      volumeState > 25 ? (
                        <Volume1 className=" text-white md:size-[24px] stroke-2 opacity-50" />
                      ) : (
                        (volumeState > 0 ?
                          <Volume className=" text-white md:size-[24px] stroke-2 opacity-50" /> :
                          <VolumeX className=" text-white md:size-[24px] stroke-2 opacity-50" />)
                      )
                    )) : (
                      <VolumeOff className=" text-white md:size-[24px] stroke-2 opacity-50" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="font-medium z-[999] bg-white/20 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
                >
                  {isMuted ? "Unmute" : "Mute"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>


            <Slider
              defaultValue={[50]}
              step={1}
              min={0}
              max={100}
              value={[volumeState]}
              onValueChange={(value) => {
                if (audioRef.current) {
                  audioRef.current.volume = value[0] / 100;
                  setVolumeState(value[0]);
                }
              }
              }
              isThumb={false}
            />
          </div>
          <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild><Maximize className=" text-white md:size-[20px] size-[20px] opacity-50" />
                </TooltipTrigger>
                <TooltipContent
                  sideOffset={10}
                  className="font-medium z-[999] bg-white/20 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
                >
                  Full Screen
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </button>
        </div>
      </main>
    );
  }
}
