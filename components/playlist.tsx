'use client';

import Image from "next/image"
import { useRouter } from "next/navigation";
import { useCurrentSongStore } from "@/store/current-song";
import { motion } from "framer-motion";
import { useState } from "react";
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

export default function Playlist({ title, url, type, id, songs, artistUsername }: { title?: string, url?: string, type?: string, id?: number, songs?: { id: number }[], artistUsername?: string }) {
    const router = useRouter();
    const handleClick = () => {
        router.push(
            `/${type === "album" || type === "ep" ? "album" : type === "song" ? "song" : "profile"
            }/${id}`
        );
    };
    const setCurrentSongID = useCurrentSongStore((state) => state.setCurrentSongID);
    const [isHover, setIsHover] = useState(false);
    const currentSongID = useCurrentSongStore((state) => state.currentSongID);
    const action = useCurrentSongStore((state) => state.action);
    const isLoading = useCurrentSongStore((state) => state.isLoading);
    const setAction = useCurrentSongStore((state) => state.setAction);
    return (
        <main onClick={() => handleClick()} onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)} className="flex gap-x-2 items-center lg:justify-start justify-center lg:p-2 transition-colors rounded-2xl hover:bg-white/3 h-full w-full">
            <Image
                src={url || '/slabiak2.jpg'}
                alt={title || 'Playlist Cover'}
                width={200}
                unoptimized
                height={200}
                className="rounded-lg size-[3rem] object-cover"
            />
            {(isLoading && songs && songs.some((song) => song.id.toString() === currentSongID.url)) ? (
                <div className="flex items-center justify-center bottom-0 right-4 top-0 my-auto shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/50 absolute size-[3rem] bg-white rounded-full">
                    <LoaderCircle className="text-black animate-spin stroke-3 stroke-black" size={25} />
                </div>
            ) : (
                <button onClick={(e) => {
                    e.stopPropagation();
                    if (type !== "profile") {
                        if (songs && songs.some((song) => song.id.toString() === currentSongID.url)) {
                            if (action === "Play") {
                                setAction("Pause");
                            } else {
                                setAction("Play");
                            }
                        } else {
                            setAction("Play");
                            setCurrentSongID(songs ? songs[0].id.toString() : '', true);
                        }
                    }
                }} className={`bg-white rounded-full cursor-pointer shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/50 size-[3rem] absolute bottom-0 right-4 top-0 my-auto transition-all flex items-center justify-center ${songs && songs.some((song) => song.id.toString() === currentSongID.url) ? ' translate-y-0 ' : 'group-hover:translate-y-0  opacity-0 group-hover:opacity-100'}`}>
                    {songs && songs.some((song) => song.id.toString() === currentSongID.url) ? (
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
            <div className=" lg:block hidden">
                <h1 className="text-white font-bold">{title || 'Title'}</h1>
                <p className="text-zinc-500 text-xs font-semibold">{artistUsername || 'Artist'} • {type && type?.charAt(0).toUpperCase() + type?.slice(1, type.length) || 'Type'}</p>
            </div>
        </main>
    )
}
