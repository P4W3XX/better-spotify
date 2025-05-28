'use client';

import Image from "next/image"
import { useRouter } from "next/navigation";

export default function FavoriteSongsPlaylist() {
    const router = useRouter();
    return (
        <main onClick={() => {
            router.push('/favorite-songs');
        }} className="flex gap-x-2 items-center lg:justify-start justify-center lg:p-2 transition-colors rounded-2xl hover:bg-white/3 h-full w-full">
            <Image
                src={'/favoriteSongs.svg'}
                alt="Playlist Cover"
                width={200}
                height={200}
                className="rounded-lg size-[3rem] object-cover"
            />
            <div className=" lg:block hidden">
                <h1 className="text-white font-bold">Favorite Songs</h1>
                <p className="text-zinc-500 text-xs font-semibold">62 songs</p>
            </div>
        </main>
    )
}
