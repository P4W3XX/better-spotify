"use client";

import {
  ArrowLeft,
  CirclePlus,
  Clock,
  Ellipsis,
  ListMusic,
  LoaderCircle,
  Music,
  Pause,
  Play,
  Plus,
  Share,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SongPreview } from "@/components/song-preview";
import { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { VisuallyHidden } from "radix-ui";
import { useParams, useRouter } from "next/navigation";
import { useAlbumCoverStore } from "@/store/album-cover";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentSongStore } from "@/store/current-song";

const TopBar = ({
  handleRef,
  title,
  artist,
  cover,
  theme,
  setScrollY2,
}: {
  title: string;
  artist: string;
  cover: string;
  theme: string;
  handleRef: React.RefObject<HTMLDivElement | null>;
  setScrollY2: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [scrollY, setScrollY] = useState(0);
  const mobile = useMediaQuery("(max-width: 768px)");
  const [isMounted, setIsMounted] = useState(false);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (handleRef?.current) {
        setScrollY(handleRef.current.scrollTop);
        setScrollY2(handleRef.current.scrollTop);
      }
    };

    const currentRef = handleRef?.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleRef]);

  if (!isMounted) return null;



  return (
    <div
      style={{
        opacity: scrollY > 0 ? Math.min((scrollY * 0.3) / 100, 1) : 0,
        backgroundColor: theme,
      }}
      className={` w-full md:h-[6rem] h-[4.5rem] border-b md:p-3 p-2 flex justify-between items-center z-20 top-0 fixed ${scrollY > 350 ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      <div className=" flex items-center space-x-4">
        {!mobile && (
          cover ? (
            <Image
              unoptimized
              src={cover}
              alt="Cover"
              width={500}
              height={500}
              className="rounded-lg cursor-pointer md:size-[4.5rem] size-[3.5rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
            />
          ) : (
            <Skeleton className="size-[4.5rem] aspect-square" />
          ))}

        <div className={`${mobile && 'pl-[3.5rem]'}`}>
          <h1 className=" md:text-2xl text-2xl font-semibold">{title}</h1>
          <p className=" text-white/50 md:text-sm text-xs font-medium">
            {artist}
          </p>
        </div>
      </div>
      <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer md:size-[3.5rem] size-[2.5rem] bg-white rounded-full flex items-center justify-center">
        <Play className=" text-black md:size-[20px] size-[16px]" fill="black" />
      </button>
    </div>
  );
};

const MoreInfo = () => {
  const [isMounted, setIsMounted] = useState(false);
  const mobile = useMediaQuery("(max-width: 768px)");

  // Only render after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null during SSR and initial client render
  if (!isMounted) return null;

  if (mobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
            <Ellipsis className=" text-white opacity-50 md:size-[36px] size-[24px]" />
          </button>
        </DrawerTrigger>
        <DrawerContent className=" pb-[10rem]">
          <VisuallyHidden.Root>
            <DrawerTitle>More Info</DrawerTitle>
            <DrawerDescription>More Info</DrawerDescription>
          </VisuallyHidden.Root>
          <div className=" px-4 rounded-xl mt-3">
            <div className=" flex hover:!bg-white/10 items-center p-2 rounded-xl justify-start w-full space-x-2">
              <CirclePlus className=" text-white" size={20} />
              <p>Add to Library</p>
            </div>
          </div>
          <div className=" px-4 rounded-xl mt-3">
            <div className=" flex hover:!bg-white/10 items-center p-2 rounded-xl justify-start w-full space-x-2">
              <Share className=" text-white" size={20} />
              <p>Share</p>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  } else {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
            <Ellipsis className=" text-white opacity-50 md:size-[36px] size-[24px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" bg-black/30 backdrop-blur-3xl text-white rounded-xl text-sm font-medium">
          <DropdownMenuItem className=" px-2 hover:!bg-white/10 pr-14 rounded-lg py-2 items-end">
            <div className=" flex items-center justify-start w-full space-x-2">
              <CirclePlus className=" text-white" size={36} />
              <p>Add to Library</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator className=" bg-white/10" />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <div className=" flex items-center justify-start w-full space-x-2">
                <Plus className=" text-white" size={18} />
                <p>Add to Playlist</p>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                sideOffset={10}
                className="  bg-black/30 backdrop-blur-3xl text-white rounded-xl text-sm font-medium"
              >
                <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                  <div className=" flex min-w-[8rem] space-x-2 items-center ">
                    <Plus className=" text-white" size={18} />
                    <p>Create Playlist</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className=" bg-white/10" />
                <ScrollArea className=" h-[200px] w-full pr-2">
                  <div className=" pr-1">
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg mb-1 items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 1</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg mb-1 items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 2</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                      <div className=" flex min-w-[8rem] space-x-2 items-center ">
                        <ListMusic className=" text-white" size={18} />
                        <p>My Playlist 3</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </ScrollArea>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator className=" bg-white/10" />
          <DropdownMenuItem className=" px-2 hover:!bg-white/10 pr-10 rounded-lg py-2 items-end">
            <div className=" flex items-center justify-start w-full space-x-2">
              <Share className=" text-white" size={36} />
              <p>Share</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

interface AlbumInfo {
  title: string;
  artist: string;
  cover: string;
  type: string;
  releaseDate: string;
  artistCover: string;
  artistName: string;
  theme: string;
  albumDuration: string;
  totalPlays: number;
  songs: SongInfo[];
}

interface SongInfo {
  title: string;
  is_indecent: boolean;
  artist: number;
  cover: string;
  duration: string;
  plays: number;
  featured_artists: [{ id: number, username: string }];
  isCover: boolean;
  id: string;
}


export default function Album() {
  const { albumID } = useParams();
  const handleRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const mobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const setAlbumCover = useAlbumCoverStore((state) => state.setAlbumCover);
  const albumCover = useAlbumCoverStore((state) => state.albumCover);
  const setCurrentSongID = useCurrentSongStore(
    (state) => state.setCurrentSongID);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const isLoading = useCurrentSongStore((state) => state.isLoading);
  const action = useCurrentSongStore((state) => state.action);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    title: "",
    artist: "",
    cover: "",
    type: "",
    artistName: "",
    releaseDate: "",
    artistCover: "",
    albumDuration: "",
    theme: "",
    totalPlays: 0,
    songs: [],
  });


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

  useEffect(() => {
    const fetchAlbumInfo = async () => {
      try {
        const resp = await axios.get(
          `http://127.0.0.1:8000/api/albums/${albumID}/`
        );
        console.log(resp.data);
        setAlbumInfo({
          title: resp.data.title,
          artist: resp.data.artist,
          cover: resp.data.image,
          type: resp.data.album_type,
          artistName: resp.data.artist_username,
          artistCover: resp.data.artist_cover,
          theme: resp.data.theme,
          albumDuration: resp.data.album_duration,
          releaseDate: resp.data.release_date,
          totalPlays: resp.data.total_plays,
          songs: resp.data.songs,
        });
      } catch (error) {
        console.error("Error fetching album info:", error);
      }
    };
    fetchAlbumInfo();
  }, []);

  useEffect(() => {
    console.log("Mobile", mobile);
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      layoutId="album"
      style={{ backgroundColor: albumInfo.theme }}
      className={` relative w-full md:h-[calc(100svh-6.5rem)] h-[calc(100svh-4rem)] flex md:rounded-xl flex-col ${albumCover ? "overflow-hidden" : " overflow-auto"
        }`}
      ref={handleRef}
    >
      <button
        onClick={() => router.back()}
        className=" fixed top-5 left-5 z-50 block md:hidden"
      >
        <ArrowLeft className="size-[2rem]" />
      </button>
      <TopBar handleRef={handleRef} setScrollY2={setScrollY} title={albumInfo.title} artist={albumInfo.artistName} cover={albumInfo.cover} theme={albumInfo.theme} />
      <div className=" md:p-7 px-4 pt-16 md:pt-7 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 relative md:space-x-8 z-10">
        <div className=" w-full h-full left-0 bg-gradient-to-t from-black/40 to-black/20 top-0 absolute" />
        {albumInfo.cover ? (
          <Image
            src={albumInfo.cover}
            alt="Cover"
            width={500}
            unoptimized
            onClick={() => setAlbumCover(albumInfo.cover)}
            height={500}
            className="rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 md:size-[15rem] size-auto max-w-[15rem] w-[98%]  shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
          />
        ) : (
          <Skeleton className="size-[15rem] aspect-square z-10" />
        )}
        <div className=" items-start z-10 w-full md:space-y-5 space-y-4 flex flex-col justify-end">
          {albumInfo.type ? (
            <p className=" md:block hidden font-medium">
              {albumInfo.type.slice(0, 1).toUpperCase() +
                albumInfo.type.slice(1) || ""}
            </p>
          ) : (
            <Skeleton className=" w-1/2 h-[20px]" />
          )}
          {albumInfo.title ? (
            <h1 className=" md:text-8xl text-4xl truncate w-full font-semibold">
              {albumInfo.title || ""}
            </h1>
          ) : (
            <Skeleton className=" w-1/2 md:h-[96px] h-[36px]" />
          )}
          <div className=" flex md:items-center md:flex-row flex-col text-sm font-medium space-y-2 md:space-y-0 md:space-x-2">
            <div className=" flex items-center space-x-2">
              {albumInfo.artistCover ? (
                <Image
                  src={albumInfo.artistCover}
                  unoptimized
                  alt="ArtistCover"
                  width={25}
                  height={25}
                  className="rounded-full size-[1.3rem]"
                />
              ) : (
                <Skeleton className="size-[1.3rem] aspect-square rounded-full" />
              )}
              {albumInfo.artistName.length > 0 ? (
                <p
                  onClick={() => router.push(`/profile/${albumInfo.artist}`)}
                  className=" cursor-pointer truncate hover:underline transition-colors font-medium"
                >
                  {albumInfo.artistName || ""}
                </p>
              ) : (
                <Skeleton className=" w-[80px] h-[20px]" />
              )}
            </div>
            <div className=" flex md:space-x-2 items-center space-x-1 text-xs md:text-sm">
              <p style={{
                color: albumInfo.theme
              }} className=" md:block hidden brightness-[5] font-semibold">
                •
              </p>
              {albumInfo.releaseDate ? (
                <p style={{
                  color: albumInfo.theme
                }} className="brightness-[5] font-semibold">
                  {albumInfo.releaseDate.split("-")[0] || ""}
                </p>
              ) : (
                <Skeleton className=" w-[40px] h-[20px]" />
              )}
              <p style={{
                color: albumInfo.theme
              }} className=" md:block hidden brightness-[5] font-semibold">
                •
              </p>
              {albumInfo.songs.length > 0 ? (
                <p style={{
                  color: albumInfo.theme
                }} className=" brightness-[5] truncate font-semibold">
                  {albumInfo.songs.length} {albumInfo.songs.length > 1 ? "songs" : "song"}
                </p>
              ) : (
                <Skeleton className=" w-[40px] h-[20px]" />
              )}
              <p style={{
                color: albumInfo.theme
              }} className=" md:block hidden brightness-[5] font-semibold">
                •
              </p>
              {albumInfo.albumDuration ? (
                <p style={{
                  color: albumInfo.theme
                }} className=" md:block hidden brightness-[5] truncate font-semibold">
                  {formatSecondsToTime(formatTimeToSeconds(albumInfo.albumDuration))}
                </p>
              ) : (
                <Skeleton className=" w-[40px] h-[20px]" />
              )}
              <p style={{
                color: albumInfo.theme
              }} className=" md:block hidden brightness-[5] font-semibold">
                •
              </p>
              <p style={{
                color: albumInfo.theme
              }} className=" md:block hidden truncate brightness-[5] font-semibold">
                {albumInfo.totalPlays.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full flex md:justify-start justify-between flex-row-reverse md:flex-row items-center md:space-x-8 space-x-4 h-full md:p-7 pl-4 md:pb-7 md:max-h-[7rem] bg-gradient-to-t max-h-[4rem] from-black/60 to-black/40">
        <div className=" flex md:flex-row flex-row-reverse items-center md:gap-x-8 gap-x-4">
          {isLoading ? (
          <div className="w-full flex items-center justify-center md:size-[4rem] size-[3rem] bg-white rounded-full">
            <LoaderCircle className="text-black animate-spin stroke-3 stroke-black" size={25} />
          </div>
          ) : (
            <button onClick={() => {
              if (albumInfo.songs.length > 0 && albumInfo.songs[0]) {
                if (currentSongID && albumInfo.songs.some(song => song.id.toString() === currentSongID)) {
                  if (action === "Play") {
                    setAction("Pause");
                  } else {
                    setAction("Play");
                  }
                }
                else {
                  setCurrentSongID(albumInfo.songs[0].id.toString());
                  setAction("Play");
                }
              }
            }} className=" hover:scale-105 active:scale-95 transition-all cursor-pointer md:size-[4rem] size-[3rem] bg-white rounded-full flex items-center justify-center">
              {currentSongID && albumInfo.songs.some(song => song.id.toString() === currentSongID) ? (
                action === "Play" ? (
                  <Pause className="text-black md:size-[24px] size-[20px]" fill="black" />
                ) : (
                  <Play className="text-black md:size-[24px] size-[20px]" fill="black" />
                )
              ) : (
                <Play className="text-black md:size-[24px] size-[20px]" fill="black" />
              )}
            </button>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                  <Shuffle className=" text-white opacity-50 md:size-[36px] size-[24px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={10}
                className="font-medium bg-black/50 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
              >
                {albumInfo.title}: Shuffle
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className=" flex items-center md:flex-row flex-row-reverse gap-x-4 md:gap-x-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                  <CirclePlus className=" text-white md:size-[36px] size-[24px] opacity-50" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                sideOffset={10}
                className="font-medium bg-black/50 backdrop-blur-3xl text-white rounded-lg text-sm p-2 "
              >
                Add to Library
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <MoreInfo />
        </div>
      </div>
      <div className=" w-full h-full space-y-3 flex flex-col bg-black/60">
        <div
          className={`w-full hidden  md:flex flex-col space-y-2 items-center sticky md:px-7 px-4 top-[6rem] z-10`}
          style={{
            backgroundColor: scrollY > 300 ? albumInfo.theme : "transparent",
            transition: "background-color 0.3s ease",
          }}
        >
          <div className=" flex w-full text-white/50 py-2 items-center font-medium">
            <div className=" w-full max-w-[65px] text-center">#</div>
            <div className=" w-full">Title</div>
            <div className=" w-full max-w-[400px] hidden lg:block mr-[20px] text-center">
              Plays
            </div>
            <div className=" w-full max-w-[150px] items-center flex justify-center">
              <Clock className=" text-white/50 stroke-2" size={18} />
            </div>
          </div>
          {scrollY < 300 && <Separator className=" bg-white/10" />}
        </div>
        <div className=" flex flex-col w-full h-full space-y-3 pb-[9rem] md:pb-[7rem] md:px-7 px-2">
          {albumInfo.songs.length > 0 ? (
            albumInfo.songs.map((song: SongInfo, index: number) => (
              <SongPreview
                isIndecent={song.is_indecent}
                cover={''}
                key={index}
                index={index}
                title={song.title}
                isIndex={true}
                artistId={song.artist}
                isDuration={true}
                isPlays={true}
                artist={albumInfo.artistName}
                feats={song.featured_artists}
                isCover={false}
                id={song.id}
                plays={song.plays}
                duration={song.duration}

              />
            ))
          ) : (
            <div className=" flex items-center justify-center w-full h-full gap-x-3">
              <p className=" text-white/50 font-medium md:text-3xl text-2xl">No songs available</p>
              <Music className=" opacity-50 md:size-[50px] size-[35px]" size={50} />
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
}
