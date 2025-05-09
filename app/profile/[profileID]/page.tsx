"use client";
import ItemCover from "@/components/item-cover";
import { SongPreview } from "@/components/song-preview";
import axios from "axios";
import { Ellipsis, Music } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Pause, Play, Shuffle } from "lucide-react";
import { useCurrentSongStore } from "@/store/current-song";
import { useTokenStore } from "@/store/token";

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
  id: string;
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
  id: string;
  name: string;
  cover: string;
  type: string;
  albums: AlbumInfo[];
  top_songs: SongInfo[];
  number_of_listeners: number;
}

export default function Profile() {
  const handleRef = useRef<HTMLDivElement>(null);
  const { profileID } = useParams();
  const [artistInfo, setArtistInfo] = useState<ArtistInfo>({
    id: "",
    name: "",
    cover: "",
    type: "",
    albums: [] as AlbumInfo[],
    top_songs: [] as SongInfo[],
    number_of_listeners: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setCurrentSongID = useCurrentSongStore(
    (state) => state.setCurrentSongID
  );
  const currentSongID = useCurrentSongStore((state) => state.currentSongID);
  const action = useCurrentSongStore((state) => state.action);
  const setAction = useCurrentSongStore((state) => state.setAction);
  const [width, setWidth] = useState(0);
  const [following, setFollowing] = useState(false);
  const accessToken = useTokenStore((state) => state.accessToken);

  const [albumInfo, setAlbumInfo] = useState<AlbumInfo>({
    id: "",
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

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(()=>{
    const fetchData = async () => {
      const respo = await axios.get(`http://127.0.0.1:8000/api/artists/${profileID}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((response) => {
        setFollowing(response.data.is_followed)
      }).catch((error) => {
        console.error('error: ', error)
      })
    }

    if (!accessToken) return
    fetchData();
  }, [profileID, accessToken])

  const toggleFollow = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/toggle-follow/`,
        { user_id: profileID },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Response:", response.data.status);
      if (response.data.status == "Following") {
        setFollowing(true);
      }
      else if (response.data.status == "Unfollowed") {
        setFollowing(false);
      }
    } 
    catch (error) {
      console.error("Błąd przy toggle follow:");
    }
    // setFollowing(!following);
  };

  {/*   useEffect(() => {
    const box = handleRef.current;
    if (!box) {
      console.warn("handleRef is not attached to any element.");
      return;
    }

    const handleScroll = () => {
      setScrollY(box.scrollTop);
      console.log("Scroll Top:", box.scrollTop);
    };

    box.addEventListener("scroll", handleScroll);

    return () => {
      box.removeEventListener("scroll", handleScroll);
    };
  }, [handleRef]); */}

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("artistID:", profileID);

        if (!profileID) {
          throw new Error("Invalid artist ID");
        }

        console.log("Fetching artist with ID:", profileID);

        const artistResponse = await axios.get(
          `http://127.0.0.1:8000/api/artists/${profileID}/`
        );

        setArtistInfo({
          id: artistResponse.data.id,
          name: artistResponse.data.username,
          cover: artistResponse.data.image || "/slabiak2.jpg",
          type: artistResponse.data.type,
          albums: artistResponse.data.albums?.map((album: AlbumInfo) => ({
            title: album.title,
            cover: album.cover,
            id: album.id,
          })),
          top_songs: artistResponse.data.top_songs?.map((song: SongInfo) => ({
            title: song.title,
            artist: song.artist,
            cover: song.cover || "/slabiak2.jpg",
            duration: song.duration,
            plays: song.plays,
            featured_artists: song.featured_artists || [],
            isCover: song.isCover || false,
            id: song.id,
          })),
          number_of_listeners: artistResponse.data.number_of_listeners,
        });

        if (artistResponse.data.albums) {
          const albumResponse = await axios.get(
            `http://127.0.0.1:8000/api/albums/${artistResponse?.data?.albums[0].id}/`
          );

          setAlbumInfo({
            id: artistResponse?.data?.albums?.id,
            title: albumResponse?.data.title,
            artist: albumResponse?.data.artist,
            cover: albumResponse?.data.cover || "/slabiak2.jpg",
            type: albumResponse?.data.type,
            releaseDate: albumResponse?.data.release_date,
            albumDuration: albumResponse?.data.album_duration,
            theme: albumResponse?.data.theme,
            totalPlays: albumResponse?.data.total_plays,
            songs: albumResponse?.data.songs?.map((song: SongInfo) => ({
              title: song.title,
              artist: song.artist,
              cover: song.cover || "/slabiak2.jpg",
              duration: song.duration,
              plays: song.plays,
              featured_artists: song.featured_artists || [],
              id: song.id,
            })),
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileID]);

  if (loading) {
    return (
      <main className="mt-30 px-7">
        <div className="flex flex-row gap-x-2">
          <div className="w-[2rem] h-[2rem] bg-gray-300 rounded-full animate-pulse"></div>
          <div className="w-[20rem] h-[2rem] bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="w-[40rem] h-[7rem] bg-gray-300 rounded-lg mt-4 animate-pulse"></div>
        <div className="w-[20rem] h-[1.5rem] bg-gray-300 rounded-lg mt-4 animate-pulse"></div>
      </main>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  console.log("Artist Info:", artistInfo);

  console.log("Album Info:", artistInfo.albums);

  return (
    <>
      {artistInfo.type === "listener" && (
        <>
          <main className="pb-[7rem] flex flex-col w-full px-10 from-10% bg-gradient-to-t from-black to-gray-700 overflow-auto h-screen">
            <div className="flex flex-row pt-8 pb-6 w-full h-[20rem] justify-start items-center gap-x-10">
              <Image
                src={artistInfo?.cover || "/slabiak2.jpg"}
                alt="Artist Cover"
                width={250}
                height={250}
                className="w-[15rem] h-[15rem] rounded-full"
              />
              <div className="flex flex-col gap-y-2 pt-10">
                <p className="text-sm font-medium">Profil</p>
                <h1 className="text-8xl font-bold">
                  {artistInfo?.name || "Unknown"}
                </h1>
                <p className="text-sm font-medium">2 publiczne playlisty</p>
              </div>
            </div>
            <aside className="mt-20 flex flex-col w-full h-[20rem]">
              <h3 className="text-2xl font-semibold">
                Najpopularniejsi wykonawcy w tym miesiącu
              </h3>
              <p className="text-sm font-medium text-zinc-400">
                Widoczne tylko dla ciebie
              </p>
              <div className="flex flex-row gap-x-4 flex-wrap mt-4">
                {artistInfo?.albums?.map((album: AlbumInfo) => (
                  <ItemCover
                    key={album.id}
                    title={album.title}
                    artistID={album.artist}
                    cover={album.cover}
                    type={album.type}
                    songs={album.songs.map((song) => ({ id: Number(song.id) }))}
                    id={Number(album.id)}
                  />
                ))}
              </div>
            </aside>
          </main>
        </>
      )}

      {artistInfo.type === "artist" && (
        <main
          ref={handleRef}
          className="flex flex-col w-full h-full overflow-auto mb-[30rem]"
        >
          <div
            style={{ backgroundImage: `url(${artistInfo.cover})` }}
            className="flex flex-col pl-[1rem] pb-6 h-[20rem] justify-start gap-y-3 bg-no-repeat w-full bg-cover bg-center"
          >
            <div className="flex flex-row pt-8 w-full justify-start items-center gap-x-3 md:pt-30 pt-65">
              <VscVerifiedFilled className={`w-[2rem] h-[2rem] ${width > 920 ? "block" : "hidden"}`} />
              <h3 className={`text-md ${width > 920 ? "block" : "hidden"}`}>
                Zweryfikowany wykonawca
              </h3>
            </div>
            <h1 className="md:text-8xl text-5xl font-bold ">
              {artistInfo.name}
            </h1>
            <p
              className={`text-md font-medium ${width > 920 ? "block" : "hidden"
                }`}
            >
              {artistInfo.number_of_listeners} słuchaczy w miesiącu
            </p>
          </div>
          <div className="sticky top-0 flex flex-row gap-x-6 items-center justify-start bg-cyan-950 w-full px-4 py-4">
            <button
              onClick={() => {
                if (albumInfo.songs.length > 0 && albumInfo.songs[0]) {
                  if (
                    currentSongID &&
                    albumInfo.songs.some(
                      (song) => song.id.toString() === currentSongID
                    )
                  ) {
                    if (action === "Play") {
                      setAction("Pause");
                    } else {
                      setAction("Play");
                    }
                  } else {
                    setCurrentSongID(albumInfo.songs[0].id.toString());
                    setAction("Play");
                  }
                }
              }}
              className=" hover:scale-105 active:scale-95 transition-all cursor-pointer md:size-[4rem] size-[3rem] bg-white rounded-full flex items-center justify-center"
            >
              {currentSongID &&
                albumInfo.songs.some(
                  (song) => song.id.toString() === currentSongID
                ) ? (
                action === "Play" ? (
                  <Pause
                    className="text-black md:size-[24px] size-[20px]"
                    fill="black"
                  />
                ) : (
                  <Play
                    className="text-black md:size-[24px] size-[20px]"
                    fill="black"
                  />
                )
              ) : (
                <Play
                  className="text-black md:size-[24px] size-[20px]"
                  fill="black"
                />
              )}
            </button>
            <Shuffle className=" text-gray-500 w-[2rem] h-[2rem] hover:brightness-150  hover:scale-105 cursor-pointer" />
            <button className="border-1 text-gray-300 border-gray-500 rounded-xl text-sm font-medium py-1 px-4 hover:brightness-150  hover:scale-105 cursor-pointer"
              onClick={toggleFollow}
            >
              {/* Obserwuj */}
              {following ? "Obserwujesz" : "Obserwuj"}
            </button>
            <Ellipsis className="w-[2rem] h-[2rem] text-gray-500 hover:brightness-150  hover:scale-105 cursor-pointer" />
          </div>
          <aside className="bg-gradient-to-t from-black to-cyan-950 flex flex-col w-full h-[20rem] gap-y-3 px-4">
            <h2 className="text-3xl font-semibold mt-6">Popularne</h2>
            {artistInfo.top_songs.length > 0 ? (
              artistInfo.top_songs.map((song: SongInfo, index: number) => (
                <SongPreview
                  key={index}
                  index={index}
                  title={song.title}
                  artist={artistInfo.name}
                  feats={song.featured_artists}
                  isCover={false}
                  id={song.id}
                  plays={song.plays}
                  duration={song.duration}
                  artistId={Number(artistInfo.id)}
                  isIndex={true}
                  isPlays={true}
                  isDuration={true}
                  isIndecent={false}
                />
              ))
            ) : (
              <div className=" flex items-center justify-center w-full h-full gap-x-3">
                <p className=" text-white/50 font-medium md:text-3xl text-2xl">
                  No songs available
                </p>
                <Music
                  className=" opacity-50 md:size-[50px] size-[35px]"
                  size={50}
                />
              </div>
            )}

          </aside>
        </main>
      )}
    </>
  );
}
