'use client'

import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PopularCover from "@/components/popular-cover";
import { SongPreview } from "@/components/song-preview";
import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import BestResult from "@/components/best-result";
import TopSongs from "@/components/top-songs";

interface SearchResultsProps {
    results: { id: string, image: string, title: string, data_type: string, artist: number, username: string, songs: [{ id: number }], plays: number, duration: string, feats: [] }[];
    count: number;
}

export default function SearchPage() {
    const [search, setSearch] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showLastSearches, setShowLastSearches] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResultsProps>({ results: [], count: 0 });

    const mobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isSearching) {
            setTimeout(() => {
                setShowLastSearches(true);
            }, 300);
        } else {
            setShowLastSearches(false);
        }
    }, [isSearching]);


    useEffect(() => {
        if (search.length > 0) {
            const fetchSearchResults = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/search/?q=${search}`);
                    console.log(response.data.results);
                    // Map through results to extract only the needed properties
                    setSearchResults({
                        results: response.data.results.map((item: {
                            id: string;
                            image: string;
                            title: string;
                            data_type: string;
                            artist: number;
                            username: string;
                            songs?: [{ id: number }];
                            plays?: number;
                            duration?: string;
                            feats?: [];

                        }) => ({
                            id: item.id,
                            image: item.image,
                            title: item.title,
                            data_type: item.data_type,
                            artist: item.artist,
                            username: item.username,
                            songs: item.songs,
                            plays: item.plays,
                            duration: item.duration,
                            feats: item.feats,
                        })),
                        count: response.data.count,
                    });
                    console.log(searchResults);
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            };
            fetchSearchResults();
        }
    }, [search]);

    if (!isMounted) return null;



    return (
        <main style={{
            overflowY: isSearching ? "hidden" : "auto",
        }} className="w-full pb-[7rem] px-5 relative h-svh">
            <motion.div initial={false} animate={{
                opacity: isSearching && search.length === 0 ? 1 : 0,
                pointerEvents: isSearching && search.length === 0 ? "all" : "none",
            }} className=" w-svw h-svh absolute left-0 bg-black/80 top-0 z-[99]" />
            <div className="w-full h-[3rem] sticky py-10 items-center bg-background justify-center flex z-[999] top-0">
                {mobile && (<motion.button initial={false} animate={{
                    x: isSearching ? 0 : -100,
                    width: isSearching ? "50px" : "0px",
                    marginLeft: isSearching ? "1.25rem" : "0px",
                    opacity: isSearching ? 1 : 0,
                }} transition={{
                    ease: "easeInOut",
                }} className=" font-medium  hover:bg-zinc-800/80 z-[100] h-[40px] rounded-xl cursor-pointer flex items-center justify-center">
                    <ArrowLeft size={25} className=" min-w-[25px] stroke-3" onClick={() => setIsSearching(false)} />
                </motion.button>)
                }
                <div className=" relative w-full h-full flex items-center justify-center">
                    <Input
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setIsSearching(false)}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-[3rem] font-medium !bg-background z-[102] pl-10 rounded-2xl"
                    />
                    <motion.div initial={false} animate={{
                        scaleY: isSearching && search.length === 0 ? 1 : 0,
                        opacity: isSearching && search.length === 0 ? 1 : 0,
                    }} transition={{
                        ease: "easeInOut",
                        delay: isSearching && search.length === 0 ? 0.2 : 0,
                    }} className=" w-full h-[27.5rem] pt-10 border origin-top bg-zinc-950 rounded-b-3xl z-[101] absolute top-0">
                        <div className=" flex w-full items-center px-6 justify-between">
                            <h1 className=" font-semibold text-xl">
                                Lastest Searches
                            </h1>
                            <Button variant={"ghost"} className=" rounded-lg text-white/50 text-base">
                                Reset
                            </Button>
                        </div>
                        <div className=" mt-2 px-4 flex flex-col gap-y-1">
                            {showLastSearches && (
                                <>
                                    <SongPreview index={0} isDuration={false} isPlays={false} feats={[]} id="1" isIndex={false} isCover title="4x4" artist="Travis Scott" duration="0" plays={0} />
                                    <SongPreview index={0} isDuration={false} isPlays={false} feats={[]} id="1" isIndex={false} isCover title="4x4" artist="Travis Scott" duration="0" plays={0} />
                                    <SongPreview index={0} isDuration={false} isPlays={false} feats={[]} id="1" isIndex={false} isCover title="4x4" artist="Travis Scott" duration="0" plays={0} />
                                    <SongPreview index={0} isDuration={false} isPlays={false} feats={[]} id="1" isIndex={false} isCover title="4x4" artist="Travis Scott" duration="0" plays={0} />
                                    <SongPreview index={0} isDuration={false} isPlays={false} feats={[]} id="1" isIndex={false} isCover title="4x4" artist="Travis Scott" duration="0" plays={0} />
                                </>
                            )}
                        </div>
                    </motion.div>
                    <div className="flex items-center px-3 absolute z-[103] gap-x-2 left-0 font-medium pointer-events-none w-full top-0 bottom-0 my-auto h-max">
                        <Search size={20} className="opacity-40 min-w-[20px] stroke-3" />
                        <motion.p
                            animate={{
                                opacity: search.length > 0 ? 0 : 1,
                                y: search.length > 0 ? -10 : 0,
                            }}
                            className="text-white/40 truncate"
                        >
                            Search music, artists, albums, and playlists.
                        </motion.p>
                    </div>
                </div>
                {!mobile && (
                    <motion.button initial={false} animate={{
                        x: isSearching ? 0 : 100,
                        width: isSearching ? "100px" : "0px",
                        paddingLeft: isSearching ? "1rem" : "0px",
                        paddingRight: isSearching ? "1rem" : "0px",
                        marginLeft: isSearching ? "1.25rem" : "0px",
                        opacity: isSearching ? 1 : 0,
                    }} transition={{
                        ease: "easeInOut",
                    }} className=" font-medium  hover:bg-zinc-800/80 z-[100] rounded-xl h-[3rem] cursor-pointer flex items-center justify-center">
                        Cancle
                    </motion.button>
                )}
            </div>
            <AnimatePresence mode="wait">
                {search.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full mt-6 grid  grid-cols-2 z-0 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
                        <PopularCover title="RAP" artist="travis" />
                        <PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" /><PopularCover title="R&B" artist="sza" />
                        <PopularCover title="TRAP" artist="carti" />
                        <PopularCover title="DISCO POLO" artist="zenek" />
                    </motion.div>
                )}
                {search.length > 0 && (
                    <motion.div>
                        <div className=" w-full flex h-[20rem] gap-10">
                            <BestResult type={searchResults.results?.[0]?.data_type || 'album'} title={searchResults.results?.[0]?.title} username={searchResults.results?.[0]?.username} artistId={searchResults.results?.[0]?.artist} cover={searchResults.results?.[0]?.image} songs={searchResults.results?.[0]?.songs} />
                            <TopSongs songs={searchResults.results
                                .filter((song) => song.data_type === 'song')
                                .map(song => ({
                                    id: song.id,
                                    feats: song.feats || [],
                                    title: song.title,
                                    plays: song.plays || 0,
                                    duration: song.duration || '',
                                    artist: typeof song.artist === 'number' ? song.artist : 0,
                                    username: song.username
                                }))}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main >
    );
}