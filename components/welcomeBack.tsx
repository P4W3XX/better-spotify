import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCurrentSongStore } from "@/store/current-song";

import { LoaderCircle, Pause, Play } from "lucide-react";

const PlayAnimation = ({ isPlaying }: { isPlaying: boolean }) => {
  if (!isPlaying) return null;
  return (
    <div className=" flex space-x-1 group-hover:hidden items-center justify-center">
      <motion.div
        initial={{ scaleY: 0.4 }}
        animate={{
          scaleY: isPlaying ? 1 : 0.4,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        className="w-[5px] h-[20px] origin-center rounded-full bg-black"
      />
      <motion.div
        initial={{ scaleY: 0.4 }}
        animate={{
          scaleY: isPlaying ? 1 : 0.4,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          },
        }}
        className="w-[5px] h-[20px] origin-center rounded-full bg-black"
      />
      <motion.div
        initial={{ scaleY: 0.4 }}
        animate={{
          scaleY: isPlaying ? 1 : 0.4,
          transition: {
            duration: 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        className="w-[5px] h-[20px] origin-center rounded-full bg-black"
      />
    </div>
  );
};


export default function WelcomeBack({ title, url, type, id, setHover, theme, songs }: { title?: string, url?: string, type?: string, id?: number, setHover: (hover: string) => void, theme?: string, songs: { id: number }[] }) {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const handleClick = () => {
    router.push(
      `/${type === "album" || type === "ep" ? "album" : type === "song" ? "song" : "profile"
      }/${id}`
    );
  };
  const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const action = useCurrentSongStore((state) => state.action);
  const isLoading = useCurrentSongStore((state) => state.isLoading);
  const setAction = useCurrentSongStore((state) => state.setAction);
  return (
    <div onClick={() => handleClick()}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseOver={() => setHover(theme ? theme : "#404040")}
      onMouseOut={() => setHover("#404040")} className="flex relative group gap-y-2 flex-1 w-full h-full max-h-[7rem] hover:bg-white/7 transition-colors bg-white/5 items-center gap-x-3 rounded-md">
      <Image
        src={url || "/cover.jpg"}
        alt={title || "Welcome Back"}
        unoptimized
        priority
        width={100}
        height={100}
        className="rounded-l-md size-[5rem]"
      />
      <h1 className="text-xl font-semibold text-white">{title || "Welcome Back"}</h1>
      {(isLoading && songs.some((song) => song.id.toString() === currentSongID)) ? (
        <div className="flex items-center justify-center bottom-0 right-4 top-0 my-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/50 absolute size-[3rem] bg-white rounded-full">
          <LoaderCircle className="text-black animate-spin stroke-3 stroke-black" size={25} />
        </div>
      ) : (
        <button onClick={(e) => {
          e.stopPropagation();
          if (type !== "profile") {
            if (songs.some((song) => song.id.toString() === currentSongID)) {
              if (action === "Play") {
                setAction("Pause");
              } else {
                setAction("Play");
              }
            } else {
              setAction("Play");
              setCurrentSongID(songs[0].id.toString());
            }
          }
        }} className={`bg-white rounded-full cursor-pointer shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/50 size-[3rem] absolute bottom-0 right-4 top-0 my-auto transition-all flex items-center justify-center ${songs.some((song) => song.id.toString() === currentSongID) ? ' translate-y-0 ' : 'group-hover:translate-y-0  opacity-0 group-hover:opacity-100'}`}>
          {songs.some((song) => song.id.toString() === currentSongID) ? (
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
      )}
    </div>
  );
}