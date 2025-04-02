"use client";

import { House, Library, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <main className=" fixed z-50 bottom-0 flex items-center justify-between px-10 w-full h-[4rem] bg-gradient-to-t from-black from-30% to-black">
      <button
        onClick={() => {
          router.push("/");
        }}
        className={` ${
          pathname === "/" ? "text-white" : " text-neutral-500"
        } flex flex-col items-center justify-center`}
      >
        <House
          fill={pathname === "/" ? "white" : "transparent"}
          size={30}
          className={` transition-colors`}
        />
        <p className={` text-[10px] font-medium`}>Home</p>
      </button>
      <button
        onClick={() => {
          router.push("/");
        }}
        className={` ${
          pathname === "/" ? "text-white" : " text-neutral-500"
        } flex flex-col items-center justify-center`}
      >
        <Search
          fill={pathname === "/" ? "white" : "transparent"}
          size={30}
          className={` transition-colors`}
        />
        <p className={` text-[10px] font-medium`}>Search</p>
      </button>
      <button
        onClick={() => {
          router.push("/");
        }}
        className={` ${
          pathname === "/" ? "text-white" : " text-neutral-500"
        } flex flex-col items-center justify-center`}
      >
        <Library
          fill={pathname === "/" ? "white" : "transparent"}
          size={30}
          className={` transition-colors`}
        />
        <p className={` text-[10px] font-medium`}>Your library</p>
      </button>
    </main>
  );
}
