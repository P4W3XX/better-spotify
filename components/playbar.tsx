"use client";

import {
  ArrowBigLeft,
  ArrowBigRight,
  Play,
  Repeat,
  Shuffle,
} from "lucide-react";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { CirclePlus } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function PlayBar() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <main className=" fixed z-50 bottom-[4rem] w-full right-0 left-0 mx-auto h-[6rem] pb-[.5rem] items-end flex bg-gradient-to-t from-black ">
        <div className=" w-[95%] left-0 right-0 items-center justify-between px-[6px] flex mx-auto bg-[#3c2428] h-[4rem] rounded-2xl">
          <div className=" flex items-center justify-start w-full h-full gap-x-2">
            <Image
              className=" rounded-xl h-[80%] size-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
              src="/cover.jpg"
              alt="cover"
              width={100}
              height={100}
              priority
            />
            <div>
              <h1 className=" font-semibold text-lg">4X4</h1>
              <p className=" text-white/50 text-[10px] w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
                Travis Scott
              </p>
            </div>
          </div>
          <div className=" flex items-center justify-end w-full gap-x-2 h-full">
            <button>
              <ArrowBigLeft className="" fill="white" size={28} />
            </button>
            <button>
              <Play className="" fill="white" size={34} />
            </button>
            <button>
              <ArrowBigRight className="" fill="white" size={28} />
            </button>
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main className=" w-full fixed bottom-0 p-2 justify-between z-[51] border-t items-center flex h-[6rem] bg-black">
        <div className=" flex items-center gap-x-2">
          <Image
            className=" rounded-xl size-[4.5rem] shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
            src="/cover.jpg"
            alt="cover"
            width={100}
            height={100}
            priority
          />
          <div>
            <h1 className=" font-semibold text-2xl">4X4</h1>
            <p className=" text-white/50 text-sm w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline">
              Travis Scott
            </p>
          </div>
          <button className=" hover:scale-105 ml-5 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
            <CirclePlus className=" text-white md:size-[28px] size-[24px] opacity-50" />
          </button>
        </div>
        <div className=" flex flex-col items-center h-full justify-between w-full py-2 max-w-[30%]">
          <div className=" flex gap-x-5">
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <Shuffle className=" text-white md:size-[20px] opacity-60 size-[24px]" />
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <ArrowBigLeft
                fill="white"
                className=" text-white md:size-[28px] opacity-60 size-[24px]"
              />
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <Play
                fill="white"
                className=" text-white md:size-[36px] size-[24px]"
              />
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <ArrowBigRight
                fill="white"
                className=" text-white md:size-[28px] opacity-60 size-[24px]"
              />
            </button>
            <button className=" hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-full flex items-center justify-center">
              <Repeat className=" text-white md:size-[20px] opacity-60 size-[24px]" />
            </button>
          </div>
          <div className=" flex w-full gap-x-2 items-center">
            <p className=" text-xs text-white/50 font-medium">0:00</p>
            <Slider
              className=""
              defaultValue={[50]}
              step={1}
              min={0}
              max={100}
            />
            <p className=" text-xs text-white/50 font-medium">3:45</p>
          </div>
        </div>
        <div>dwddw</div>
      </main>
    );
  }
}
