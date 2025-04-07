"use client";
import Image from "next/image";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemCover({
  title = "4x4",
  artistID,
  cover = "/cover.jpg",
  type = "album",
  id = 1,
}: {
  title?: string;
  artistID?: string;
  cover?: string;
  id?: number;
  type?: string;
}) {
  const router = useRouter();
  const [artistName, setArtistName] = useState<string>("");
  const handleClick = () => {
    router.push(
      `/${type === "album" ? "album" : type === "song" ? "song" : "profile"
      }/${id}`
    );
  };

  useEffect(() => {
    const fetchArtistName = async () => {
      if (!artistID) return;
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/artists/${artistID}/`);
        setArtistName(res.data.name);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    };
    fetchArtistName();
  }, [artistID]);

  return (
    <div
      onClick={() => handleClick()}
      className="flex flex-col w-full h-full items-center space-y-2 relative group hover:bg-white/8 cursor-pointer transition-all rounded-2xl p-2"
    >
      <div className="relative w-full aspect-square">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 23vw, 18vw"
            className={`${type === "profile" ? "rounded-full" : "rounded-lg"
              } object-cover`}
          />
        ) : (
          <Skeleton className="w-full h-full rounded-lg" />
        )}
        <div className="bg-white rounded-full shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black size-[3rem] absolute translate-y-4 group-hover:translate-y-0 bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
          <Play className="text-black" fill="black" size={20} />
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-start">
        {title ? (
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold truncate w-full">
            {title}
          </h1>
        ) : (
          <Skeleton className="w-1/2 mb-2 h-[24px]" />
        )}
        {type !== "profile" &&
          (artistName ? (
            <p
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile/${artistID}`);
              }}
              className="text-white/50 text-xs sm:text-sm truncate w-full cursor-pointer group-hover:text-white transition-colors font-medium hover:underline"
            >
              {artistName}
            </p>
          ) : (
            <Skeleton className="w-1/2 h-[20px]" />
          ))}
        {type ? (
          <p className="text-white/50 text-xs sm:text-sm w-max cursor-pointer group-hover:text-white transition-colors font-medium">
            {type.slice(0, 1).toUpperCase() + type.slice(1)}
          </p>
        ) : (
          <Skeleton className="w-1/2 h-[20px]" />
        )}
      </div>
    </div>
  );
}