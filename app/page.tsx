"use client";
import ItemCover from "@/components/ui/item-cover";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  const Items = [
    {
      title: "4x4",
      artist: "Travis Scott",
      cover: "/cover.jpg",
      type: "album",
      id: 1,
    },
    {
      title: "4x4",
      artist: "Travis Scott",
      cover: "/cover.jpg",
      type: "song",
      id: 2,
    },
    {
      title: "Travis Scott",
      cover: "/travis.jpg",
      type: "profile",
      id: 3,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/albums/",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      console.log(response.data);
    };
    fetchData();
  }, []);
  return (
    <div className=" p-10 w-auto">
      <h1 className=" text-3xl font-semibold mb-5">Recently Played</h1>
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {Items.map((item) => (
          <ItemCover
            key={item.id}
            title={item.title}
            artist={item.artist}
            cover={item.cover}
            type={item.type}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
}
