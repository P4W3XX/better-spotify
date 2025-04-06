"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./skeleton";

export default function ItemCover({
  title = "4x4",
  artist = "Travis Scott",
  cover = "/cover.jpg",
  type = "album",
  id = 1,
}: {
  title?: string;
  artist?: string;
  cover?: string;
  id?: number;
  type?: string;
}) {
  const router = useRouter();
  const handleClick = () => {
    router.push(
      `/${
        type === "album" ? "album" : type === "song" ? "song" : "profile"
      }/${id}`
    ); // zamien na id albumu
  };
  return (
    <div
      onClick={() => handleClick()}
      className=" flex flex-col w-max items-start space-y-2 relative group hover:bg-white/8 cursor-pointer transition-all rounded-2xl p-3"
    >
      <div className=" relative size-[10rem]">
        {cover ? (
          <Image
            src={cover}
            alt="Cover"
            width={160}
            height={160}
            className={` ${
              type === "profile" ? "rounded-full" : "rounded-lg"
            } w-full h-full`}
          />
        ) : (
          <Skeleton className=" w-full h-full" />
        )}
        <div className=" bg-white rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black size-[3rem] absolute translate-y-4 group-hover:translate-y-0 bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
          <Play className=" text-black" fill="black" size={20} />
        </div>
      </div>
      <div
        className={` w-full flex flex-col justify-start ${
          type === "profile" ? "items-center" : "items-start"
        }`}
      >
        {title ? (
          <h1 className=" text-2xl font-semibold">{title}</h1>
        ) : (
          <Skeleton className=" w-1/2 mb-2 h-[24px]" />
        )}
        {type !== "profile" &&
          (artist ? (
            <p
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${artist}`);
              }}
              className=" text-white/50 text-sm w-max cursor-pointer group-hover:text-white transition-colors font-medium hover:underline"
            >
              {artist}
            </p>
          ) : (
            <Skeleton className=" w-1/2 h-[20px]" />
          ))}

        {type !== "profile" &&
          (type ? (
            <p className=" text-white/50 text-sm w-max cursor-pointer group-hover:text-white transition-colors font-medium">
              {type.slice(0, 1).toUpperCase() + type.slice(1)}
            </p>
          ) : (
            <Skeleton className=" w-1/2 h-[20px]" />
          ))}
      </div>
    </div>
  );
}
