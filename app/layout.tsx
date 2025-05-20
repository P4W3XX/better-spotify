import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import PlayBar from "@/components/playbar";
import { AlbumCoverShow } from "@/components/album-cover";
import UseLoginToken from "@/hooks/loginTokten";
import { Toaster } from "@/components/ui/sonner"


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

      <body className={`${poppins.className}  w-full md:bg-black bg-background flex h-full overflow-hidden`}>
        <UseLoginToken>
          <Toaster />
          <AlbumCoverShow />
          <Sidebar />
          {children}
          <PlayBar />
        </UseLoginToken>
      </body>
    </html>
  );
}
