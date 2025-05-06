import { cookies } from "next/headers";

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Simplified error-resistant implementation
    const url = new URL(request.url);
    const cookieName = url.searchParams.get("key");
    
    if (!cookieName) {
      return new Response(JSON.stringify({ value: 0 }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);
    const cookieValue = cookie?.value || "0";

    return new Response(JSON.stringify({ value: cookieValue }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Cookie access error:", error);
    
    // Always return a valid response, never throw
    return new Response(JSON.stringify({ value: 0 }), {
      headers: { "Content-Type": "application/json" },
      status: 200
    });
  }
}