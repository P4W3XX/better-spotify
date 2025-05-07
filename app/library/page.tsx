'use client'

import { useTokenStore } from "@/store/token"


export default function Page() {
    const accessToken = useTokenStore((state) => state.accessToken);

    console.log('Access Token:', accessToken)
    return (
        <div>
            <h1 className="text-3xl font-bold underline">Library</h1>
            <p className="text-2xl">Access Token: {accessToken}</p>
            <p className="text-2xl">Access Token: {accessToken}</p>
        </div>
    )
}