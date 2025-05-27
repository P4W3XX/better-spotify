'use client'

import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PopularCover from "@/components/popular-cover";

import { useMediaQuery } from "usehooks-ts";
import { useEffect } from "react";
import axios from 'axios';
import BestResult from "@/components/best-result";
import TopSongs from "@/components/top-songs";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
    results: { id: string, image: string, title: string, data_type: string, artist: number, artistName: string, username: string, songs: [{ id: number }], plays: number, duration: string, feats: [{ id: number, username: string }], is_indecent: boolean }[];
    count: number;
}

interface PopularCoverProps {
    genre: string;
    cover: string;
}


export default function SearchPage() {
    const [search, setSearch] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResultsProps>({ results: [], count: 0 });
    const [lastSearch, setLastSearch] = useState<string>(""); // Cache last search query
    const [popularCovers, setPopularCovers] = useState<PopularCoverProps[]>();

    const mobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        setIsMounted(true);
        const fetchPopularCovers = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/top-songs/`);
                console.log("Popular Covers: ", response.data);
                const data = response.data.map((item: { genre: string; cover: string }) => ({
                    genre: item.genre || "Unknown Genre",
                    cover: item.cover || "",
                }));
                setPopularCovers(data);
                console.log("Popular Covers: ", data);
            } catch (error) {
                console.error("Error fetching popular covers:", error);
                setPopularCovers([]); // Set to empty array on error to avoid undefined state
            }
        };
        fetchPopularCovers();
    }, []);


    useEffect(() => {
        if (search.length > 0 && search !== lastSearch) {
            console.log("searching for: ", search);
            const fetchSearchResults = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/search/?q=${search}`);
                    console.log(response.data.results);
                    setSearchResults({
                        results: response.data.results.map((item: {
                            id: string;
                            image: string;
                            title: string;
                            data_type: string;
                            artist: number;
                            artist_username: string;
                            username: string;
                            songs?: [{ id: number }];
                            plays?: number;
                            duration?: string;
                            feats?: [{ id: number; username: string }];
                            is_indecent?: boolean;
                            cover?: string;
                        }) => ({
                            id: item.id,
                            image: item.image || item.cover,
                            title: item.title,
                            data_type: item.data_type,
                            artistName: item.artist_username,
                            artist: item.artist,
                            username: item.username,
                            songs: item.songs,
                            is_indecent: item.is_indecent || false,
                            plays: item.plays,
                            duration: item.duration,
                            feats: item.feats,
                        })),
                        count: response.data.count,
                    });
                    setLastSearch(search); // Update last search query
                } catch (error) {
                    console.error("Error fetching search results:", error);
                }
            };
            fetchSearchResults();
        }
    }, [search, lastSearch]); // Add lastSearch as a dependency

    if (!isMounted) return null;

    return (
        <main style={{
            overflowY: isSearching || !popularCovers ? "hidden" : "auto",
        }} className="w-full md:h-[calc(100svh-6.5rem)] pt-[1.5rem] md:rounded-xl px-5 bg-background/75 relative h-svh overflow-x-hidden">
            <motion.div initial={{
                opacity: 0,
                y: -40,
            }} animate={{
                opacity: 1,
                y: 0,
            }} exit={{
                opacity: 0,
                y: -40,
            }} transition={{
                duration: 0.3,
                ease: "easeInOut",
            }} className="w-full h-[3rem] sticky py-10 items-center justify-center flex z-[999] top-0">
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
                        className="w-full h-[3rem] font-medium !bg-white/5 border-0 z-[102] pl-10 rounded-2xl"
                    />
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
                    }} className=" font-medium  hover:bg-zinc-800/80 z-[100] rounded-xl h-[3rem] cursor-pointer flex items-center justify-center" onClick={() => { setIsSearching(false); setSearch("") }}>
                        Cancel
                    </motion.button>
                )}
            </motion.div>
            <AnimatePresence mode="wait">
                {search.length === 0 && (
                    <motion.div transition={{
                        ease: "easeInOut",
                        duration: 0.3
                    }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full mt-6 grid  grid-cols-2 z-0 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
                        {popularCovers?.map((cover, index) => (
                            <PopularCover key={index} genre={cover.genre} cover={cover.cover} />
                        ))}
                        {!popularCovers && (
                            <>
                                <Skeleton className="w-full h-[20rem] rounded-3xl" />
                                <Skeleton className="w-full h-[20rem] rounded-3xl" /><Skeleton className="w-full h-[20rem] rounded-3xl" /><Skeleton className="w-full h-[20rem] rounded-3xl" /><Skeleton className="w-full h-[20rem] rounded-3xl" /><Skeleton className="w-full h-[20rem] rounded-3xl" /><Skeleton className="w-full h-[20rem] rounded-3xl" /><Skeleton className="w-full h-[20rem] rounded-3xl" />
                                <Skeleton className="w-full h-[20rem] rounded-3xl" /> <Skeleton className="w-full h-[20rem] rounded-3xl" /> <Skeleton className="w-full h-[20rem] rounded-3xl" /> <Skeleton className="w-full h-[20rem] rounded-3xl" />
                            </>
                        )}
                    </motion.div>
                )}
                {search.length > 0 && (
                    <motion.div>
                        <div className=" w-full flex h-[20rem] gap-10">
                            <BestResult artistName={searchResults.results?.[0]?.artistName} type={searchResults.results?.[0]?.data_type || 'album'} title={searchResults.results?.[0]?.title} is_indecent={searchResults.results?.[0]?.is_indecent} username={searchResults.results?.[0]?.username} artistId={searchResults.results?.[0]?.artist} cover={searchResults.results?.[0]?.image} songs={searchResults.results?.[0]?.songs} id={searchResults.results?.[0]?.id} />
                            <TopSongs songs={searchResults.results
                                .filter((song) => song.data_type === 'song')
                                .map(song => ({
                                    id: song.id,
                                    cover: song.image,
                                    is_indecent: song.is_indecent || false,
                                    feats: song.feats || [],
                                    title: song.title,
                                    artistName: song.artistName,
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