"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ItemCover() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/album/4x4");
  };
  return (
    <div
      onClick={() => handleClick()}
      className=" flex flex-col w-max items-start space-y-2 relative group hover:bg-white/8 cursor-pointer transition-all rounded-2xl p-3"
    >
      <div className=" relative size-[10rem]">
        <Image
          src={"/cover.jpg"}
          alt="Cover"
          width={160}
          height={160}
          className="rounded-lg w-full h-full"
        />
        <div className=" bg-white rounded-full size-[3rem] absolute translate-y-4 group-hover:translate-y-0 bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
          <Play className=" text-black" fill="black" size={20} />
        </div>
      </div>
      <div>
        <h1 className=" font-semibold text-2xl">4x4</h1>
        <p className=" text-white/40 text-sm font-medium">Travis Scott</p>
      </div>
    </div>
  );
}
