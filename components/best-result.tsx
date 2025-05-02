'use client'

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrentSongStore } from "@/store/current-song";
import { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "./ui/skeleton";

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


export default function BestResult({ type, songs, title, artistId, username, cover }: { type: string, songs?: [{ id: number }], title: string, artistId: number, username?: string, cover: string }) {

    const currentSongID = useCurrentSongStore((state) => state.currentSongID);
    const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
    const action = useCurrentSongStore((state) => state.action);
    const setAction = useCurrentSongStore((state) => state.setAction);
    const [isLoading, setIsLoading] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [artistName, setArtistName] = useState<string>('');

    useEffect(() => {
        if (artistId) {
            setIsLoading(true);
            axios.get(`http://127.0.0.1:8000/api/artists/${artistId}/`)
                .then((res) => {
                    setArtistName(res.data.username);
                    console.log(res.data.username);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [artistId]);
    return (
        <div className=" w-full flex flex-1 max-w-[25rem] rounded-2xl gap-y-2 h-full flex-col">
            <h1 className=" text-2xl font-semibold">
                Best result
            </h1>
            <div onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className=" w-full h-full relative flex items-center justify-start group px-5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl">
                <div className=" flex flex-col items-start justify-center gap-y-3">
                    {isLoading ? (
                        <Skeleton className=" w-[10rem] h-[10rem] rounded-2xl" />
                    ) : (
                        cover ? (
                            <Image
                                src={cover}
                                alt=""
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
                        ))}
                    {isLoading ? (
                        <Skeleton className=" w-[6rem] h-[1.5rem] rounded-2xl" />
                    ) : (
                        <h1 className=" text-4xl font-semibold">
                            {type === "artist" ? username : title}
                        </h1>)}
                    {isLoading ? (
                        <Skeleton className=" w-[8rem] h-[1rem] rounded-2xl" />
                    ) : (
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
                                        {artistName}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
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