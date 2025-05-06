'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';



export default function UseLoginToken({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkToken = async () => {
            axios.get('/api/test').then((res) => {
                console.log('Test API response:', res.data.value)
            }
            ).catch((err) => {
                console.error('Error fetching test API:', err)
            }
            )
            const token = await axios.get('/api/get-cookie?key=token')
            if (token.data.value !== '0') {
                console.log('Token found:', token.data.value)
                setIsLoggedIn(true)
            } else {
                axios.get('/api/set-cookie?key=token&value=0')
                setIsLoggedIn(false)
                router.push('/login')
            }
            setIsLoading(false)
        }
        checkToken()
    }, [])
    if (isLoading && !isLoggedIn) return (<><div style={{
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