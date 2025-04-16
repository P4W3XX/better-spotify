import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import PlayBar from "@/components/playbar";
import { AlbumCoverShow } from "@/components/album-cover";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://better-spotify-vert.vercel.app"),
  title: "Music",
  description: "Listen to your favorite music",
  generator: "Next.js",
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${poppins.className}  w-full flex h-full overflow-hidden`}>
        <AlbumCoverShow />
        <Sidebar />
        {children}
        <PlayBar />
      </body>
    </html>
  );
}
