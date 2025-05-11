'use client'
import { useState } from "react"
import { motion } from "framer-motion"

export default function Chip({ title, onClick }: { title: string, onClick: () => void }) {
    const [isActive, setIsActive] = useState(false)
    const handleClick = () => {
        setIsActive(!isActive)
        onClick()
    }
    return (
        <motion.div
            layout
            layoutId={title}
            className={`flex items-center ${isActive ? 'bg-white text-black hover:bg-white/85 order-first z-10 ' : 'bg-white/10 text-white hover:bg-white/15 z-0 '} backdrop-blur-3xl justify-center  rounded-full w-max px-4 py-2 text-sm font-semibold cursor-pointer`}
            onClick={() => handleClick()}
        >
            {title}
        </motion.div>
    )
}