"use client";

import {
  ArrowBigLeft,
  ArrowBigRight,
  Maximize,
  MicVocal,
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
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "./ui/scroll-area";

export default function PlayBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMounted, setIsMounted] = useState(false);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const action = useCurrentSongStore((state) => state.action);
  const isLooped = useCurrentSongStore((state) => state.isLooped);
  const setIsLooped = useCurrentSongStore((state) => state.setIsLooped);
  const isShuffled = useCurrentSongStore((state) => state.isShuffle);
  const setIsShuffled = useCurrentSongStore((state) => state.setIsShuffle);
  const [artistName, setArtistName] = useState<string | null>(null);
  const setIsLyric = useCurrentSongStore((state) => state.setIsLyric);
  const isLyric = useCurrentSongStore((state) => state.isLyric);
  const [feats, setFeats] = useState<string[]>([]);
  const pathname = usePathname();

  const [currentSongDetails, setCurrentSongDetails] = useState({
    title: "",
    artist: "",
    duration: "",
    albumID: "",
    url: "",
    cover: "",
    feats: [],
    theme: "",
    lyric: "",
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);


  const [currentTime, setCurrentTime] = useState("0:00");
  const [volumeState, setVolumeState] = useState(50);
  const [isMuted, setIsMuted] = useState(false);


  const noLyricTexts = [
    "We don't have lyrics for this song yet.",
    "Sorry, no lyrics available for this song.",
    "You can sing along, but we don't have the lyrics.",
    "Lyrics are on vacation for this song.",
    "This song is a mystery, no lyrics found.",
    "No lyrics available, just vibes.",
    "The lyrics are playing hide and seek.",
  ]



  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLyricText, setIsLyricText] = useState<string>("");

  useEffect(() => {
    setIsLyricText(noLyricTexts[Math.floor(Math.random() * noLyricTexts.length)]);
  }, [currentSongID]);


  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;

      const handleLoadedMetadata = () => {
        setAction("Play");
        audio.currentTime = 0
        axios.get(`http://127.0.0.1:8000/api/songs/${currentSongID}/`).then((response) => {
          const updatedPlays = response.data.plays + 1;
          axios.patch(`http://127.0.0.1:8000/api/songs/${currentSongID}/`, {
            plays: updatedPlays
          }).then(() => {
            console.log("Updated play count:", updatedPlays);
          });
        }
        ).catch((error) => {
          console.error("Error updating song play count:", error);
        });
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
          const { title, artist, duration, album, file, lyrics } = response.data;
          console.log("Fetched song details:", response.data);

          if (album) {
            axios.get(`http://127.0.0.1:8000/api/albums/${album}`)
              .then((albumResponse) => {
                setCurrentSongDetails({ title, artist, duration, cover: albumResponse.data.image, albumID: album, theme: albumResponse.data.theme, url: file, feats: albumResponse.data.featured_artists, lyric: lyrics });
              })
              .catch((error) => {
                console.error("Error fetching album cover:", error);
              });
            axios.get(`http://127.0.0.1:8000/api/artists/${artist}`)
              .then((artistResponse) => {
                setArtistName(artistResponse.data.name);
              })
              .catch((error) => {
                console.error("Error fetching artist name:", error);
              });
          }

          if (response.data.featured_artists) {
            console.log("Featured artists:", response.data.featured_artists);
            const fetchFeaturedArtists = async () => {
              const featuredArtists = await Promise.all(
                response.data.featured_artists.map((artistID: string) =>
                  axios.get(`http://127.0.0.1:8000/api/artists/${artistID}`)
                    .then((res) => res.data.name)
                    .catch((error) => {
                      console.error("Error fetching featured artist:", error);
                      return null; // Handle error case
                    })
                )
              );
              console.log("Featured artists:", featuredArtists);
              setFeats(featuredArtists);
            };
            fetchFeaturedArtists();
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

  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <motion.main
          initial={{
            y: "100%",
            display: "none",
          }}
          animate={{
            y: isFullScreen ? 0 : "100%",
            display: isFullScreen ? "flex" : "none",
            transition: {
              ease: "easeInOut",
              duration: 0.2,
            }
          }}
          drag='y'
          dragDirectionLock
          dragSnapToOrigin
          dragMomentum={false}
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -100) {
              setIsFullScreen(true);
            } else if (info.offset.y > 100) {
              setIsFullScreen(false);
              setIsLyric(false);
            }
          }}
          dragElastic={{
            top: 0,
            bottom: 1,
          }}
          style={{
            backgroundColor: currentSongDetails.theme || "#474747",
          }} className=" absolute w-full z-[9999] flex-col p-10 flex items-center justify-center h-full">
          <div className=" h-1 bg-white/20 w-1/3 rounded-full absolute top-2" />
          <AnimatePresence mode="wait">
            <motion.div>
              <motion.div className=" w-full absolute flex items-center top-4 left-0 right-0 px-4 gap-x-4">
                {isLyric && (
                  <>
                    <motion.img
                      key={"SmallCover"}
                      layoutId="cover"
                      className="rounded-lg bg-transparent z-20 size-[4rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                      src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                      alt="cover"
                      width={600}
                      height={600}
                    />
                    <motion.div key={"SmallDetails"} layoutId="details" className=" w-full flex items-center justify-center">
                      <div className="overflow-hidden w-full">
                        <motion.div initial={{
                          x: 0,
                        }}
                          animate={{
                            x: currentSongDetails.title?.length > 20 ? ["100%", 0, 0, '-100%'] : 0,
                            transition: {
                              times: [0, 0.3, 0.7, 1],
                              duration: 6,
                              repeat: currentSongDetails.title?.length > 20 ? Infinity : 0,
                              ease: "linear",
                            }
                          }}
                          className={`font-semibold w-full text-xl`}>
                          {currentSongDetails.title || ""}
                        </motion.div>
                        <motion.p initial={{
                          x: 0,
                        }} animate={{
                          x: currentSongDetails.title?.length > 50 ? ["100%", 0, 0, '-100%'] : 0,
                          transition: {
                            times: [0, 0.3, 0.7, 1],
                            duration: 6,
                            repeat: currentSongDetails.title?.length > 50 ? Infinity : 0,
                            ease: "linear",
                          }
                        }} className={` text-white/50  text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline`}>
                          {artistName || ""}
                          {feats && feats.length > 0 && (
                            <span className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
                              {","}
                              {feats.join(", ")}
                            </span>
                          )}
                        </motion.p>
                      </div>
                      <button style={{
                        backgroundColor: currentSongDetails.theme || "#474747",
                        boxShadow: `-10px 0 10px 10px ${currentSongDetails.theme || "rgba(0,0,0,0.5)"}`,
                      }} className=" h-max pl-2 z-10">
                        <CirclePlus className=" text-white md:size-[20px] size-[24px]" />
                      </button>
                    </motion.div>
                  </>
                )}
              </motion.div>
              <motion.img
                key={"LargeCover"}
                layoutId={"cover"}
                animate={{
                  opacity: isLyric ? 0 : 1,
                }}
                className="rounded-lg bg-transparent size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                alt="cover"
                width={600}
                height={600}
              />
              <motion.div animate={{
                opacity: isLyric ? 0 : 1,

              }} key={"LargeDetails"} layoutId="details" className=" w-full flex items-center justify-center mt-10">
                <div className="overflow-hidden w-full">
                  <motion.div initial={{
                    x: 0,
                  }}
                    animate={{
                      x: currentSongDetails.title?.length > 20 ? ["100%", 0, 0, '-100%'] : 0,
                      transition: {
                        times: [0, 0.3, 0.7, 1],
                        duration: 6,
                        repeat: currentSongDetails.title?.length > 20 ? Infinity : 0,
                        ease: "linear",
                      }
                    }}
                    className={`font-semibold w-full text-xl`}>
                    {currentSongDetails.title || ""}
                  </motion.div>
                  <motion.p initial={{
                    x: 0,
                  }} animate={{
                    x: currentSongDetails.title?.length > 50 ? ["100%", 0, 0, '-100%'] : 0,
                    transition: {
                      times: [0, 0.3, 0.7, 1],
                      duration: 6,
                      repeat: currentSongDetails.title?.length > 50 ? Infinity : 0,
                      ease: "linear",
                    }
                  }} className={` text-white/50  text-sm w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline`}>
                    {artistName || ""}
                    {feats && feats.length > 0 && (
                      <span className="text-white/50 hover:underline group-hover:text-white transition-colors text-sm">
                        {","}
                        {feats.join(", ")}
                      </span>
                    )}
                  </motion.p>
                </div>
                <button style={{
                  backgroundColor: currentSongDetails.theme || "#474747",
                  boxShadow: `-10px 0 10px 10px ${currentSongDetails.theme || "rgba(0,0,0,0.5)"}`,
                }} className=" h-max pl-2 z-10">
                  <CirclePlus className=" text-white md:size-[28px] size-[32px]" />
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <motion.div animate={{
            opacity: isLyric ? 1 : 0,
            scale: isLyric ? 1 : 0.8,
            display: isLyric ? "flex" : "none",
            transition: {
              delay: isLyric ? 0.2 : 0,
            },
            position: "absolute",
          }}>
            {currentSongDetails.lyric.length > 0 ? (
              <ScrollArea className=" w-full h-svh pt-[6rem] pb-[5rem] px-4 overflow-hidden">
                <div style={{
                  backgroundImage: `linear-gradient(to bottom, ${currentSongDetails.theme || "#474747"} 0%, rgba(0, 0, 0, 0) 100%)`,
                }} className=" w-full h-[50px] absolute left-0 top-[5.9rem]" />
                <div style={{
                  backgroundImage: `linear-gradient(to top, ${currentSongDetails.theme || "#474747"} 0%, rgba(0, 0, 0, 0) 100%)`,
                }} className=" w-full h-[50px] absolute left-0 bottom-[4.9rem]" />
                <p className=" font-medium py-[1.6rem] text-2xl">{currentSongDetails.lyric}</p>
              </ScrollArea>
            ) : (
              <div>
                <p className=" text-white/50 text-xl px-4 font-medium">{isLyricText}</p>
              </div>
            )}
          </motion.div>
          <motion.div animate={{
            opacity: isLyric ? 0 : 1,
            y: isLyric ? 400 : 0,

          }} transition={{
            ease: "easeInOut",
          }} className=" w-full mt-5">
            <Slider
              className=" w-full "
              isThumb={false}
              step={1}
              defaultValue={[50]}
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
            <div className=" w-full flex items-center justify-between mt-2">
              <p className=" text-xs text-white/50 font-medium">{
                formatSecondsToTime(formatTimeToSeconds(currentTime)) || "0:00"
              }</p>
              <p className=" text-xs text-white/50 font-medium">{formatSecondsToTime(formatTimeToSeconds(currentSongDetails.duration))}</p>
            </div>
          </motion.div>
          <motion.div
            animate={{
              opacity: isLyric ? 0 : 1,
              y: isLyric ? 400 : 0,

            }}
            transition={{
              ease: "easeInOut",
            }}
            className=" flex items-center justify-center w-full gap-x-5 my-14">
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <ArrowBigLeft
                fill="white"
                className=" text-white md:size-[28px] opacity-40 size-[60px]"
              />
            </button>
            <button onClick={() => {
              handlePlay();
            }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              {action === "Play" ?
                <Pause fill="white" className=" text-white md:size-[36px] size-[70px]" /> :
                <Play
                  fill="white"
                  className=" text-white md:size-[36px] size-[70px]"
                />
              }
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">

              <ArrowBigRight
                fill="white"
                className=" text-white md:size-[40px] opacity-40 size-[60px]"
              />
            </button>
          </motion.div>
          <motion.div animate={{
            opacity: isLyric ? 0 : 1,
            y: isLyric ? 400 : 0,
          }} transition={{
            ease: "easeInOut",
          }} className=" w-full flex gap-x-1">
            <Volume className=" text-white opacity-50" />
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
            <Volume2 className=" text-white opacity-50 ml-2" />
          </motion.div>
          <div className=" w-full flex items-center absolute bottom-7 justify-between px-20">
            <button onClick={() => {
              setIsLyric(!isLyric);
            }}>
              {isLyric ?
                <MicVocal size={25} className=" text-white" /> :
                <MicVocal size={25} className=" text-white opacity-40" />
              }
            </button>
            <button onClick={() => {
              setIsShuffled(!isShuffled);
            }}>
              {isShuffled ?
                <Shuffle size={25} className=" text-white" /> :
                <Shuffle size={25} className=" text-white opacity-40" />}
            </button>
            <button onClick={() => {
              if (isLooped === "false") {
                setIsLooped("all");
              } else if (isLooped === "all") {
                setIsLooped("one");
              } else if (isLooped === "one") {
                setIsLooped("false");
              }
            }}>
              {isLooped === "false" ?
                <Repeat size={25} className={` text-white opacity-40`} /> :
                (isLooped === "all" ?
                  <Repeat size={25} className={` text-white`} /> :
                  <Repeat1 size={25} className={` text-white`} />)
              }
            </button>
          </div>
        </motion.main >
        <main className=" fixed z-50 bottom-[4rem] w-full right-0 left-0 mx-auto h-[6rem] pb-[.5rem] items-end flex bg-gradient-to-t from-black ">
          {currentSongDetails.url && (
            <audio src={currentSongDetails.url} autoPlay ref={audioRef} ></audio>
          )}
          <div onClick={() => {
            setIsFullScreen(!isFullScreen);
          }} style={{ backgroundColor: currentSongDetails.theme || "#474747" }} className=" w-[95%] left-0 right-0 items-center justify-between px-[6px] flex mx-auto h-[4rem] rounded-2xl">
            <div className=" flex items-center justify-start w-full h-full gap-x-2">
              {currentSongDetails.cover ? (
                <Image
                  className=" rounded-lg h-[75%] size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                  src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                  alt="cover"
                  width={100}
                  height={100}
                  priority
                />
              ) : (
                <Image
                  className=" rounded-xl h-[80%] size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                  src="/albumPlaceholder.svg"
                  alt="cover"
                  width={100}
                  height={100}
                  priority
                />
              )}
              <div className=" w-full overflow-hidden">
                <div className="overflow-hidden w-full">
                  <motion.div initial={{
                    x: 0,
                  }}
                    animate={{
                      x: currentSongDetails.title?.length > 50 ? ["100%", 0, 0, '-100%'] : 0,
                      transition: {
                        times: [0, 0.3, 0.7, 1],
                        duration: 6,
                        repeat: currentSongDetails.title?.length > 50 ? Infinity : 0,
                        ease: "linear",
                      }
                    }}
                    className={`font-semibold w-full text-md`}>
                    {currentSongDetails.title || ""}
                  </motion.div>
                </div>

                <motion.p initial={{
                  x: 0,
                }} animate={{
                  x: currentSongDetails.title?.length > 50 ? ["100%", 0, 0, '-100%'] : 0,
                  transition: {
                    times: [0, 0.3, 0.7, 1],
                    duration: 6,
                    repeat: currentSongDetails.title?.length > 50 ? Infinity : 0,
                    ease: "linear",
                  }
                }} className={` text-white/50  text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline`}>
                  {artistName || ""}
                  {feats && feats.length > 0 && (
                    <span className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
                      {","}
                      {feats.join(", ")}
                    </span>
                  )}
                </motion.p>
              </div>
            </div>
            <div className=" flex items-center justify-end w-[20%] gap-x-2 p-2 h-full">
              <button onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                {action === "Play" ?
                  <Pause fill="white" size={30} className=" text-white" /> :
                  <Play
                    size={30}
                    className={` ${currentSongDetails.url ? " opacity-100 cursor-pointer" : " opacity-50 cursor-default"} text-white fill-white`}
                  />
                }
              </button>
            </div>
          </div>
        </main>
      </>
    );
  } else {
    return (
      <>
        <motion.main
          initial={{
            y: "100%",
            display: "none",
          }}
          animate={{
            y: isFullScreen ? 0 : "100%",
            display: isFullScreen ? "flex" : "none",
            transition: {
              ease: "easeInOut",
              duration: 0.2,
            }
          }}
          style={{
            backgroundColor: currentSongDetails.theme || "#474747",
          }} className=" absolute w-full h-full left-0 top-0 z-[9999] flex-col p-10 flex items-center justify-center">
          <Image
            className=" size-auto aspect-square h-[40%] rounded-xl"
            src={currentSongDetails.cover || "/albumPlaceholder.svg"}
            alt="cover"
            width={1000}
            height={1000}
            priority
          />
          <div className=" w-full mt-20">
            <h1 className=" text-5xl font-semibold text-white/50">
              {currentSongDetails.title || "Murzyn"}
            </h1>
            <p className=" text-white/20 text-lg w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
              {artistName || "Travis Scott"}
              {feats && feats.length > 0 && (
                <span className="text-white/20 hover:underline group-hover:text-white transition-colors text-lg">
                  {","}
                  {feats.join(", ")}
                </span>
              )}
            </p>
          </div>
          <div className=" w-full mt-10">
            <Slider
              className=" w-full "
              isThumb={false}
              step={1}
              defaultValue={[50]}
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
            <div className=" w-full flex items-center justify-between mt-2">
              <p className=" text-xs text-white/50 font-medium">{
                formatSecondsToTime(formatTimeToSeconds(currentTime)) || "0:00"
              }</p>
              <p className=" text-xs text-white/50 font-medium">{formatSecondsToTime(formatTimeToSeconds(currentSongDetails.duration))}</p>
            </div>
          </div>
        </motion.main>
        <main className=" w-full fixed bottom-0 p-2 space-x-[5%] justify-between z-[51] border-t border-zinc-800 items-center flex h-[6rem] bg-black">
          {currentSongDetails.url && (
            <audio src={currentSongDetails.url} autoPlay ref={audioRef} ></audio>
          )}
          <div className=" flex items-center w-[70%] max-w-[25rem] gap-x-2">
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
                src="/albumPlaceholder.svg"
                alt="cover"
                width={100}
                height={100}
                priority
              />
            )}
            <div className=" flex flex-col w-full overflow-auto">
              <div className="overflow-hidden w-full">
                <motion.p
                  initial={{ x: 0 }}
                  animate={{
                    x: currentSongDetails.title?.length > 20 ? ["120%", 0, 0, '-120%'] : 0,
                    transition: {
                      times: [0, 0.3, 0.7, 1],
                      duration: 6,
                      repeat: currentSongDetails.title?.length > 20 ? Infinity : 0,
                      ease: "linear"
                    }
                  }}
                  className="font-semibold lg:text-lg whitespace-nowrap">
                  {currentSongDetails.title || ""}
                </motion.p>
              </div>
              <p className=" text-white/50 text-xs w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
                {artistName || ""}
                {feats && feats.length > 0 && (
                  <span className="text-white/50 hover:underline group-hover:text-white transition-colors text-xs">
                    {","}
                    {feats.join(", ")}
                  </span>
                )}
              </p>
            </div>
            {currentSongDetails.url && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className=" hover:scale-105 lg:ml-5 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
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
            )}
          </div>
          <div className=" flex flex-col items-center h-full min-w-[20rem] justify-between w-full py-2 flex-1">
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
            <div className=" flex gap-x-2 items-center xl:w-[40rem] w-full">
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
          <div className=" flex-1 max-w-[12%] min-w-[8rem] w-full flex items-center justify-end gap-x-5 pr-2">
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
            <button onClick={() => {
              setIsFullScreen(!isFullScreen);
            }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
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
      </>
    );
  }
}
