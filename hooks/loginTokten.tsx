'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';



export default function UseLoginToken({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const checkToken = async () => {
            axios.get('/api/test').then((res) => {
                console.log('Test API response:', res.data.value)
            }
            ).catch((err) => {
                console.error('Error fetching test API:', err)
            }
            )
            console.log('Checking token...')
            const token = await axios.get('/api/get-cookie?key=token')
            if (token.data.value > 0) {
                console.log('Token found:', token.data.value)
                setIsLoggedIn(true)
            } else {
                console.log('Token not found')
                console.log('Redirecting to login...')
                axios.get('/api/set-cookie?key=token&value=0')
                setIsLoggedIn(false)
                router.push('/login')
            }
            setIsLoading(false)
        }
        checkToken()
    }, [])

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>
    return (
        children
    )
}