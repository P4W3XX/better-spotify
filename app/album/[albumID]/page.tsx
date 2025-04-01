import {
  CirclePlus,
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
import { Input } from "@/components/ui/input";

export default function Album() {
  return (
    <div
      style={{ backgroundColor: "#3c2428" }}
      className=" relative w-full h-svh flex flex-col"
    >
      <div className=" p-7 flex relative space-x-8 z-10">
        <div className=" w-full h-full left-0 bg-gradient-to-t from-black/20 top-0 absolute" />
        <Image
          src={"/cover.jpg"}
          alt="Cover"
          width={500}
          height={500}
          className="rounded-lg z-10 size-[15rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
        />
        <div className=" items-start z-10 space-y-5 flex flex-col justify-end">
          <p className=" font-medium">Single</p>
          <h1 className=" text-8xl font-semibold">4X4</h1>
          <div className=" flex items-center text-sm font-medium space-x-2">
            <Image
              src={"/travis.jpg"}
              alt="ArtistCover"
              width={25}
              height={25}
              className="rounded-full"
            />
            <p>Travis Scott</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">•</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">2025</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">•</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">
              1 song
            </p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">•</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">3:45</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">•</p>
            <p className=" text-[#3c2428] brightness-[5] font-semibold">
              123 320 932
            </p>
          </div>
        </div>
      </div>
      <div className=" w-full flex justify-start items-center space-x-8 h-full p-7 max-h-[7rem] bg-gradient-to-t from-black/60 to-black/20">
        <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer size-[4rem] bg-white rounded-full flex items-center justify-center">
          <Play className=" text-black" fill="black" />
        </button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <Shuffle className=" text-white opacity-50" size={36} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={10}
              className="font-medium bg-black/50 text-white rounded-lg text-sm p-2 "
            >
              4X4: Shuffle
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
                <CirclePlus className=" text-white opacity-50" size={36} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={10}
              className="font-medium bg-black/50 text-white rounded-lg text-sm p-2 "
            >
              Add to Library
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <Ellipsis className=" text-white opacity-50" size={36} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" bg-black/30 text-white rounded-xl text-sm font-medium">
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
                  className="  bg-black/30 text-white rounded-xl text-sm font-medium"
                >
                  <DropdownMenuItem className=" hover:!bg-white/0 pr-14 rounded-lg w-full items-center space-x-2">
                    <Input className=" w-fu rounded-lg" placeholder="Search" />
                  </DropdownMenuItem>
                  <DropdownMenuItem className=" hover:!bg-white/10 pr-14 rounded-lg items-center space-x-2">
                    <div className=" flex min-w-[8rem] space-x-2 items-center ">
                      <Plus className=" text-white" size={18} />
                      <p>Create Playlist</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className=" bg-white/10" />
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
                  </DropdownMenuItem>
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
      </div>
      <div className=" w-full h-full bg-black/60 "></div>
    </div>
  );
}
