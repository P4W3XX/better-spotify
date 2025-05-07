"use client";
import { useAlbumCoverStore } from "@/store/album-cover";
import { useCurrentSongStore } from "@/store/current-song";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AlbumInfo {
  title: string;
  artist: string;
  cover: string;
  type: string;
  releaseDate: string;
  theme: string;
  albumDuration: string;
  totalPlays: number;
  songs: SongInfo[];
}

interface SongInfo {
  title: string;
  artist: string;
  cover: string;
  duration: string;
  plays: number;
  featured_artists: string[];
  isCover: boolean;
  id: string;
}

interface ArtistInfo {
  name: string;
  cover: string;
}

export default function Profile() {
  const { albumID } = useParams();
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    title: "",
    artist: "",
    cover: "",
    type: "",
    releaseDate: "",
    albumDuration: "",
    theme: "",
    totalPlays: 0,
    songs: [],
  });

  const setAlbumCover = useAlbumCoverStore((state) => state.setAlbumCover);
  const albumCover = useAlbumCoverStore((state) => state.albumCover);
  const setCurrentSongID = useCurrentSongStore(
    (state) => state.setCurrentSongID
  );
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const action = useCurrentSongStore((state) => state.action);
  const setAction = useCurrentSongStore((state) => state.setAction);

  const [artistInfo, setArtistInfo] = useState<ArtistInfo>({
    name: "",
    cover: "",
  });

  useEffect(() => {
    const fetchAlbumInfo = async () => {
      try {
        const resp = await axios.get(
          `http://127.0.0.1:8000/api/albums/${albumID}/`
        );
        console.log(resp.data);
        setAlbumInfo({
          title: resp.data.title,
          artist: resp.data.artist,
          cover: resp.data.image,
          type: resp.data.album_type,
          theme: resp.data.theme,
          albumDuration: resp.data.album_duration,
          releaseDate: resp.data.release_date,
          totalPlays: resp.data.total_plays,
          songs: resp.data.songs,
        });

        await axios
          .get(`http://127.0.0.1:8000/api/artists/${resp.data.artist || 0}/`)
          .then((res) => {
            setArtistInfo({
              name: res.data.username,
              cover: res.data.image,
            });
          });
      } catch (error) {
        console.error("Error fetching album info:", error);
      }
    };
    fetchAlbumInfo();
  }, []);

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
