import { ArrowBigLeft, ArrowBigRight, Play } from "lucide-react";
import Image from "next/image";

export default function PlayBar() {
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
}
