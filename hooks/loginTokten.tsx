'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTokenStore } from '@/store/token';


export default function UseLoginToken({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [, setIsLoggedIn] = useState(false)
    const accessToken = useTokenStore((state) => state.accessToken);
    const setAccessToken = useTokenStore((state) => state.setAccessToken);

    const pathname = usePathname()

    useEffect(() => {
        const checkToken = async () => {
            if (!accessToken) {
                console.log('No token found, checking cookie...')
                setIsLoading(true)
                const token = await axios.get('/api/get-cookie?key=token')
                if (token.data.value !== '0') {
                    console.log('Token found:', token.data.value)
                    setAccessToken(token.data.value)
                    setIsLoggedIn(true)
                    if (pathname === '/login') {
                        router.back()
                    }
                } else {
                    axios.get('/api/set-cookie?key=token&value=0')
                    setIsLoggedIn(false)
                    router.push('/login')
                }
            } else {
                console.log('Already logged in, skipping token check')
            }
            setIsLoading(false)
        }
        checkToken()
    }, [pathname])
    if (isLoading) return (<><div style={{
        backgroundImage: "url('/loginBG.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }} className="flex justify-center items-center w-full flex-col gap-y-10 h-screen">
        <motion.img initial={{ scale: 0 }} animate={{ scale: [1, 1.1, 1] }} exit={{ scale: 1.3, opacity: 0 }} transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
        }} src="/spotify.svg" alt="Logo" width={200} height={200} className=' z-10' />
    </div>
        <div className=' w-full h-full absolute left-0 top-0 bg-black/85' />
    </>
    )
    return (
        children
    )
}