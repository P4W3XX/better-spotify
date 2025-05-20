"use client";
import ItemCover from "@/components/item-cover";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chip from "@/components/chip";
import { AnimatePresence, motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import WelcomeBack from "@/components/welcomeBack";


interface Item {
  id: number;
  title: string;
  artist: string;
  artistID: string;
  cover: string;
  songs: { id: number }[];
  type: string;
  theme: string;
}

interface mappedItems {
  id: number;
  title: string;
  artist_username: string;
  artist: string;
  image: string;
  theme: string;
  album_type: string;
  type: string;
  songs: { id: number }[];
}

export default function Home() {
  const [Items, setItems] = useState<Item[]>([]);
  const [backgroundTheme, setBackgroundTheme] = useState<string>("");
  const [filter, setFilter] = useState<'All' | 'Artists' | 'Albums' | 'Songs' | 'Ep'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://127.0.0.1:8000/api/albums/").then((res) => res.data).catch((err) => {
          console.log(err);
        })
        console.log("res", res);
        const mappedItems = res.map((item: mappedItems) => ({
          id: item.id,
          title: item.title,
          artist: item.artist_username,
          theme: item.theme,
          cover: item.image,
          artistID: item.artist,
          songs: item.songs,
          type: item.type || item.album_type
        }));
        console.log(mappedItems);
        setIsLoading(false);
        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setIsScrolling(false);
    const handleScroll = () => {
      const scrollTop = mainRef?.current?.scrollTop;
      if (scrollTop && scrollTop > 0) {
        console.log("scrolling");
        setIsScrolling(true);
      } else {
        console.log("not scrolling");
        setIsScrolling(false);
      }
    };

    mainRef?.current?.addEventListener("scroll", handleScroll);

    return () => {
      mainRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const hexToRGBA = (hex = "", alpha = 1) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleFilter = (title: string) => {
    if (title === filter) {
      setFilter('All');
    } else {
      setFilter(title as 'All' | 'Artists' | 'Albums' | 'Songs' | 'Ep');
    }
  };


  return (
    <motion.div
      ref={mainRef}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backgroundImage: `linear-gradient(to bottom, ${hexToRGBA(backgroundTheme || "#404040", .75)} 0%, ${hexToRGBA("#171717", .75)} 30%)`,
      }}
      style={{
        overflow: isLoading ? "hidden" : "auto",
      }}
      layout="position"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className=" relative w-full md:h-[calc(100svh-6.5rem)] h-svh md:rounded-xl"
    >
      <div style={{
        backdropFilter: !isScrolling ? "blur(0px)" : "blur(15px)",
        backgroundColor: !isScrolling ? "transparent" : hexToRGBA("#404040", .4),
      }} className="flex items-center w-full sticky p-4 z-30 sm:p-6 md:p-8 lg:p-6 top-0 gap-x-3 mb-5">
        <Chip title="All" onClick={(title) => { handleFilter(title) }} active={filter || ''} />
        <Chip title="Albums" onClick={(title) => { handleFilter(title) }} active={filter || ''} />
        <Chip title="Songs" onClick={(title) => { handleFilter(title) }} active={filter || ''} />
        <Chip title="Ep" onClick={(title) => { handleFilter(title) }} active={filter || ''} />
        <Chip title="Artists" onClick={(title) => { handleFilter(title) }} active={filter || ''} />
      </div>
      <AnimatePresence mode="wait">
        {filter === 'All' && (
          <motion.div
            key="MainPage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className=" flex flex-col w-full px-4 sm:px-6 md:px-8 lg:px-6 h-full gap-y-20"
          >
            <motion.div className=" w-full flex flex-col">
              <div className="w-full grid grid-cols-2 gap-5">
                {isLoading ? (
                  Array(4).fill(0).map((_, index) => (
                    <Skeleton key={index} className="w-full h-[5rem] rounded-lg bg-white/10" />
                  ))
                ) : (
                  Items.slice(0, 10).map((item, index) => (
                    <WelcomeBack key={index} setHover={setBackgroundTheme} title={item.title} theme={item.theme} url={item.cover} type={item.type} songs={item.songs} id={item.id} />
                  ))
                )
                }
              </div>
            </motion.div>
            <motion.div layoutId="Albums" className=" w-full flex flex-col">
              <div className="w-full flex items-center justify-between h-min">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold z-20 ">Albums</h1>
                <button
                  onClick={() => setFilter('Albums')}
                  className="font-semibold text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  See more
                </button>
              </div>
              <Carousel opts={{ align: "start" }} className="w-full mt-3">
                <CarouselContent>
                  {isLoading ? (
                    Array(10).fill(0).map((_, index) => (
                      <CarouselItem key={index} className="2xl:basis-1/7 xl:basis-1/5 md:basis-1/4 basis-1/3">
                        <div className="flex flex-col gap-2 md:p-3 p-2">
                          <Skeleton className="w-full aspect-square rounded-lg bg-white/10" />
                          <Skeleton className="w-2/3 h-7 rounded-md bg-white/10" />
                          <Skeleton className="w-1/2 h-3.5 rounded-md bg-white/10" />
                          <Skeleton className="w-1/3 h-3.5 rounded-md bg-white/10" />
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    Items.filter((item) => (item.type === 'album')).slice(0, 10).map((item) => (
                      <CarouselItem key={item.id} className="2xl:basis-1/7 xl:basis-1/5 md:basis-1/4 basis-1/3  ">
                        <ItemCover
                          setHover={setBackgroundTheme}
                          title={item.title}
                          artist={item.artist}
                          artistID={item.artist}
                          cover={item.cover}
                          theme={item.theme}
                          type={item.type}
                          songs={item.songs}
                          id={item.id}
                        />
                      </CarouselItem>
                    )))
                  }
                </CarouselContent>
              </Carousel>
            </motion.div>
            <motion.div initial={{
              opacity: 0,
            }} animate={{
              opacity: 1,
            }} exit={{
              opacity: 1,
            }} layoutId="Ep" className=" w-full flex flex-col pb-8">
              <div className="w-full flex items-center justify-between h-min">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold z-20 ">Ep</h1>
                <button
                  onClick={() => setFilter('Ep')}
                  className="font-semibold text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  See more
                </button>
              </div>
              <Carousel opts={{ align: "start" }} className="w-full mt-3">
                <CarouselContent>
                  {isLoading ? (
                    Array(10).fill(0).map((_, index) => (
                      <CarouselItem key={index} className="2xl:basis-1/7 xl:basis-1/5 md:basis-1/4 basis-1/3">
                        <div className="flex flex-col gap-2 md:p-3 p-2">
                          <Skeleton className="w-full aspect-square rounded-lg bg-white/10" />
                          <Skeleton className="w-2/3 h-7 rounded-md bg-white/10" />
                          <Skeleton className="w-1/2 h-3.5 rounded-md bg-white/10" />
                          <Skeleton className="w-1/3 h-3.5 rounded-md bg-white/10" />
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    Items.filter((item) => (item.type === 'ep')).slice(0, 10).map((item) => (
                      <CarouselItem key={item.id} className="2xl:basis-1/7 xl:basis-1/5 md:basis-1/4 basis-1/3">
                        <ItemCover
                          setHover={setBackgroundTheme}
                          title={item.title}
                          artist={item.artist}
                          artistID={item.artist}
                          cover={item.cover}
                          theme={item.theme}
                          type={item.type}
                          songs={item.songs}
                          id={item.id}
                        />
                      </CarouselItem>
                    )))
                  }
                </CarouselContent>
              </Carousel>
            </motion.div>
          </motion.div>
        )}
        {filter !== 'All' && (
          <motion.div>
            {(() => {
              const filterValue = filter as 'All' | 'Artists' | 'Albums' | 'Songs' | 'Ep';
              let typeFilter = filterValue.toLowerCase();
              if (typeFilter.endsWith('s')) {
                typeFilter = typeFilter.slice(0, -1);
              }
              const filteredItems = Items.filter(item =>
                item.type === typeFilter
              );

              if (filteredItems.length > 0) {
                return (
                  <div className="grid grid-cols-2 p-4 sm:p-6 md:p-8 lg:p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 space-x-4 mt-6">
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ItemCover
                          setHover={setBackgroundTheme}
                          title={item.title}
                          artist={item.artist}
                          artistID={item.artist}
                          cover={item.cover}
                          theme={item.theme}
                          type={item.type}
                          songs={item.songs}
                          id={item.id}
                        />
                      </motion.div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 flex items-center justify-center w-full absolute pointer-events-none top-0 left-0 bottom-0 right-0 mx-auto my-auto"
                  >
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold z-20">No {filter} found</h1>
                  </motion.div>
                );
              }
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}