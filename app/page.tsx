"use client";
import ItemCover from "@/components/item-cover";
import { useEffect, useState } from "react";
import axios from "axios";

interface Item {
  id: number;
  title: string;
  artist: string;
  cover: string;
  type: string;
}

interface mappedItems {
  id: number;
  title: string;
  artist: string;
  image: string;
  type: string;
}

export default function Home() {
  const [Items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/albums/");
        console.log(res.data);
        // Map all items instead of just first one
        const mappedItems = res.data.map((item: mappedItems) => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          cover: item.image,
          type: item.type,
        }));
        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 w-full min-h-screen">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 md:mb-5">Recently Played</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {Items.map((item) => (
          <ItemCover
            key={item.id}
            title={item.title}
            artistID={item.artist}
            cover={item.cover}
            type={item.type}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
}