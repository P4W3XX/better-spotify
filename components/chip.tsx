export default function Chip({ title, onClick, active }: { title: string, onClick: (ChipTitle: string) => void, active: string }) {
    const handleClick = () => {
        onClick(title)
    }
    return (
        <div
            className={`flex items-center ${active === title ? 'bg-white text-black hover:bg-white/85 z-10 ' : 'bg-white/10 text-white hover:bg-white/15 z-0 '} backdrop-blur-3xl max-h-10 justify-center  rounded-full w-max px-4 py-2 text-sm font-semibold cursor-pointer`}
            onClick={() => handleClick()}
        >
            {title}
        </div>
    )
}