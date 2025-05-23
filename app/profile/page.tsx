"use client";
import Image from "next/image";
import { useUserStore } from "@/store/user";
import { useEffect,useState } from "react";
import axios from "axios";
import ItemCover from "@/components/item-cover";

interface Item {
  id: number;
  title: string;
  artist: string;
  cover: string;
  songs: { id: number }[];
  type: string;
}

interface mappedItems {
  id: number;
  title: string;
  artist: string;
  image: string;
  type: string;
  songs: { id: number }[];
}

export default function Profile() {
  const { currentUser } = useUserStore() as {
    currentUser: { username?: string };
  };
  const firstlettrer = currentUser.username?.charAt(0).toUpperCase() || "Xd";
  console.log("currentUser", firstlettrer);
    const [Items, setItems] = useState<Item[]>([]);

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

  return (
    <main className="pb-[7rem] flex flex-col w-full px-10 from-10% bg-gradient-to-t from-black to-yellow-950 overflow-scroll h-screen">
      <div className="flex flex-row pt-8 pb-6 w-full h-[20rem] justify-start items-center gap-x-10 ">
        <Image
          src="/slabiak2.jpg"
          alt="Profile Picture"
          width={250}
          height={250}
          className="w-[15rem] h-[15rem] rounded-full"
        />
        <div className="flex flex-col gap-y-2 pt-10">
          <p className="text-sm font-medium">Profil</p>
          <h1 className="text-8xl font-bold">
            {currentUser.username || "KhaliBali export"}
          </h1>
          <p className="text-sm font-semibold text-gray-300">
            2 publiczne playlisty{" "}
          </p>
        </div>
      </div>
      <section className="pt-10 flex flex-col">
        <h3 className="text-2xl font-semibold">
          Najpopularniejsi wykonawcy w tym miesiącu
        </h3>
        <p className="text-sm font-medium text-zinc-400">
          Widoczne tylko dla ciebie
        </p>
        <div className="mt-8 grid grid-cols-6 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {Items.map((item) => (
            <ItemCover
              key={item.id}
              title={item.title}
              artistID={item.artist}
              cover={item.cover}
              type={item.type}
              songs={item.songs}
              id={item.id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
