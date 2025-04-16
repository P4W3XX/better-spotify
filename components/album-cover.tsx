"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useAlbumCoverStore } from "@/store/album-cover";

export const AlbumCoverShow = () => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const albumCover = useAlbumCoverStore((state) => state.albumCover);
  const setAlbumCover = useAlbumCoverStore((state) => state.setAlbumCover);

  useEffect(() => {
    if (!albumCover) return; // Don't add event listener if album cover is hidden

    // To prevent immediate closing, use mousedown instead of click
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setAlbumCover(null); // Close the album cover when clicking outside
        document.removeEventListener("mousedown", handleClickOutside); // Clean up the event listener
      }
    };

    // Add event listener with a delay to avoid catching the same click
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [albumCover, setAlbumCover]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          pointerEvents: "none",
        }}
        animate={{
          opacity: albumCover ? 1 : 0,
          transition: { duration: 0.2 },
          pointerEvents: albumCover ? "all" : "none",
        }}
        className="w-full h-svh flex items-center justify-center z-[52] bg-black/60 absolute"
      >
        <motion.div
          initial={{
            y: 100,
          }}
          animate={{
            y: albumCover ? 0 : 100,
            scale: albumCover ? 1 : 0.8,
            transition: { duration: 0.2 },
          }}
          exit={{
            y: 100,
            transition: { duration: 0.2 },
          }}
          ref={containerRef}
          className="md:size-[40rem] w-[85%] flex items-center justify-center"
        >
          {albumCover && (
            <Image
              ref={imageRef}
              src={albumCover}
              alt="Cover"
              width={1000}
              height={1000}
              className="rounded-lg cursor-pointer w-full h-full shadow-[0_0_20px_0_rgba(0,0,0,0.5)] shadow-black/60"
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
