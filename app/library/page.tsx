export default function Page() {
    return (
        <div className="flex flex-col w-full h-full items-center justify-center gap-y-10">
            <h1 className="text-white text-3xl font-semibold">Library</h1>
            <div className="w-full h-full flex items-center justify-center">
                <img src="/library.svg" alt="Library" width={200} height={200} />
            </div>
        </div>
    )
}