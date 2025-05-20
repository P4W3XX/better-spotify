'use client'

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentSongStore } from "@/store/current-song";
import { useState } from "react";
import { useRouter } from "next/navigation";

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


export default function BestResult({ type, songs, title, artistId, username, cover, is_indecent, artistName, id }: { type: string, songs?: [{ id: number }], title: string, artistId: number, username?: string, cover: string, is_indecent?: boolean, artistName?: string, id?: string }) {

    const currentSongID = useCurrentSongStore((state) => state.currentSongID);
    const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
    const action = useCurrentSongStore((state) => state.action);
    const setAction = useCurrentSongStore((state) => state.setAction);
    const [isHover, setIsHover] = useState(false);
    const router = useRouter();

    return (
        <div className=" w-full flex flex-1 max-w-[25rem] rounded-2xl gap-y-2 h-full flex-col">
            <h1 className=" text-2xl font-semibold">
                Best result
            </h1>
            <div onClick={() => {
                if (type === "artist") {
                    router.push(`/profile/${artistId}`);
                } else if (type === "album" || type === "ep") {
                    router.push(`/album/${id}`);
                }
            }} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className=" w-full h-full relative flex items-center justify-start group px-5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl">
                <div className=" flex flex-col items-start justify-center gap-y-3">
                    {
                        cover ? (
                            <Image
                                src={cover}
                                alt=""
                                unoptimized
                                width={200}
                                height={200}
                                className=" size-[10rem] rounded-2xl"
                            />
                        ) : (
                            <Image
                                src={"/albumPlaceholder.svg"}
                                alt=""
                                width={200}
                                height={200}
                                className=" size-[10rem] rounded-2xl"
                            />
                        )}
                    {
                        <div className=" flex items-center gap-x-1">
                            {is_indecent && (
                                <div className=" size-8 min-w-[16px] flex items-center text-lg justify-center rounded-sm bg-white/30 font-medium mr-1">E</div>
                            )}
                            <h1 className=" text-4xl font-semibold">
                                {type === "artist" ? username : title}
                            </h1>
                        </div>
                    }
                    {
                        <div className=" flex items-center text-xs gap-x-2">
                            <p className=" text-white/50 font-medium">
                                {type.slice(0, 1).toUpperCase() + type.slice(1)}
                            </p>
                            {type !== "artist" && (
                                <>
                                    <p className=" text-white/50 font-medium">
                                        •
                                    </p>
                                    <p className="font-medium">
                                        {artistName || ''}
                                    </p>
                                </>
                            )}
                        </div>
                    }
                </div>
                <button onClick={(e) => {
                    e.stopPropagation();
                    if (type !== "profile") {
                        if (songs?.some((song) => song.id.toString() === currentSongID)) {
                            if (action === "Play") {
                                setAction("Pause");
                            } else {
                                setAction("Play");
                            }
                        } else {
                            setAction("Play");
                            if (songs && songs.length > 0) {
                                setCurrentSongID(songs[0].id.toString());
                            }
                        }
                    }
                }} className={`bg-white rounded-full cursor-pointer shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/50 size-[3rem] absolute bottom-6 right-6 transition-all flex items-center justify-center ${songs?.some((song) => song.id.toString() === currentSongID) ? ' translate-y-0 ' : 'group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100'}`}>
                    {songs?.some((song) => song.id.toString() === currentSongID) ? (
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
            </div>
        </div>
    )
}