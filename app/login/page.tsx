"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const router = useRouter();
    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gradient-to-t from-black from-40% to-green-900 w-full">
            <Image src="/social.png" alt="Logo" width={40} height={40} className="mb-3" />
            <h1 className="text-4xl text-gray-300 mb-12 font-semibold">Zaloguj się w Spotify</h1>
            <form className="flex flex-col gap-4 justify-center items-center w-full">
                <input type="text" placeholder="Username" className="rounded-lg px-5 py-3 w-[20rem]  border-3 border-gray-600 text-gray-300" />
                <input type="password" placeholder="Password" className="rounded-lg px-5 py-3 w-[20rem]  border-3 border-gray-600" />
                <button onClick={() => router.push("/forgotNword")} className="text-sm text-gray-500 hover:text-gray-700">Forgot Password?</button>
                <button type="submit" className="rounded-lg bg-green-900 px-8 py-3 hover:bg-neutral-700">Login</button>
            </form>
        </main>
    );
}