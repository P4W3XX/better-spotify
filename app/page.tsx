"use client";
import ItemCover from "@/components/item-cover";
import { useEffect, useState } from "react";
import axios from "axios";
import Chip from "@/components/chip";
import { AnimatePresence, motion } from "framer-motion";

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
    <motion.div animate={{
      backgroundImage: `linear-gradient(to bottom, ${hexToRGBA(backgroundTheme || "#0a0a0a", 0.4)} 0%, #0a0a0a 30%)`,
    }} className="p-2 sm:p-6 md:p-8 lg:p-6 relative w-full h-[calc(100svh-6.5rem)] bg-background rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div layout className=" flex items-center w-full gap-x-3 z-20 ">
          <Chip title="All" onClick={() => { }} />
          <Chip title="Albums" onClick={() => { }} />
          <Chip title="Songs" onClick={() => { }} />
        </motion.div>
      </AnimatePresence>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 md:mb-5 z-20 mt-10 ">Welcome Back</h1>
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 z-20 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
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
      </div>
    </motion.div>
  );
}