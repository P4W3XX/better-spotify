"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [steps, setSteps] = useState<'Login' | 'Register' | null>(null);
    return (
        <main style={{
            backgroundImage: "url('/loginBG.svg')",
        }} className="flex flex-col items-center bg-center bg-cover justify-center h-screen bg-black w-full">
            <div className=' w-full h-full absolute top-0 left-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80' />
            <div className=' items-center sm:justify-center justify-end py-10 z-10 text-center flex flex-col sm:w-[25rem] h-full w-[90%] gap-y-5'>
                <div className=' flex flex-col items-center justify-center'>
                    <Image src="/social.png" alt="Logo" width={50} height={50} className="mb-3" />
                    <h1 className="sm:text-4xl text-3xl text-white mb-12 font-semibold">{
                        steps === 'Login' ? 'Zaloguj się' : steps === 'Register' ? 'Zarejestruj się' : 'Witamy w Spotify'
                    }</h1>
                </div>
                <div className=' flex flex-col gap-y-5 w-full items-center'>
                    {/*}
                    <Input type="text" placeholder="Email" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                    <Input type="password" placeholder="Password" className="w-full !bg-black backdrop-blur-3xl rounded-xl font-medium placeholder:text-white py-6 px-4" />
                    <button onClick={() => router.push("/forgotNword")} className="text-sm w-full text-start mb-5 font-medium text-white/50 hover:text-green-400">Forgot Password?</button>
                    */}
                    <button className="rounded-3xl font-semibold active:scale-95 transition-all cursor-pointer w-full bg-green-600 px-8 text-black py-3 hover:bg-green-700">Zarejestruj się</button>
                    <button className="rounded-3xl font-medium w-full bg-transparent active:scale-95 transition-all cursor-pointer border-2 px-8 py-3 hover:bg-white/3">Zaloguj się</button>
                </div>
            </div>
        </main>
    );
}