"use client";

import {
  ArrowBigLeft,
  ArrowBigRight,
  Blend,
  LoaderCircle,
  Maximize2,
  MicVocal,
  Minimize2,
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
import { useRouter } from "next/navigation";
import { SynchronizedLyrics } from "./synchronized-lyrics";
import { useTokenStore } from "@/store/token";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function PlayBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isMounted, setIsMounted] = useState(false);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const action = useCurrentSongStore((state) => state.action);
  const isLooped = useCurrentSongStore((state) => state.isLooped);
  const setIsLooped = useCurrentSongStore((state) => state.setIsLooped);
  const isShuffled = useCurrentSongStore((state) => state.isShuffle);
  const setIsShuffled = useCurrentSongStore((state) => state.setIsShuffle);
  const setIsLyric = useCurrentSongStore((state) => state.setIsLyric);
  const isLyric = useCurrentSongStore((state) => state.isLyric);
  const isLoading = useCurrentSongStore((state) => state.isLoading);
  const setIsLoading = useCurrentSongStore((state) => state.setIsLoading);
  const pathname = usePathname();
  const titleRef = useRef<HTMLDivElement>(null);
  const titleHandle = useRef<HTMLDivElement>(null);
  const [isTitleAnimated, setIsTitleAnimated] = useState(false);
  const artistsRef = useRef<HTMLDivElement>(null);
  const artistsHandle = useRef<HTMLDivElement>(null);
  const [isArtistsAnimated, setIsArtistsAnimated] = useState(false);
  const [isBlended, setIsBlended] = useState(false);
  const accessToken = useTokenStore((state) => state.accessToken);
  const router = useRouter();

  const [currentSongDetails, setCurrentSongDetails] = useState({
    title: "",
    artistId: "",
    artistName: "",
    duration: "",
    albumID: "",
    url: "",
    cover: "",
    feats: [{
      id: "",
      username: "",
    }],
    theme: "",
    lyric: { lyric: [] },
    explicit: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState("0:00");
  const [volumeState, setVolumeState] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    console.log("Volume state changed:", volumeState);
  }, [volumeState]);

  const noLyricTexts = [
    "We don't have lyrics for this song yet.",
    "Sorry, no lyrics available for this song.",
    "You can sing along, but we don't have the lyrics.",
    "Lyrics are on vacation for this song.",
    "This song is a mystery, no lyrics found.",
    "No lyrics available, just vibes.",
    "The lyrics are playing hide and seek.",
  ];

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLyricText, setIsLyricText] = useState<string>("");
  const [isMoved, setIsMoved] = useState(false);


  useEffect(() => {
    setIsLyricText(noLyricTexts[Math.floor(Math.random() * noLyricTexts.length)]);
  }, [currentSongID]);


  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const handleLoadedMetadata = () => {
        document.title = currentSongDetails.title ? `${currentSongDetails.title} - Music` : "Music";
        if (currentSongID.autoPlay) {
          setAction("Play");
        }
        audio.currentTime = 0;
        audio.volume = volumeState / 100;
      };

      const handleEnded = () => {
        if (isLooped === "all") {
          console.log("Looped all");
          audio.currentTime = 0;
          audio.play();
        } else if (isLooped === "one") {
          console.log("Looped one");
          audio.currentTime = 0;
          audio.play();
        } else {
          audio.currentTime = 0;
          setAction("Pause");
          console.log("Ended");
        }
      };

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

    const parts = timeString.split(":").map((part) => parseInt(part, 10));

    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      const [minutes, seconds] = parts;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  useEffect(() => {
    if (!accessToken) return;
    axios.get('http://127.0.0.1:8000/api/playback/control/', {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    }).then((response) => {
      console.log("Playback control response:", response.data);
      setCurrentSongID(response.data.data.song_id, false);
    }).catch(() => {
      setCurrentSongID("", false);
    })
  }, []);


  useEffect(() => {
    if (!isMobile) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setIsFullScreen(false);
          setIsLyric(false);
        }
      };

      const handleFullscreenChange = () => {
        if (!document.fullscreenElement && isFullScreen) {
          setIsFullScreen(false);
          setIsLyric(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      document.addEventListener("fullscreenchange", handleFullscreenChange);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
      };
    }
  }, [isFullScreen, isMobile]);

  const formatSecondsToTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const nextSong = () => {
    const albumID = currentSongDetails.albumID;
    if (albumID) {
      console.log("Album ID:", albumID);
      axios.get(`http://127.0.0.1:8000/api/albums/${albumID}`).then((response) => {
        const songs = response.data.songs;
        const currentSongIndex = songs.findIndex((song: { id: number }) => song.id.toString() === currentSongID.url);
        const nextSongIndex = (currentSongIndex + 1) % songs.length;
        const nextSongID = songs[nextSongIndex];
        setCurrentSongID(nextSongID.id, true);
      }).catch((error) => {
        console.error("Error fetching album songs:", error);
      });
    }
  };

  const prevSong = () => {
    const albumID = currentSongDetails.albumID;
    if (albumID) {
      console.log("Album ID:", albumID);
      axios.get(`http://127.0.0.1:8000/api/albums/${albumID}`).then((response) => {
        const songs = response.data.songs;
        const currentSongIndex = songs.findIndex((song: { id: number }) => song.id.toString() === currentSongID.url);
        let prevSongIndex;
        if (currentSongIndex === 0) {
          console.log("First song, going to last song");
          audioRef.current!.currentTime = 0;
        } else {
          prevSongIndex = (currentSongIndex - 1) % songs.length;
          const prevSongID = songs[prevSongIndex];
          setCurrentSongID(prevSongID.id, true);
        }
      }).catch((error) => {
        console.error("Error fetching album songs:", error);
      });
    }
  };



  useEffect(() => {
    if (isFullScreen && !isMobile && action === "Play") {
      let inactivityTimeout: NodeJS.Timeout;

      const resetTimer = () => {
        clearTimeout(inactivityTimeout);
        setIsMoved(false);
        console.log("Mouse moved, resetting timer");

        inactivityTimeout = setTimeout(() => {
          setIsMoved(true);
          console.log("Mouse inactive for 3 seconds, hiding controls");
        }, 3000);
      };

      resetTimer();

      window.addEventListener('mousemove', resetTimer);

      return () => {
        window.removeEventListener('mousemove', resetTimer);
        clearTimeout(inactivityTimeout);
        setIsMoved(false);
      };
    }
  }, [isFullScreen, action]);

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
  };

  useEffect(() => {
    if (currentSongID) {
      if (action === "Play") {
        audioRef.current?.play();
      } else if (action === "Pause") {
        audioRef.current?.pause();
      }
    }
  }, [action]);

  const [lastSongID, setLastSongID] = useState<string | null>(null);

  useEffect(() => {
    if (currentSongID.url && currentSongID.autoPlay) {
      const handlePlaybackControl = async () => {
        try {
          if (!accessToken) {
            return;
          }
          let payload = {};
          if (action === "Play" && currentSongID.url !== lastSongID) {
            payload = {
              action: "play",
              song_id: currentSongID.url,
            };
          } else if (action === "Play" && currentSongID.url === lastSongID) {
            payload = {
              action: "resume"
            };
          } else if (action === "Pause") {
            payload = {
              action: "pause"
            };
          }

          await axios.post('http://127.0.0.1:8000/api/playback/control/', payload, {
            headers: {
              "Authorization": `Bearer ${accessToken}`
            }
          });

          if (action === "Play") {
            audioRef.current?.play();
          } else if (action === "Pause") {
            audioRef.current?.pause();
          }

        } catch (error) {
          console.error("Playback control error:", error);
        }

        setLastSongID(currentSongID.url);
      };
      handlePlaybackControl();
    }
  }, [action, currentSongID.url, accessToken],);

  useEffect(() => {
    const handleResize = () => {
      if (titleRef.current && titleHandle.current && artistsRef.current && artistsHandle.current) {
        console.log("Resizing title handle");
        const titleWidth = titleRef.current.offsetWidth;
        const handleWidth = titleHandle.current.offsetWidth;
        const artistsWidth = artistsRef.current.offsetWidth;
        const artistsHandleWidth = artistsHandle.current.offsetWidth;
        if (titleWidth > handleWidth) {

          setIsTitleAnimated(true);
        } else {

          setIsTitleAnimated(false);
        }
        if (artistsWidth > artistsHandleWidth) {

          setIsArtistsAnimated(true);
        } else {
          setIsArtistsAnimated(false);
        }
      }
    };
    window.addEventListener("resize", () => {
      handleResize();
    });

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [currentSongDetails.artistName, currentSongDetails.title]);

  useEffect(() => {
    const fetchSongDetails = async () => {
      console.log("Current song ID changed:", currentSongID);
      if (currentSongID.url) {
        setIsLoading(true);
        axios
          .get(`http://127.0.0.1:8000/api/songs/${currentSongID.url}`)
          .then(async (response) => {
            const { title, duration, album, file, lyrics, is_indecent } = response.data;
            console.log("File Type:", typeof file);
            const cleanFile = typeof file === 'string' ? file.replace(/\?$/, '') : file;
            console.log("Fetched song details:", response.data);
            if (album) {
              await axios
                .get(`http://127.0.0.1:8000/api/albums/${album}`)
                .then((albumResponse) => {
                  console.log("Fetched album details:", albumResponse.data);
                  setCurrentSongDetails({
                    title,
                    artistId: albumResponse.data.artist,
                    artistName: albumResponse.data.artist_username,
                    duration,
                    cover: albumResponse.data.image,
                    albumID: album,
                    theme: albumResponse.data.theme,
                    url: cleanFile,
                    feats: response.data.featured_artists,
                    lyric: lyrics,
                    explicit: is_indecent,
                  });
                })
                .catch((error) => {
                  console.error("Error fetching album cover:", error);
                });
              setIsLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error fetching song details:", error);
          }).finally(() => {
            setIsLoading(false);
          });
      }
    }
    fetchSongDetails();
  }, [currentSongID.url]);

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
            },
          }}
          drag="y"
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
          }}
          className=" absolute w-full z-[9999] flex-col flex items-center justify-end h-full"
        >
          <div className=" h-1 bg-white/20 w-1/3 rounded-full absolute z-[9999] top-2" />
          <motion.div
            animate={{
              opacity: isLyric ? 1 : 0,
              scale: isLyric ? 1 : 0.8,
              display: isLyric ? "flex" : "none",
              transition: {
                delay: isLyric ? 0.2 : 0,
              },
            }}
            className=" absolute top-0 w-full left-0 h-full z-50"
          >
            {currentSongDetails.lyric.lyric && currentSongDetails.lyric.lyric.length > 0 ? (
              <SynchronizedLyrics
                className=" !pt-[6rem] !pb-[8rem]"
                lyrics={currentSongDetails.lyric.lyric}
                currentTime={formatTimeToSeconds(currentTime)}
                audioRef={audioRef as React.RefObject<HTMLAudioElement>}
                setCurrentTime={(time: number) => {
                  console.log("Setting current time:", time);
                  if (audioRef.current && !audioRef.current.paused) {
                    audioRef.current.currentTime = time;
                  }
                  setCurrentTime(formatSecondsToTime(time));
                }}
              />
            ) : (
              <p className=" text-white/50 h-svh w-full flex items-center justify-center text-center text-xl font-medium">{isLyricText}</p>
            )}
          </motion.div>
          <motion.div style={{
            backdropFilter: !isLyric ? "blur(0px)" : "blur(16px)",
          }} className=" w-full absolute flex z-[999] items-center top-0 py-4 left-0 right-0 px-4 gap-x-4">
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
                <motion.div key={"SmallDetails"} layoutId="details" className=" w-full z-20 flex items-center justify-center">
                  <div className="overflow-hidden w-full">
                    <div ref={titleHandle} className="overflow-hidden w-full">
                      <motion.div
                        ref={titleRef}
                        initial={{ x: 0 }}
                        animate={
                          isTitleAnimated
                            ? {
                              x: ["100%", 0, 0, "-100%"],
                              transition: {
                                times: [0, 0.3, 0.7, 1],
                                duration: 6,
                                repeat: Infinity,
                              },
                            }
                            : { x: 0 }
                        }
                        className="font-semibold lg:text-lg w-max whitespace-nowrap"
                      >
                        {currentSongDetails.title || ""}
                      </motion.div>
                    </div>
                    <div className=" flex items-center">
                      {currentSongDetails.explicit && (
                        <div className=" size-4 min-w-[16px] flex items-center text-xs justify-center rounded-[2px] bg-white/30 font-medium mr-1">E</div>
                      )}
                      <motion.div
                        ref={artistsRef}
                        initial={{ x: 0 }}
                        animate={
                          isArtistsAnimated
                            ? {
                              x: ["100%", 0, 0, "-100%"],
                              transition: {
                                times: [0, 0.3, 0.7, 1],
                                duration: 6,
                                repeat: Infinity,
                              },
                            }
                            : { x: 0 }
                        }
                        className="text-white/50 text-xs w-max cursor-pointer transition-colors font-medium whitespace-nowrap"
                      >
                        <span
                          onClick={(e) => {
                            router.push(`/artist/${currentSongDetails.artistId}`);
                            e.stopPropagation();
                          }}
                          className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                        >
                          {currentSongDetails.artistName || ""}
                        </span>
                        {currentSongDetails.feats && currentSongDetails.feats.length > 0 &&
                          currentSongDetails.feats.map((feat, index) => (
                            <span
                              key={index}
                              onClick={(e) => {
                                router.push(`/artist/${feat.id}`);
                                e.stopPropagation();
                              }}
                              className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                            >
                              {","}
                              {feat.username}
                            </span>
                          ))}
                      </motion.div>
                    </div>
                  </div>
                  <button className=" h-max pl-2 z-10">
                    <CirclePlus className=" text-white md:size-[20px] size-[24px]" />
                  </button>
                </motion.div>
              </>
            )}
          </motion.div>
          <motion.div
            animate={{
              opacity: isLyric && isBlended ? 1 : 0,
            }}
          >
            <div className={` w-full h-full pointer-events-none absolute top-0 left-0 bg-black/40 backdrop-blur-3xl z-10 `} />
            <div
              style={{
                backgroundImage: `url(${currentSongDetails.cover || "/albumPlaceholder.svg"})`,
              }}
              className=" w-full h-full pointer-events-none absolute bg-cover bg-center left-0 top-0"
            />
          </motion.div>
          {isBlended && !isLyric && (
            <>
              <motion.div
                initial={false}
                animate={{
                  opacity: isBlended ? 1 : 0,
                }}
                key={"BlendedCover"}
                className=" absolute h-full w-full object-center object-cover z-10 left-0 top-0 bg-black/40"
              />
              <motion.img
                key={"BlendedImage"}
                layoutId={"cover"}
                animate={{
                  opacity: isLyric ? 0 : 1,
                  scale: action === "Play" ? 1 : 0.8,
                }}
                className=" bg-transparent absolute h-full z-0 w-full object-center object-cover left-0 top-0 shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                alt="cover"
                width={600}
                height={600}
              />
            </>
          )}
          <div className=" px-5">
            <motion.img
              key={"LargeCover"}
              layoutId={"cover"}
              animate={{
                opacity: isLyric || isBlended ? 0 : 1,
                scale: action === "Play" ? 1 : 0.8,
              }}
              className="rounded-lg bg-transparent size-auto max-h-[20rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
              src={currentSongDetails.cover || "/albumPlaceholder.svg"}
              alt="cover"
              width={600}
              height={600}
            />
          </div>
          <div className=" w-full h-full absolute top-0 left-0 bg-gradient-to-t from-black/70 to-70%" />
          <div className={` pb-10 transition-all flex h-[40%] ${isLyric ? 'backdrop-blur-none pointer-events-none' : ' pointer-events-auto'} justify-between w-full flex-col z-50 px-5 relative`}>
            <AnimatePresence mode="wait">
              <motion.div className=" w-full items-center justify-center flex flex-col">
                <motion.div
                  animate={{
                    opacity: isLyric ? 0 : 1,
                  }}
                  key={"LargeDetails"}
                  layoutId="details"
                  className=" w-full mt-10 flex items-center justify-center"
                >
                  <div className="overflow-hidden w-full">
                    <div ref={titleHandle} className="overflow-hidden w-full">
                      <motion.div
                        ref={titleRef}
                        initial={{ x: 0 }}
                        animate={
                          isTitleAnimated
                            ? {
                              x: ["100%", 0, 0, "-100%"],
                              transition: {
                                times: [0, 0.3, 0.7, 1],
                                duration: 6,
                                repeat: Infinity,
                              },
                            }
                            : { x: 0 }
                        }
                        className="font-semibold text-xl w-max whitespace-nowrap"
                      >
                        {currentSongDetails.title || ""}
                      </motion.div>
                    </div>
                    <div className=" flex items-center">
                      {currentSongDetails.explicit && (
                        <div className=" size-4 min-w-[16px] flex items-center text-xs justify-center rounded-[2px] bg-white/30 font-medium mr-1">E</div>
                      )}
                      <div ref={artistsHandle} className="overflow-hidden w-full">
                        <motion.div
                          ref={artistsRef}
                          initial={{ x: 0 }}
                          animate={
                            isArtistsAnimated
                              ? {
                                x: ["100%", 0, 0, "-100%"],
                                transition: {
                                  times: [0, 0.3, 0.7, 1],
                                  duration: 6,
                                  repeat: Infinity,
                                },
                              }
                              : { x: 0 }
                          }
                          className="text-white/50 text-xs w-max cursor-pointer transition-colors font-medium whitespace-nowrap"
                        >
                          <span
                            onClick={(e) => {
                              router.push(`/artist/${currentSongDetails.artistId}`);
                              e.stopPropagation();
                            }}
                            className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                          >
                            {currentSongDetails.artistName || ""}
                          </span>
                          {currentSongDetails.feats && currentSongDetails.feats.length > 0 &&
                            currentSongDetails.feats.map((feat, index) => (
                              <span
                                key={index}
                                onClick={(e) => {
                                  router.push(`/artist/${feat.id}`);
                                  e.stopPropagation();
                                }}
                                className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                              >
                                {","}
                                {feat.username}
                              </span>
                            ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <button className=" h-max pl-2 z-10">
                    <CirclePlus className=" text-white md:size-[28px] size-[32px]" />
                  </button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <motion.div
              animate={{
                opacity: isLyric ? 0 : 1,
                y: isLyric ? 40 : 0,
              }}
              transition={{
                ease: "easeInOut",
              }}
              className=" w-full"
            >
              <Slider
                className=" w-full "
                isThumb={false}
                step={1}
                defaultValue={[50]}
                min={0}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    const wasPlaying = !audioRef.current.paused;
                    if (wasPlaying) {
                      audioRef.current.pause();
                    }
                    audioRef.current.currentTime = value[0];
                    if (wasPlaying) {
                      audioRef.current.play();
                    }
                  }
                  setCurrentTime(formatSecondsToTime(value[0]));
                }}
                max={formatTimeToSeconds(currentSongDetails.duration) || 100}
                value={[formatTimeToSeconds(currentTime)]}
              />
              <div className=" w-full flex items-center justify-between mt-2">
                <p className=" text-xs text-white/50 font-medium">
                  {formatSecondsToTime(formatTimeToSeconds(currentTime)) || "0:00"}
                </p>
                <p className=" text-xs text-white/50 font-medium">{formatSecondsToTime(formatTimeToSeconds(currentSongDetails.duration))}</p>
              </div>
            </motion.div>
            <motion.div
              animate={{
                opacity: isLyric ? 0 : 1,
                y: isLyric ? 40 : 0,
              }}
              transition={{
                ease: "easeInOut",
              }}
              className=" flex items-center justify-center w-full gap-x-5"
            >
              <button onClick={() => prevSong()} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigLeft fill="white" className={` text-white size-[60px] ${!currentSongID.url || isLoading && ' pointer-events-none opacity-40'}`} />
              </button>
              {!isLoading ? (
                <button
                  onClick={() => {
                    handlePlay();
                  }}
                  className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                >
                  {action === "Play" ? (
                    <Pause fill="white" className={` text-white ${!currentSongID.url && ' pointer-events-none opacity-40'} size-[70px]`} />
                  ) : (
                    <Play fill="white" className={` text-white size-[70px] ${!currentSongID.url && ' pointer-events-none opacity-40'}`} />
                  )}
                </button>
              ) : (
                <div className=" rounded-full flex items-center justify-center">
                  <LoaderCircle className=" text-white stroke-3 stroke-white size-[70px] animate-spin" />
                </div>
              )}
              <button onClick={() => nextSong()} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigRight fill="white" className={` text-white ${!currentSongID || isLoading && ' pointer-events-none opacity-40'} size-[60px]`} />
              </button>
            </motion.div>
            <motion.div
              animate={{
                opacity: isLyric ? 0 : 1,
                y: isLyric ? 40 : 0,
              }}
              transition={{
                ease: "easeInOut",
              }}
              className=" w-full flex gap-x-1"
            >
              <Volume className=" text-white opacity-50" />
              <Slider
                defaultValue={[audioRef.current ? audioRef.current.volume * 100 : 50]}
                step={1}
                min={0}
                max={100}
                value={[volumeState]}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    audioRef.current.volume = value[0] / 100;
                    setVolumeState(value[0]);
                  }
                }}
                isThumb={false}
              />
              <Volume2 className=" text-white opacity-50 ml-2" />
            </motion.div>

          </div>
          <div style={{
            backdropFilter: !isLyric ? "blur(0px)" : "blur(16px)",
          }} className=" w-full pt-5 flex items-center justify-between z-[999] px-5 pb-5">
            <button
              onClick={() => {
                setIsLyric(!isLyric);
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)]  rounded-xl ${isLyric ? "bg-white/10 shadow-black/20" : " bg-transparent shadow-transparent"
                } p-2`}
            >
              {isLyric ? (
                <MicVocal size={25} className=" text-white" />
              ) : (
                <MicVocal size={25} className=" text-white opacity-40" />
              )}
            </button>
            <button
              onClick={() => {
                setIsShuffled(!isShuffled);
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)]  rounded-xl ${isShuffled ? "bg-white/10 shadow-black/20" : " bg-transparent shadow-transparent"
                } p-2`}
            >
              {isShuffled ? (
                <Shuffle size={25} className=" text-white" />
              ) : (
                <Shuffle size={25} className=" text-white opacity-40" />
              )}
            </button>
            <button
              onClick={() => {
                if (isLooped === "false") {
                  setIsLooped("all");
                } else if (isLooped === "all") {
                  setIsLooped("one");
                } else if (isLooped === "one") {
                  setIsLooped("false");
                }
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)]  rounded-xl ${isLooped != "false" ? "bg-white/10 shadow-black/20" : " bg-transparent shadow-transparent"
                } p-2`}
            >
              {isLooped === "false" ? (
                <Repeat size={25} className={` text-white opacity-40`} />
              ) : isLooped === "all" ? (
                <Repeat size={25} className={` text-white`} />
              ) : (
                <Repeat1 size={25} className={` text-white`} />
              )}
            </button>
            <button
              onClick={() => {
                setIsBlended(!isBlended);
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)]  rounded-xl ${isBlended ? "bg-white/10 shadow-black/20" : " bg-transparent shadow-transparent"
                } p-2`}
            >
              <Blend size={25} className={` text-white transition-opacity ${isBlended ? "opacity-100" : "opacity-40"}`} />
            </button>
          </div>
        </motion.main>
        <main className=" fixed z-50 bottom-[4rem] w-full right-0 left-0 mx-auto h-[6rem] pb-[.5rem] items-end flex bg-gradient-to-t from-black ">
          {currentSongDetails.url && <audio src={currentSongDetails.url} autoPlay ref={audioRef}></audio>}
          <div
            onClick={() => {
              setIsFullScreen(!isFullScreen);
            }}
            style={{ backgroundColor: currentSongDetails.theme || "#474747" }}
            className=" w-[95%] left-0 right-0 items-center justify-between px-[6px] flex mx-auto h-[4rem] rounded-2xl"
          >
            <div className=" flex items-center justify-start w-full relative h-full gap-x-2">
              <div
                style={{
                  backgroundImage: `linear-gradient(to left, ${currentSongDetails.theme || "#474747"} 0%, rgba(0, 0, 0, 0) 100%)`,
                }}
                className=" h-full w-3 absolute right-0 z-10 top-0"
              />
              <div
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentSongDetails.theme || "#474747"} 0%, rgba(0, 0, 0, 0) 100%)`,
                }}
                className=" h-full w-2 absolute left-[53px] z-10 top-0"
              />
              {currentSongDetails.cover ? (
                <Image
                  className=" rounded-lg h-[80%] z-20 size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                  src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                  alt="cover"
                  width={100}
                  unoptimized
                  height={100}
                  priority
                />
              ) : (
                <Image
                  className=" rounded-xl h-[80%] z-20 size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                  src="/albumPlaceholder.svg"
                  alt="cover"
                  width={100}
                  height={100}
                  priority
                />
              )}
              <div className=" w-full overflow-hidden">
                <div ref={titleHandle} className="overflow-hidden w-full">
                  <motion.div
                    ref={titleRef}
                    initial={{ x: 0 }}
                    animate={
                      isTitleAnimated
                        ? {
                          x: ["100%", 0, 0, "-100%"],
                          transition: {
                            times: [0, 0.3, 0.7, 1],
                            duration: 6,
                            repeat: Infinity,
                          },
                        }
                        : { x: 0 }
                    }
                    className="font-semibold text-md w-max whitespace-nowrap"
                  >
                    {currentSongDetails.title || ""}
                  </motion.div>
                </div>
                <div className=" flex items-center">
                  {currentSongDetails.explicit && (
                    <div className=" size-4 min-w-[16px] flex items-center text-xs justify-center rounded-[2px] bg-white/30 font-medium mr-1">E</div>
                  )}
                  <div ref={artistsHandle} className="overflow-hidden w-full">
                    <motion.div
                      ref={artistsRef}
                      initial={{ x: 0 }}
                      animate={
                        isArtistsAnimated
                          ? {
                            x: ["100%", 0, 0, "-100%"],
                            transition: {
                              times: [0, 0.3, 0.7, 1],
                              duration: 6,
                              repeat: Infinity,
                            },
                          }
                          : { x: 0 }
                      }
                      className="text-white/50 text-xs w-max cursor-pointer transition-colors font-medium whitespace-nowrap"
                    >
                      <span
                        onClick={(e) => {
                          router.push(`/artist/${currentSongDetails.artistId}`);
                          e.stopPropagation();
                        }}
                        className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                      >
                        {currentSongDetails.artistName || ""}
                      </span>
                      {currentSongDetails.feats && currentSongDetails.feats.length > 0 &&
                        currentSongDetails.feats.map((feat, index) => (
                          <span
                            key={index}
                            onClick={(e) => {
                              router.push(`/artist/${feat.id}`);
                              e.stopPropagation();
                            }}
                            className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                          >
                            {","}
                            {feat.username}
                          </span>
                        ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex items-center z-20 justify-end w-[20%] h-full">
              {!isLoading ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay();
                  }}
                  className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                >
                  {action === "Play" ? (
                    <Pause fill="white" className={` text-white ${!currentSongID.url && ' pointer-events-none opacity-40'} size-[30px]`} />
                  ) : (
                    <Play fill="white" className={` text-white size-[30px] ${!currentSongID.url && ' pointer-events-none opacity-40'}`} />
                  )}
                </button>
              ) : (
                <div className=" rounded-full flex items-center justify-center">
                  <LoaderCircle className=" text-white  size-[30px] stroke-3 stroke-white animate-spin" />
                </div>
              )}
              <button onClick={(e) => {
                nextSong();
                e.stopPropagation();
              }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigRight fill="white" className={` text-white ${!currentSongID.url || isLoading && ' pointer-events-none opacity-40'} size-[30px]`} />
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
          layout
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
            },
          }}
          style={{
            backgroundColor: currentSongDetails.theme || "#474747",
          }}
          className=" absolute w-full h-full left-0 top-0 z-[9999] flex-col flex items-center justify-end"
        >
          <div className=" w-full h-full absolute left-0 top-0 bg-gradient-to-t from-black/70 to-70%" />
          {isLyric && (
            <div className=" w-max h-fit flex items-center absolute top-0 bottom-0 my-[13rem] gap-x-10 justify-center z-[99]" >
              <AnimatePresence mode="wait">
                <motion.img
                  key={"LyricCover"}
                  animate={{
                    scale: action === "Play" ? isMoved ? 1.2 : 1 : 0.8,
                  }}
                  transition={{
                    ease: "easeInOut",
                  }}
                  layoutId={"cover"}
                  className="rounded-lg bg-transparent size-auto max-h-[30rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                  src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                  alt="cover"
                  width={600}
                  height={600}
                />
                <motion.div initial={{
                  opacity: 0,
                }} animate={{
                  opacity: 1,
                  scale: action === "Play" ? isMoved ? 1.2 : 1 : 0.8,
                  marginLeft: isMoved ? action === "Play" ? '7rem' : '-7rem' : action === "Play" ? 0 : "-7rem",
                }} exit={{
                  opacity: 0,
                }} transition={{
                  ease: "easeInOut",
                }} className=" max-w-[40rem] w-full max-h-[30rem] relative h-full overflow-auto">
                  {currentSongDetails.lyric.lyric && currentSongDetails.lyric.lyric.length > 0 ? (
                    <SynchronizedLyrics
                      audioRef={audioRef as React.RefObject<HTMLAudioElement>}
                      lyrics={currentSongDetails.lyric.lyric}
                      currentTime={formatTimeToSeconds(currentTime)}
                      setCurrentTime={(time: number) => {
                        console.log("Setting current time:", time);
                        if (audioRef.current && !audioRef.current.paused) {
                          audioRef.current.currentTime = time;
                        }
                        setCurrentTime(formatSecondsToTime(time));
                      }}
                    />
                  ) : (
                    <p className=" text-white/50 h-full w-full flex items-center justify-center text-center text-3xl font-medium">{isLyricText}</p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>)}
          <motion.div initial={false} animate={{
            opacity: isLyric && isBlended ? 1 : 0,
            display: isLyric && isBlended ? "block" : "none",
          }} className=" w-full h-full pointer-events-none absolute top-0 left-0 z-10 " >
            <motion.div
              key={"BlendedCover2"}
              className=" absolute h-full w-full object-center backdrop-blur-3xl object-cover z-10 left-0 top-0 bg-black/40 to-90%"
            />
            <motion.img
              key={"BlendedImage"}
              layoutId={"cover"}
              className=" bg-transparent h-full z-10 w-full object-center object-cover"
              src={currentSongDetails.cover || "/albumPlaceholder.svg"}
              alt="cover"
              width={600}
              height={600}
            />
          </motion.div>
          {isBlended && !isLyric && (
            <>
              <motion.div animate={{
                opacity: isBlended ? 1 : 0,
              }} initial={false} key={"BlendedCover"} className=" absolute h-full w-full object-center object-cover z-10 left-0 top-0 bg-black/40" />
              <motion.img
                key={"BlendedImage"}
                layoutId={"cover"}
                animate={{
                  opacity: isLyric ? 0 : 1,
                  scale: action === "Play" ? 1 : 0.8,
                }}
                className=" bg-transparent absolute h-full z-0 w-full object-center object-cover left-0 top-0 shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
                src={currentSongDetails.cover || "/albumPlaceholder.svg"}
                alt="cover"
                width={600}
                height={600}
              />
            </>
          )}
          <motion.img
            key={"LargeCover"}
            layoutId={"cover"}
            animate={{
              opacity: isLyric || isBlended ? 0 : 1,
              scale: action === "Play" ? isMoved ? 1.5 : 1 : 0.8,
            }}
            transition={{
              ease: "easeInOut",
            }}
            className="rounded-lg bg-transparent size-auto absolute top-0 bottom-0 my-[13rem] left-0 right-0 mx-auto max-h-[30rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/80"
            src={currentSongDetails.cover || "/albumPlaceholder.svg"}
            alt="cover"
            width={600}
            height={600}
          />
          <div className=" z-10 w-full h-max  flex flex-col space-y-8 p-10">
            <motion.div animate={{
              y: !isMoved ? 0 : 170,
            }} transition={{
              ease: "easeInOut",
            }}>
              <h1 className=" text-7xl font-semibold">
                {currentSongDetails.title || ""}
              </h1>
              <div className=" text-lg font-medium flex items-center">
                {currentSongDetails.explicit && (
                  <div className=" size-6 min-w-[16px] flex items-center text-sm justify-center rounded-sm bg-white/30 font-medium mr-1">E</div>
                )}
                <span
                  onClick={(e) => {
                    router.push(`/artist/${currentSongDetails.artistId}`);
                    e.stopPropagation();
                  }}
                  className="text-white/50 hover:underline cursor-pointer hover:text-white transition-colors"
                >
                  {currentSongDetails.artistName || ""}
                </span>
                {currentSongDetails.feats && currentSongDetails.feats.length > 0 &&
                  currentSongDetails.feats.map((feat, index) => (
                    <span
                      key={index}
                      onClick={(e) => {
                        router.push(`/artist/${feat.id}`);
                        e.stopPropagation();
                      }}
                      className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                    >
                      {","}
                      {feat.username}
                    </span>
                  ))}
              </div>
            </motion.div>
            <motion.div animate={{
              opacity: !isMoved ? 1 : 0,
              y: !isMoved ? 0 : 200,
            }} transition={{
              ease: "easeInOut",
            }}>
              <Slider
                className=" w-full "
                isThumb={false}
                step={1}
                defaultValue={[50]}
                min={0}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    const wasPlaying = !audioRef.current.paused;
                    if (wasPlaying) {
                      audioRef.current.pause();
                    }
                    audioRef.current.currentTime = value[0];
                    if (wasPlaying) {
                      audioRef.current.play();
                    }
                  }
                  setCurrentTime(formatSecondsToTime(value[0]));
                }}
                max={formatTimeToSeconds(currentSongDetails.duration) || 100}
                value={[formatTimeToSeconds(currentTime)]}
              />
              <div className=" w-full flex items-center justify-between mt-2">
                <p className=" text-xs text-white/50 font-medium">
                  {formatSecondsToTime(formatTimeToSeconds(currentTime)) || "0:00"}
                </p>
                <p className=" text-xs text-white/50 font-medium">{formatSecondsToTime(formatTimeToSeconds(currentSongDetails.duration))}</p>
              </div>
            </motion.div>
            <motion.div animate={{
              opacity: !isMoved ? 1 : 0,
              y: !isMoved ? 0 : 200,
            }} transition={{
              ease: "easeInOut",
            }} className=" flex items-center justify-center w-full gap-x-5">
              <button onClick={() => {
                setIsShuffled(!isShuffled);
              }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                {isShuffled ? (
                  <Shuffle size={40} className=" text-white opacity-100" />
                ) : (
                  <Shuffle size={40} className=" text-white opacity-40" />
                )}
              </button>
              <button onClick={() => prevSong()} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigLeft fill="white" className={` text-white size-[60px] ${!currentSongID.url || isLoading && ' pointer-events-none opacity-40'}`} />
              </button>
              {!isLoading ? (
                <button
                  onClick={() => {
                    handlePlay();
                  }}
                  className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                >
                  {action === "Play" ? (
                    <Pause fill="white" className={` text-white  ${!currentSongID.url && ' pointer-events-none opacity-40'} size-[80px]`} />
                  ) : (
                    <Play fill="white" className={` text-white size-[80px] ${!currentSongID.url && ' pointer-events-none opacity-40'}`} />
                  )}
                </button>
              ) : (
                <div className=" rounded-full flex items-center justify-center">
                  <LoaderCircle className=" text-white size-[80px] stroke-3 stroke-white animate-spin" />
                </div>
              )}
              <button onClick={() => nextSong()} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigRight fill="white" className={` text-white ${!currentSongID.url || isLoading && ' pointer-events-none opacity-40'} size-[60px]`} />
              </button>
              <button onClick={() => {
                if (isLooped === "false") {
                  setIsLooped("all");
                } else if (isLooped === "all") {
                  setIsLooped("one");
                } else if (isLooped === "one") {
                  setIsLooped("false");
                }
              }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                {isLooped === "false" ? (
                  <Repeat size={40} className={` text-white opacity-40`} />
                ) : isLooped === "all" ? (
                  <Repeat size={40} className={` text-white`} />
                ) : (
                  <Repeat1 size={40} className={` text-white`} />
                )}
              </button>
            </motion.div>
          </div>
          <motion.div animate={{
            opacity: !isMoved ? 1 : 0,
            y: !isMoved ? 0 : -200,
          }} transition={{
            ease: "easeInOut",
          }} className=" w-full h-max absolute z-[100] space-x-4 top-4 flex items-center justify-center">
            <button
              onClick={() => {
                setIsLyric(!isLyric);
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)]  rounded-xl ${isLyric ? "bg-white/10 shadow-black/20" : " bg-transparent shadow-transparent"
                } p-2`}
            >
              {isLyric ? (
                <MicVocal size={25} className=" text-white" />
              ) : (
                <MicVocal size={25} className=" text-white opacity-40" />
              )}
            </button>
            <div className=" flex gap-x-2 max-w-[15rem] w-full">
              <button
                className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !audioRef.current.muted;
                    setIsMuted(audioRef.current.muted);
                    setVolumeState(audioRef.current.volume * 100);
                  }
                }}
              >
                {!isMuted ? (
                  volumeState > 75 ? (
                    <Volume2 className=" text-white md:size-[24px] stroke-2 opacity-50" />
                  ) : volumeState > 25 ? (
                    <Volume1 className=" text-white md:size-[24px] stroke-2 opacity-50" />
                  ) : volumeState > 0 ? (
                    <Volume className=" text-white md:size-[24px] stroke-2 opacity-50" />
                  ) : (
                    <VolumeX className=" text-white md:size-[24px] stroke-2 opacity-50" />
                  )
                ) : (
                  <VolumeOff className=" text-white md:size-[24px] stroke-2 opacity-50" />
                )}
              </button>
              <Slider
                className=" w-full"
                defaultValue={[audioRef.current ? audioRef.current.volume * 100 : 50]}
                step={1}
                min={0}
                max={100}
                value={[volumeState]}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    audioRef.current.volume = value[0] / 100;
                    setVolumeState(value[0]);
                  }
                }}
                isThumb={false}
              />
            </div>
            <button
              onClick={() => {
                setIsBlended(!isBlended);
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)]  rounded-xl ${isBlended ? "bg-white/10 shadow-black/20" : " bg-transparent shadow-transparent"
                } p-2`}
            >
              <Blend size={25} className={` text-white transition-opacity ${isBlended ? "opacity-100" : "opacity-40"}`} />
            </button>
            <button
              onClick={() => {
                setIsFullScreen(!isFullScreen);
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
              }}
              className={` transition-all shadow-[0_0_10px_0_rgba(0,0,0,0)] text-white/40 hover:text-white  rounded-xl p-2`}
            >
              <Minimize2 size={25} className={` transition-opacity `} />
            </button>
          </motion.div>
        </motion.main >
        <main className=" w-full fixed bottom-0 p-2 left-0 pl-2 space-x-[5%] justify-between z-[51] items-center flex h-[6rem] bg-black">
          {currentSongDetails.url && <audio src={currentSongDetails.url} autoPlay ref={audioRef}></audio>}
          <div className=" flex items-center w-[70%] max-w-[25rem] relative gap-x-2">
            <div className=" h-full w-5 absolute right-0 top-0 bg-gradient-to-l from-black z-50" />
            {currentSongDetails.cover ? (
              <Image
                className=" rounded-xl size-[4.5rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
                src={currentSongDetails.cover}
                alt="cover"
                unoptimized
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
              <div ref={titleHandle} className="overflow-hidden w-full">
                <motion.div
                  ref={titleRef}
                  initial={{ x: 0 }}
                  animate={
                    isTitleAnimated
                      ? {
                        x: ["100%", 0, 0, "-100%"],
                        transition: {
                          times: [0, 0.3, 0.7, 1],
                          duration: 6,
                          repeat: Infinity,
                        },
                      }
                      : { x: 0 }
                  }
                  className="font-semibold lg:text-lg w-max whitespace-nowrap"
                >
                  {currentSongDetails.title || ""}
                </motion.div>
              </div>
              <div className=" flex items-center">
                {currentSongDetails.explicit && (
                  <div className=" size-4 min-w-[16px] flex items-center text-xs justify-center rounded-[2px] bg-white/30 mr-1">E</div>
                )}
                <div ref={artistsHandle} className="overflow-hidden w-full flex items-center">
                  <motion.div
                    ref={artistsRef}
                    initial={{ x: 0 }}
                    animate={
                      isArtistsAnimated
                        ? {
                          x: ["100%", 0, 0, "-100%"],
                          transition: {
                            times: [0, 0.3, 0.7, 1],
                            duration: 6,
                            repeat: Infinity,
                          },
                        }
                        : { x: 0 }
                    }
                    className=" w-max cursor-pointer transition-colors flex items-center font-medium whitespace-nowrap"
                  >
                    <span
                      onClick={() => {
                        router.push(`/profile/${currentSongDetails.artistId}`);
                      }}
                      className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                    >
                      {currentSongDetails.artistName || ""}
                    </span>
                    {currentSongDetails.feats && currentSongDetails.feats.length > 0 && currentSongID.url &&
                      currentSongDetails.feats.map((feat, index) => (
                        <span
                          key={index}
                          onClick={(e) => {
                            router.push(`/profile/${feat.id}`);
                            e.stopPropagation();
                          }}
                          className="text-white/50 hover:underline hover:text-white transition-colors text-xs"
                        >
                          {","}
                          {feat.username}
                        </span>
                      ))}
                  </motion.div>
                </div>
              </div>
            </div>
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
              <button onClick={() => prevSong()} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigLeft fill="white" className={` text-white md:size-[28px] size-[24px] ${(!currentSongID || isLoading) && ' pointer-events-none opacity-40'}`} />
              </button>
              {!isLoading ? (
                <button
                  onClick={() => {
                    handlePlay();
                  }}
                  className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                >
                  {action === "Play" ? (
                    <Pause fill="white" className={` text-white md:size-[36px] ${!currentSongID.url && ' pointer-events-none opacity-40'} size-[24px]`} />
                  ) : (
                    <Play fill="white" className={` text-white md:size-[36px] size-[24px] ${!currentSongID.url && ' pointer-events-none opacity-40'}`} />
                  )}
                </button>
              ) : (
                <div className=" rounded-full flex items-center justify-center">
                  <LoaderCircle className=" text-white  md:size-[36px] stroke-3 stroke-white size-[24px] animate-spin" />
                </div>
              )}
              <button onClick={() => nextSong()} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <ArrowBigRight fill="white" className={` text-white md:size-[28px] ${(!currentSongID.url || isLoading) && ' pointer-events-none opacity-40'} size-[24px]`} />
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (isLooped === "false") {
                          setIsLooped("all");
                        } else if (isLooped === "all") {
                          setIsLooped("one");
                        } else if (isLooped === "one") {
                          setIsLooped("false");
                        }
                      }}
                      className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                    >
                      {isLooped === "false" ? (
                        <Repeat className={` text-white md:size-[20px] opacity-40 size-[24px]`} />
                      ) : isLooped === "all" ? (
                        <Repeat className={` text-white md:size-[20px] size-[24px]`} />
                      ) : (
                        <Repeat1 className={` text-white md:size-[20px] size-[24px]`} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={10}
                    className="font-medium z-[999] bg-white/20 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
                  >
                    {isLooped === "false" ? "Repeat Off" : isLooped === "all" ? "Repeat All" : "Repeat One"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className=" flex gap-x-2 items-center xl:w-[40rem] w-full">
              <p className=" text-xs text-white/50 max-w-[30px] min-w-[30px] font-medium">
                {formatSecondsToTime(formatTimeToSeconds(currentTime)) || "0:00"}
              </p>
              <Slider
                className=" w-full "
                isThumb={true}
                defaultValue={[50]}
                step={1}
                min={0}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    const wasPlaying = !audioRef.current.paused;
                    if (wasPlaying) {
                      audioRef.current.pause();
                    }
                    audioRef.current.currentTime = value[0];
                    if (wasPlaying) {
                      audioRef.current.play();
                    }
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
                    <button
                      className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.muted = !audioRef.current.muted;
                          setIsMuted(audioRef.current.muted);
                          setVolumeState(audioRef.current.volume * 100);
                        }
                      }}
                    >
                      {!isMuted ? (
                        volumeState > 75 ? (
                          <Volume2 className=" text-white md:size-[24px] stroke-2 opacity-50" />
                        ) : volumeState > 25 ? (
                          <Volume1 className=" text-white md:size-[24px] stroke-2 opacity-50" />
                        ) : volumeState > 0 ? (
                          <Volume className=" text-white md:size-[24px] stroke-2 opacity-50" />
                        ) : (
                          <VolumeX className=" text-white md:size-[24px] stroke-2 opacity-50" />
                        )
                      ) : (
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
                defaultValue={[audioRef.current ? audioRef.current.volume * 100 : 50]}
                step={1}
                min={0}
                max={100}
                value={[volumeState]}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    audioRef.current.volume = value[0] / 100;
                    setVolumeState(value[0]);
                  }
                }}
                isThumb={false}
              />
            </div>
            <button
              onClick={() => {
                setIsFullScreen(!isFullScreen);
                if (!isMobile) {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }
              }}
              className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Maximize2 className=" text-white md:size-[20px] size-[20px] opacity-50" />
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
