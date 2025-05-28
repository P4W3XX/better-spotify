'use client';

import Image from "next/image"
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { useTokenStore } from "@/store/token";

export default function FavoriteSongsPlaylist() {
    const [amnoutSongs, setAmnoutSongs] = useState(0);
    const token = useTokenStore((state) => state.accessToken);
    useEffect(() => {
        const fetchSongs = async () => {
            if (!token) {
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user-playlists/?search=Liked%20Songs', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setAmnoutSongs(response.data[0]?.songs.length);
            } catch (error) {
                console.error('Error fetching favorite songs:', error);
            }
        };

        fetchSongs();
    }, []);

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
                <p className="text-zinc-500 text-xs font-semibold">{amnoutSongs > 9 ? amnoutSongs + ' song' : amnoutSongs + ' song'}</p>
            </div>
        </main>
    )
}
