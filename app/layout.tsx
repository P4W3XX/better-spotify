"use client";

import { Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import PlayBar from "@/components/playbar";
import { AlbumCoverShow } from "@/components/album-cover";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${poppins.className}  w-full flex h-full`}>
        {pathname !== "/login" && pathname !== "/register" && (
          <div>
            <AlbumCoverShow />
            <Sidebar />
            {children}
            <PlayBar />
          </div>
        )}
        <div className="w-full h-full flex flex-col justify-center items-center">
        {children}
        </div>
      </body>
    </html>
  );
}