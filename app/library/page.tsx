'use client'

import { useTokenStore } from "@/store/token"


export default function Page() {
    const accessToken = useTokenStore((state) => state.accessToken);

    console.log('Access Token:', accessToken)
    return (
        <div></div>
    )
}