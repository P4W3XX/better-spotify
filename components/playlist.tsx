'use client';

import Image from "next/image"

export default function Playlist() {
    return (
        <main className="flex gap-x-2 items-center justify-start p-2 transition-colors rounded-2xl hover:bg-white/3 h-full w-full">
            <Image
                src={'/cover.jpg'}
                alt="Playlist Cover"
                width={200}
                height={200}
                className="rounded-lg size-[3rem] object-cover"
            />
            <div>
                <h1 className="text-white font-bold">Utopia</h1>
                <p className="text-zinc-500 text-xs font-semibold">Travis Scott</p>
            </div>
        </main>
    )
}
