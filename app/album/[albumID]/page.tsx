"use client";

import {
  ArrowLeft,
  CirclePlus,
  Clock,
  Ellipsis,
  ListMusic,
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
import { motion } from "framer-motion";

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

const TopBar = ({
  handleRef,
  setScrollY2,
}: {
  handleRef: React.RefObject<HTMLDivElement | null>;
  setScrollY2: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [scrollY, setScrollY] = useState(0);

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

  return (
    <div
      style={{
        opacity: scrollY > 0 ? Math.min((scrollY * 0.3) / 100, 1) : 0,
      }}
      className={` w-full md:h-[6rem] h-[4.5rem] border-b md:p-3 p-2 flex justify-between items-center  bg-[#3c2428] z-20 top-0 fixed ${
        scrollY > 350 ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div className=" flex items-center space-x-4">
        <Image
          src={"/cover.jpg"}
          alt="Cover"
          width={500}
          height={500}
          className="rounded-lg cursor-pointer md:size-[4.5rem] size-[3.5rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
        />
        <div>
          <h1 className=" md:text-2xl text-2xl font-semibold">4X4</h1>
          <p className=" text-white/50 md:text-sm text-xs font-medium">
            Travis Scott
          </p>
        </div>
      </div>
      <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer md:size-[3.5rem] size-[2.5rem] bg-white rounded-full flex items-center justify-center">
        <Play className=" text-black md:size-[20px] size-[16px]" fill="black" />
      </button>
    </div>
  );
};

const AlbumCoverShow = ({
  see,
  setSee,
}: {
  see: boolean;
  setSee: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!see) return; // Don't add event listener if album cover is hidden

    // To prevent immediate closing, use mousedown instead of click
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSee(false);
      }
    };

    // Add event listener with a delay to avoid catching the same click
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [see, setSee]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        pointerEvents: "none",
      }}
      animate={{
        opacity: see ? 1 : 0,
        transition: { duration: 0.2 },
        pointerEvents: see ? "all" : "none",
      }}
      className="w-full h-svh flex items-center justify-center z-50 bg-black/60 absolute"
    >
      <motion.div
        initial={{
          y: 100,
        }}
        animate={{
          y: see ? 0 : 100,
          transition: { duration: 0.2 },
        }}
        exit={{
          y: 100,
          transition: { duration: 0.2 },
        }}
        ref={containerRef}
        className="md:size-[40rem] w-[85%] flex items-center justify-center"
      >
        <Image
          ref={imageRef}
          src={"/cover.jpg"}
          alt="Cover"
          width={1000}
          height={1000}
          className="rounded-lg cursor-pointer w-full h-full shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
        />
      </motion.div>
    </motion.div>
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

export default function Album() {
  const handleRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [AlbumCoverShowState, setAlbumCoverShowState] = useState(false);
  const mobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    console.log("Mobile", mobile);
  }, []);

  useEffect(() => {
    console.log("AlbumCoverShowState", AlbumCoverShowState);
  }, [AlbumCoverShowState]);
  return (
    <motion.main
      exit={{ x: 100 }}
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ backgroundColor: "#3c2428" }}
      className={` relative w-full h-svh flex flex-col ${
        AlbumCoverShowState ? "overflow-hidden" : " overflow-auto"
      }`}
      ref={handleRef}
    >
      <AlbumCoverShow
        see={AlbumCoverShowState}
        setSee={setAlbumCoverShowState}
      />
      <button className=" absolute top-4 left-4 block md:hidden">
        <ArrowLeft className="size-[2rem]" />
      </button>
      <TopBar handleRef={handleRef} setScrollY2={setScrollY} />
      <div className=" md:p-7 p-4 pt-8 md:pt-7 flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 relative md:space-x-8 z-10">
        <div className=" w-full h-full left-0 bg-gradient-to-t from-black/20 top-0 absolute" />
        <Image
          src={"/cover.jpg"}
          alt="Cover"
          width={500}
          onClick={() => setAlbumCoverShowState(true)}
          height={500}
          className="rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer z-10 md:size-[15rem] size-[15rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
        />
        <div className=" items-start z-10 w-full md:space-y-5 space-y-4 flex flex-col justify-end">
          <p className=" md:block hidden font-medium">Single</p>
          <h1 className=" md:text-8xl text-4xl font-semibold">4X4</h1>
          <div className=" flex md:items-center md:flex-row flex-col text-sm font-medium space-y-2 md:space-y-0 md:space-x-2">
            <div className=" flex items-center space-x-2">
              <Image
                src={"/travis.jpg"}
                alt="ArtistCover"
                width={25}
                height={25}
                className="rounded-full size-[1.3rem]"
              />
              <p className=" font-medium text-xs md:text-sm">Travis Scott</p>
            </div>
            <div className=" flex md:space-x-2 items-center space-x-1 text-xs md:text-sm">
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                •
              </p>
              <p className=" text-[#3c2428] brightness-[5] font-semibold">
                Single
              </p>
              <p className=" text-[#3c2428] brightness-[5] font-semibold">•</p>
              <p className=" text-[#3c2428] brightness-[5] font-semibold">
                2025
              </p>
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                •
              </p>
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                1 song
              </p>
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                •
              </p>
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                3:45
              </p>
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                •
              </p>
              <p className=" text-[#3c2428] md:block hidden brightness-[5] font-semibold">
                123 320 932
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" w-full flex md:justify-start justify-between flex-row-reverse md:flex-row items-center md:space-x-8 space-x-4 h-full md:p-7 pl-4 md:pb-7 pb-3 max-h-[7rem] bg-gradient-to-t from-black/60 to-black/20">
        <div className=" flex md:flex-row flex-row-reverse items-center md:gap-x-8 gap-x-4">
          <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer md:size-[4rem] size-[3rem] bg-white rounded-full flex items-center justify-center">
            <Play
              className=" text-black md:size-[24px] size-[20px]"
              fill="black"
            />
          </button>
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
                4X4: Shuffle
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
      <div className=" w-full h-fit space-y-3 flex flex-col bg-black/60">
        <div
          className={`w-full hidden  md:flex flex-col space-y-2 items-center sticky md:px-7 px-4 top-[6rem] z-10`}
          style={{
            backgroundColor: scrollY > 300 ? "#3c2428" : "transparent",
            transition: "background-color 0.3s ease",
          }}
        >
          <div className=" flex w-full text-white/50 py-2 items-center font-medium">
            <div className=" w-full max-w-[65px] text-center">#</div>
            <div className=" w-full">Title</div>
            <div className=" w-full max-w-[400px] mr-[20px] text-center">
              Plays
            </div>
            <div className=" w-full max-w-[150px] items-center flex justify-center">
              <Clock className=" text-white/50 stroke-2" size={18} />
            </div>
          </div>
          {scrollY < 300 && <Separator className=" bg-white/10" />}
        </div>
        <div className=" flex flex-col space-y-3 pb-[9rem] md:px-7 px-2">
          <SongPreview index={0} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
          <SongPreview index={1} />
        </div>
      </div>
    </motion.main>
  );
}
