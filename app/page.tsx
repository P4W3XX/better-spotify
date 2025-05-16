"use client";
import ItemCover from "@/components/item-cover";
import { useEffect, useState } from "react";
import axios from "axios";
import Chip from "@/components/chip";
import { AnimatePresence, motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface Item {
  id: number;
  title: string;
  artist: string;
  cover: string;
  songs: { id: number }[];
  type: string;
  theme: string;
}

interface mappedItems {
  id: number;
  title: string;
  artist: string;
  image: string;
  theme: string;
  type: string;
  songs: { id: number }[];
}

export default function Home() {
  const [Items, setItems] = useState<Item[]>([]);
  const [backgroundTheme, setBackgroundTheme] = useState<string>("");
  const [SeeAll, setSeeAll] = useState<'Welcome Back' | 'Albums' | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/albums/").then((res) => res.data).catch((err) => {
          console.log(err);
        })
        console.log("res", res);
        const mappedItems = res.map((item: mappedItems) => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          theme: item.theme,
          cover: item.image,
          songs: item.songs,
          type: item.type,
        }));
        console.log(mappedItems);
        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const hexToRGBA = (hex = "", alpha = 1) => {
    const cleanHex = hex.replace("#", "");
    const bigint = parseInt(cleanHex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        backgroundImage: `linear-gradient(to bottom, ${hexToRGBA(backgroundTheme || "#0a0a0a", 0.4)} 0%, #0a0a0a 30%)`,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      layout
      className="p-4 sm:p-6 md:p-8 lg:p-6 relative w-full md::h-[calc(100svh-6.5rem)] h-svh bg-background md:rounded-xl"
    >
      <AnimatePresence mode="wait">
        {!SeeAll && (
          <motion.div
            key="Welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className=" flex flex-col w-full h-full"
          >
            <div className="flex items-center w-full gap-x-3 z-20">
              <Chip title="Albums" onClick={() => { }} />
              <Chip title="Songs" onClick={() => { }} />
              <Chip title="Artists" onClick={() => { }} />
            </div>
            <motion.div className=" w-full flex flex-col mt-5">
              <div className="w-full flex items-center justify-between h-min  mb-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold z-20 ">Welcome Back</h1>
                <button
                  onClick={() => setSeeAll('Welcome Back')}
                  className="font-semibold text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  See more
                </button>
              </div>
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                  {Items.slice(0, 10).map((item) => (
                    <CarouselItem key={item.id} className="2xl:basis-1/6 xl:basis-1/5 md:basis-1/4 basis-1/3">
                      <ItemCover
                        setHover={setBackgroundTheme}
                        title={item.title}
                        artistID={item.artist}
                        cover={item.cover}
                        theme={item.theme}
                        type={item.type}
                        songs={item.songs}
                        id={item.id}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </motion.div>
            <motion.div className=" w-full flex flex-col mt-10">
              <div className="w-full flex items-center justify-between h-min  mb-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold z-20 ">Albums</h1>
                <button
                  onClick={() => setSeeAll('Albums')}
                  className="font-semibold text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  See more
                </button>
              </div>
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                  {Items.slice(0, 10).map((item) => (
                    <CarouselItem key={item.id} className="2xl:basis-1/6 xl:basis-1/5 md:basis-1/4 basis-1/3">
                      <ItemCover
                        setHover={setBackgroundTheme}
                        title={item.title}
                        artistID={item.artist}
                        cover={item.cover}
                        theme={item.theme}
                        type={item.type}
                        songs={item.songs}
                        id={item.id}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </motion.div>
          </motion.div>
        )}
        {SeeAll && (
          <>
            <motion.div
              key="SeeAll"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-between mt-3 mb-3"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold z-20 ">{SeeAll}</h1>
              <button
                onClick={() => setSeeAll(null)}
                className="font-semibold text-muted-foreground hover:text-white transition-colors cursor-pointer"
              >
                See less
              </button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }} className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 z-20 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {Items.map((item) => (
                <ItemCover
                  setHover={setBackgroundTheme}
                  key={item.id}
                  title={item.title}
                  artistID={item.artist}
                  cover={item.cover}
                  theme={item.theme}
                  type={item.type}
                  songs={item.songs}
                  id={item.id}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}