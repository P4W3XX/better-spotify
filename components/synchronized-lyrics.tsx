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
    audioRef: React.RefObject<HTMLAudioElement>;
    className?: string;
}

// Component for a single lyric line with gradient effect
const LyricLine = ({ line, currentTime, setCurrentTime, audioRef }: {
    line: LyricLine,
    currentTime: number,
    activeIndex: number,
    setCurrentTime: (time: number) => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}) => {
    const isActive = currentTime >= line.startTime && currentTime <= line.endTime;
    const hasParentheses = line.text.includes('(') && line.text.includes(')');
    const isEmpty = line.text.trim() === "";
    // Format text for display
    const displayText = isEmpty ? "..." : line.text;
    let alignment = "text-left";
    // Keep all text left-aligned regardless of content
    alignment = "text-left";

    return (
        <motion.div
            onClick={() => {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = line.startTime;
                    audioRef.current.play();
                }
                setCurrentTime(line.startTime);
                console.log(line.startTime);
            }}
            className={`py-2 my-1 text-3xl hover:bg-white/10 group rounded-2xl px-2 font-semibold transition-all duration-200 ${alignment}`}
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
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    background: 'transparent',
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
export const SynchronizedLyrics = ({ lyrics, currentTime, setCurrentTime, audioRef, className }: SynchronizedLyricsProps) => {
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
        <ScrollArea className={`w-full h-full`} ref={scrollContainerRef}>
            <div className={`px-4 pb-4 pt-8 ${className}`}>
                {lyrics.map((line, index) => (
                    <div key={index} data-index={index}>
                        <LyricLine
                            line={line}
                            currentTime={currentTime}
                            activeIndex={activeLineIndex}
                            setCurrentTime={setCurrentTime}
                            audioRef={audioRef}
                        />
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};