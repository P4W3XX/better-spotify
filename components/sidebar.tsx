"use client";

import { ArrowRight, Crown, House, Library, Search, Settings, UserRoundCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import Playlist from "./playlist";
import FavoriteSongsPlaylist from "./favoriteSongs";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { useTokenStore } from "@/store/token";


interface PlaylistProps {
  id: string;
  content_type: string;
  library_obj: {
    id: number;
    artist_username: string;
    title: string;
    description: string;
    image: string;
  }
}


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const playlistRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [playlists, setPlaylists] = useState<PlaylistProps[]>([]);
  const token = useTokenStore((state) => state.accessToken);

  useEffect(() => {
    const handleScroll = () => {
      if (playlistRef.current) {
        if (playlistRef.current.scrollTop > 0) {
          setIsScrolling(true);
        } else {
          setIsScrolling(false);
        }
      }
    };

    // Attach the scroll event listener
    playlistRef?.current?.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      playlistRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!token) {
        return;
      }
      axios.get('http://127.0.0.1:8000/api/library/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then((response) => {
        console.log("Playlists fetched:", response.data);
        setPlaylists(response.data.items as PlaylistProps[]);
      }).catch((error) => {
        console.error("Error fetching playlists:", error);
      });
    }
    fetchPlaylists();
  }, []);
  const { currentUser } = useUserStore() as { currentUser: { username?: string } };
  const firstLetter = currentUser.username?.charAt(0).toUpperCase() || "X";
  const secondLetter = currentUser.username?.charAt(1).toUpperCase() || "d";

  if (pathname === "/login" || pathname === '/register') return null;
  return (
    <main className=" fixed md:relative rounded-xl z-50 md:h-[calc(100svh-6.5rem)] h-full max-h-[5rem] md:max-h-svh bottom-0  md:flex-col md:max-w-[5rem] md:min-w-[5rem] lg:min-w-[18rem] lg:max-w-[18rem] bg-black flex items-center justify-between md:justify-start w-full md:bg-background/75">
      <div className=" w-full flex md:flex-col h-min gap-y-3 justify-between px-10 md:p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={` ${pathname === "/profile" ? "text-white" : " text-neutral-500"
                } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/5 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-2.5 md:justify-start`}
            >
              <div className=" size-[2.2rem] min-w-[2.2rem] bg-zinc-800 text-sm rounded-full flex items-center justify-center font-semibold">
                <p>{firstLetter}{secondLetter}</p>
              </div>
              <p
                className={` text-[10px] lg:text-xl lg:block hidden font-medium md:font-semibold`}
              >
                Account
              </p>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-68 rounded-2xl p-3 shadow-2xl shadow-black bg-background/80 backdrop-blur-3xl">
            <DropdownMenuGroup className=" flex gap-x-2 items-center">
              <div className=" size-[3rem] min-w-[3rem] bg-zinc-800 text-lg rounded-lg flex items-center justify-center font-semibold">
                <p>{firstLetter}{secondLetter}</p>
              </div>
              <div>
                <p className=" font-semibold">{currentUser.username ? currentUser.username : 'Username'}</p>
                <p className=" text-sm font-lg text-white/60">Free</p>
              </div>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-3" />
            <DropdownMenuGroup className=" flex flex-col gap-y-1">
              <button className=" text-start py-2 flex items-center justify-between px-3 group hover:bg-white/5 font-semibold cursor-pointer transition-colors rounded-lg">
                <p className=" text-zinc-400 group-hover:text-white">Go to your profile</p>
                <ArrowRight className="stroke-4 text-zinc-400 group-hover:text-white" size={16} />
              </button>
              <button className=" text-start py-2 flex items-center justify-between px-3 group hover:bg-white/5 font-semibold cursor-pointer transition-colors rounded-lg">
                <p className=" text-zinc-400 group-hover:text-white">Your library</p>
                <Library className="stroke-4 text-zinc-400 group-hover:text-white" size={16} />
              </button>
              <button className=" text-start py-2 flex items-center justify-between px-3 group hover:bg-white/5 font-semibold cursor-pointer transition-colors rounded-lg">
                <p className=" text-zinc-400 group-hover:text-white">Your followers</p>
                <UserRoundCheck className="stroke-4 text-zinc-400 group-hover:text-white" size={16} />
              </button>
              <button className=" text-start py-2 flex items-center justify-between px-3 group hover:bg-white/5 font-semibold cursor-pointer transition-colors rounded-lg">
                <p className=" text-zinc-400 group-hover:text-white">Settings</p>
                <Settings className="stroke-4 text-zinc-400 group-hover:text-white" size={16} />
              </button>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-3" />
            <DropdownMenuGroup className=" flex flex-col gap-y-1">
              <button className=" text-start py-2 flex items-center bg-white justify-between px-3 group hover:bg-white/90 font-semibold cursor-pointer transition-colors rounded-lg">
                <p className=" text-black group-hover:text-black/90">Explore Premium</p>
                <Crown className="stroke-4 text-black group-hover:text-black/90" size={16} />
              </button>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={() => {
            router.push("/");
          }}
          className={` ${pathname === "/" ? "text-white" : " text-neutral-500"
            } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/5 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-3 md:justify-start`}
        >
          <House
            fill={pathname === "/" ? "white" : "#131313"}
            size={30}
            className={` transition-colors md:stroke-3 ${pathname === "/" ? "stroke-white" : "stroke-neutral-500"
              }`}
          />
          <p
            className={` text-[10px] lg:text-xl lg:block hidden font-medium md:font-semibold`}
          >
            Home
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/search");
          }}
          className={` ${pathname === "/search" ? "text-white" : " text-neutral-500"
            } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/5 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-3 md:justify-start`}
        >
          <Search
            fill={pathname === "/search" ? "white" : "transparent"}
            size={30}
            className={` transition-colors md:stroke-3 ${pathname === "/search" ? "stroke-white" : "stroke-neutral-500"
              }`}
          />
          <p
            className={` text-[10px] lg:text-xl lg:block hidden font-medium md:font-semibold`}
          >
            Search
          </p>
        </button>
      </div>
      <div className=" hidden md:flex flex-col overflow-auto gap-y-2 relative w-full">
        <motion.div initial={false} animate={{
          opacity: isScrolling ? 1 : 0,
        }} className=" w-full h-5 top-0 bg-gradient-to-b pointer-events-none from-black absolute" />
        <div ref={playlistRef} className=" overflow-auto scrollbar-hide flex flex-col lg:gap-y-1 gap-y-4 px-3">
          <FavoriteSongsPlaylist />
          {playlists && playlists.slice(0, -1).map((playlist) => (
            <Playlist key={playlist.id} title={playlist.library_obj.title} artistUsername={playlist.library_obj.artist_username} type={playlist.content_type} songs={[]} url={playlist.library_obj.image} id={playlist.library_obj.id} />
          ))}
        </div>
      </div>
    </main>

  )

}
