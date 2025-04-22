'use client'

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import PopularCover from "@/components/popular-cover";
import { SongPreview } from "@/components/song-preview";

export default function SearchPage() {
    const [search, setSearch] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    return (
        <main style={{
            overflowY: isSearching ? "hidden" : "auto",
        }} className="w-full p-5 pb-[7rem] relative h-svh">
            <div className="w-full h-[3rem] relative bg-black z-[999]">
                <Input
                    onFocus={() => setIsSearching(true)}
                    onBlur={() => setIsSearching(false)}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-full font-medium pl-11 z-[100] rounded-2xl absolute top-0 left-0"
                />
                <div className="flex items-center absolute z-[100] gap-x-2 left-0 p-3 font-medium pointer-events-none w-full top-0 bottom-0 my-auto h-max">
                    <Search className="opacity-40" />
                    <motion.p
                        animate={{
                            opacity: search.length > 0 ? 0 : 1,
                            y: search.length > 0 ? -10 : 0,
                        }}
                        className="text-white/40"
                    >
                        Search music, artists, albums, and playlists.
                    </motion.p>
                </div>
            </div>
            <div className="w-full mt-6 grid grid-cols-2 z-0 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
                <PopularCover title="RAP" artist="travis" />
                <PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" />
                <PopularCover title="TRAP" artist="carti" />
                <PopularCover title="DISCO POLO" artist="zenek" />
            </div>
            <motion.div initial={false} animate={{
                opacity: isSearching ? 1 : 0,
                pointerEvents: isSearching ? "all" : "none",
            }} className=" w-full h-full left-0 absolute mb-[8rem] px-5 top-[5.5rem] bg-black/50 z-0 rounded-3xl">
                <motion.div initial={false} animate={{
                    opacity: isSearching ? 1 : 0,
                    scale: isSearching ? 1 : 0.9,
                }} transition={{
                    ease: "easeInOut",
                }} className=" w-full h-1/2 origin-top pt-4 px-5 bg-black border border-zinc-800 rounded-3xl">
                    <p className=" text-white font-semibold text-xl">
                        Lastest searches
                    </p>
                    <div className="w-full h-full ">
                        <SongPreview index={0} title="Song Title" artist="Artist Name" feats={[]} plays={1000} duration="3:45" isCover={true} id="1" />
                    </div>
                </motion.div>
            </motion.div>
        </main>
    );
}