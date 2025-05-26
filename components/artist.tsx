"use client";
import { useCurrentSongStore } from "@/store/current-song";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause } from "lucide-react";
import { useState } from "react";
import { PlayAnimation } from "./item-cover";

export const Artist = ({
  id,
  name,
  cover,
  songs,
}: {
  id: number;
  name: string;
  cover: string;
  songs: Array<{ id: number }>;
}) => {
  const setCurrentSongID = useCurrentSongStore(
    (state) => state.setCurrentSongID
  );
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const action = useCurrentSongStore((state) => state.action);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      href={`/profile/${id}`}
      className="relative flex flex-col  w-[15rem] h-[18rem] rounded-lg shadow-lg hover:bg-[#1f1f1f] "
    >
      <div className="flex justify-center items-center">
        <Image
          src={cover || "/slabiak2.jpg"}
          alt={"cover"}
          width={100}
          height={100}
          className="rounded-full w-[14rem] h-[14rem] pt-2 object-cover object-center"
        />
      </div>
      <h1 className="font-serif text-xl text-start px-3">{name}</h1>
      <p className="px-3 text-[13px] font-medium text-zinc-400">Wykonawca</p>
      <button
        onClick={(e) => {
          e.preventDefault();
          if (
            Array.isArray(songs) &&
            songs.length > 0 &&
            songs[0]
          ) {
            if (
              currentSongID &&
              songs.some(
                (song: { id: number }) =>
                  song.id.toString() === currentSongID.url
              )
            ) {
              if (action === "Play") {
                setAction("Pause");
              } else {
                setAction("Play");
              }
            } else {
              setCurrentSongID(songs[0].id.toString(), true);
              setAction("Play");
            }
          }
        }}
        className={`hover:scale-105 active:scale-95 transition-all cursor-pointer md:size-[4rem] size-[3rem] bg-white rounded-full flex items-center justify-center ${
          isHover || songs.some((song) => song.id.toString() === currentSongID.url) ? "absolute bottom-14 right-4" : "hidden"
        } shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/50`}
      >
        {songs.some((song) => song.id.toString() === currentSongID.url) ? (
                      action === "Play" ? (
                        isHover ?
                          <Pause className="text-black" fill="black" size={20} />
                          : <PlayAnimation isPlaying={true} />
                      ) : (
                        <Play className="text-black" fill="black" size={20} />
                      )
                    ) : (
                      <Play className="text-black" fill="black" size={20} />
                    )}
      </button>
    </Link>
  );
};
