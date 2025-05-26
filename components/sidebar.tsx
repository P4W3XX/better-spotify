"use client";

import { House, Library, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useUserStore() as { currentUser: { username?: string } };
  const firstLetter = currentUser.username?.charAt(0).toUpperCase() || "X";
  const secondLetter = currentUser.username?.charAt(1).toUpperCase() || "d";

  if (pathname === "/login" || pathname === '/register') return null;
  return (
    <main className=" fixed md:relative rounded-xl z-50 md:h-[calc(100svh-6.5rem)] h-full max-h-[5rem] md:max-h-svh bottom-0 md:p-3 md:flex-col md:max-w-[5rem] md:min-w-[5rem] lg:min-w-[18rem] lg:max-w-[18rem] bg-black flex items-center justify-between px-10 w-full md:bg-background/75">
      <div className=" w-full flex md:flex-col gap-y-3 justify-between">
        <button
          onClick={() => {
            router.push("/profile");
          }}
          className={` ${pathname === "/profile" ? "text-white" : " text-neutral-500"
            } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/10 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-2.5 md:justify-start`}
        >
          <div className=" size-[2.2rem] min-w-[2.2rem] bg-zinc-800 text-sm rounded-full flex items-center justify-center font-semibold">
            <p>{firstLetter}{secondLetter}</p>
          </div>
          <p
            className={` text-[10px] lg:text-xl lg:block hidden font-medium md:font-semibold`}
          >
            Profile
          </p>
        </button>
        <button
          onClick={() => {
            router.push("/");
          }}
          className={` ${pathname === "/" ? "text-white" : " text-neutral-500"
            } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/10 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-3 md:justify-start`}
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
            } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/10 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-3 md:justify-start`}
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
        <button
          onClick={() => {
            router.push("/library");
          }}
          className={` ${pathname === "/library" ? "text-white" : " text-neutral-500"
            } flex flex-col md:flex-row gap-x-2 items-center md:hover:bg-white/10 transition-colors cursor-pointer rounded-2xl md:w-full justify-center md:p-3 md:justify-start`}
        >
          <Library
            fill={pathname === "/library" ? "white" : "transparent"}
            size={30}
            className={` transition-colors md:stroke-3 ${pathname === "/library" ? "stroke-white" : "stroke-neutral-500"
              }`}
          />
          <p
            className={` text-[10px] lg:text-xl lg:block hidden font-medium md:font-semibold`}
          >
            Your library
          </p>
        </button>
      </div>
    </main>

  )

}
