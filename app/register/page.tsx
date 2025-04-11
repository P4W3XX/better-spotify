"use client";
import React from "react";
import Image from "next/image";
import { LuSmartphone } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main
      style={{
        background:
          "linear-gradient(to bottom, black 20%,transparent), url('/fans.jpg')",
          backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="bg-no-repeat   flex flex-col items-center justify-center h-screen w-full"
    >
      <Image
        src="/social.png"
        alt="Logo"
        width={60}
        height={60}
        className="mb-3 md:w-17 md:h-17"
      />
      <h1 className=" text-4xl text-gray-300 mb-2 font-semibold">
        Milions of songs.
      </h1>
      <h1 className=" text-4xl text-gray-300 mb-12 font-semibold">
        Free on Spotify
      </h1>
      <div className="flex flex-col gap-y-2 justify-center items-center w-full">
        <Link
          href="/login"
          type="submit"
          className="md:text-lg justify-center items-center flex font-semibold text-neutral-900 brightness-110 rounded-4xl bg-green-600 px-8 py-3 cursor-pointer hover:bg-green-700  md:w-[26rem] w-[24rem]"
        >
          Sign up for free
        </Link>
        <Link
          href="/login"
          type="submit"
          className="relative md:text-lg flex flex-row relative justify-center items-center font-semibold text-white rounded-4xl cursor-pointer  px-8 py-3  border-1 border-gray-600 hover:brightness-75 w-[24rem] md:w-[26rem]"
        >
          <LuSmartphone className="absolute left-5 md:left-10 items-center w-6 h-6" />
          <span>Continue with phone number</span>
        </Link>
        <Link
        href="/login"
          type="submit"
          className="relative md:text-lg flex flex-row items-center justify-center font-semibold text-white rounded-4xl cursor-pointer  px-8 py-3 border-1 border-gray-600 hover:brightness-75 w-[24rem] md:w-[26rem]"
        >
          <FcGoogle className="absolute left-5 md:left-10 items-center w-6 h-6" />
          <span >Continue with Google</span>
        </Link>
      </div>  
    </main>
  );
}
