"use client";
import Image from "next/image";



export default function Profile() {

  return (
    <main className="pb-[7rem] flex flex-col w-full px-10 from-10% bg-gradient-to-t from-black to-amber-950 overflow-scroll h-screen">
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
          <h1 className="text-8xl font-bold">PAWEXx102</h1>
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
        <div className="flex flex-row gap-x-4 flex-wrap mt-4">
        </div>
      </section>
    </main>
  );
}
