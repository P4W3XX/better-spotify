import type { NextConfig } from "next";

module.exports = async (): Promise<NextConfig> => {
  // Your current or future configuration

  const nextConfig: NextConfig = {
    devIndicators: false,
    images: {
      remotePatterns: [
        {
          protocol: "http" as const,
          hostname: "127.0.0.1",
          pathname: "**",
        },
        {
          protocol: "http" as const,
          hostname: "localhost",
          pathname: "**",
        },
        {
          protocol: "https" as const,
          hostname: "better-spotify-vert.vercel.app",
          pathname: "**",
        },
        {
          protocol: "https" as const,
          hostname: process.env.DB_HOST || "better-spotify-vert.vercel.app",
          pathname: "**",
        }
      ],
    },
  };

  console.log("NODE_ENV", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "public/service-worker/app-worker.ts",
      swDest: "public/sw.js",
      reloadOnOnline: true,
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};
