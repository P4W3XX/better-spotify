import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';

interface LyricLine {
    startTime: number;
    endTime: number;
    text: string;
}

interface SynchronizedLyricsProps {
    lyrics: LyricLine[];
    currentTime: number;
    setCurrentTime: (time: number) => void;
}

// Component for a single lyric line with gradient effect
const LyricLine = ({ line, currentTime,setCurrentTime }: {
    line: LyricLine,
    currentTime: number,
    activeIndex: number,
    setCurrentTime: (time: number) => void;
}) => {
    const isActive = currentTime >= line.startTime && currentTime <= line.endTime;
    const hasParentheses = line.text.includes('(') && line.text.includes(')');
    const isEmpty = line.text.trim() === "";

    // Calculate progress percentage through this line
    const progress = isActive
        ? ((currentTime - line.startTime) / (line.endTime - line.startTime)) * 100
        : currentTime > line.endTime ? 100 : 0;

    // Format text for display
    const displayText = isEmpty ? "..." : line.text;
    let alignment = "text-left";
    // Keep all text left-aligned regardless of content
    alignment = "text-left";

    return (
        <motion.div
            onClick={() => setCurrentTime(line.startTime)}
            className={`py-2 my-1 text-3xl hover:bg-white/10 rounded-2xl px-2 font-semibold transition-all duration-200 ${alignment}`}
            initial={{ opacity: 0.5 }}
            animate={{
                opacity: isActive ? 1 : 0.5,
                scale: isActive ? 1.02 : 1,
                x: isActive ? (hasParentheses ? 5 : -5) : 0
            }}
        >
            <motion.div
                className="relative"
                animate={{
                    backgroundImage: isActive
                        ? `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.4) ${progress}%)`
                        : `linear-gradient(to right, rgba(255,255,255,0.7) 100%, rgba(255,255,255,0.7) 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: isActive ? 'blur(0px)' : 'blur(1px)',
                }}
                transition={{
                    duration: 1,
                }}
            >
                {displayText}
            </motion.div>
        </motion.div>
    );
};
export const SynchronizedLyrics = ({ lyrics, currentTime,setCurrentTime }: SynchronizedLyricsProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const activeLineIndex = lyrics.findIndex(
        line => currentTime >= line.startTime && currentTime <= line.endTime
    );

    // Auto-scroll to active lyric
    useEffect(() => {
        if (activeLineIndex >= 0 && scrollContainerRef.current) {
            const element = scrollContainerRef.current.querySelector(`[data-index="${activeLineIndex}"]`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeLineIndex]);

    return (
        <ScrollArea className="w-full h-svh pt-[6rem] pb-[5rem] overflow-hidden" ref={scrollContainerRef}>
            <div
                style={{
                    backgroundImage: `linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0) 100%)`,
                }}
                className="w-full h-[50px] absolute left-0 top-[5.9rem] z-10 pointer-events-none"
            />
            <div
                style={{
                    backgroundImage: `linear-gradient(to top, transparent 0%, rgba(0, 0, 0, 0) 100%)`,
                }}
                className="w-full h-[50px] absolute left-0 bottom-[4.9rem]"
            />

            <div className="px-4 pb-4 pt-8">

                {lyrics.map((line, index) => (
                    <div key={index} data-index={index}>
                        <LyricLine
                            line={line}
                            currentTime={currentTime}
                            activeIndex={activeLineIndex}
                            setCurrentTime={setCurrentTime}
                        />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};