'use client'

import { useCurrentSongStore } from "@/store/current-song"
import { useEffect, useState } from "react"
import axios from "axios"

export default function DynamicTitleBar() {
    const currentSongID = useCurrentSongStore((state) => state.currentSongID)
    const [currentSongTitle, setCurrentSongTitle] = useState<string>('')

    useEffect(() => {
        const fetchSongTitle = async () => {
            if (currentSongID) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/songs/${currentSongID}`)
                    setCurrentSongTitle(response.data.title)
                } catch (error) {
                    console.error("Error fetching song title:", error)
                }
            }
        }
        fetchSongTitle()
    }, [currentSongID])
    return (
        <div className="titleBar text-white">
            {currentSongTitle ? currentSongTitle : "No song playing"}
        </div>
    )
};