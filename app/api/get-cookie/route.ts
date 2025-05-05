import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const url = new URL(request.url);
    const cookieName = url.searchParams.get("key");
    const cookieValue = cookieName ? cookieStore.get(cookieName)?.value : null;

    return new Response(JSON.stringify({ value: cookieValue || 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error accessing cookies:", error);
    
    // Return a fallback value instead of throwing a 500
    return new Response(JSON.stringify({ 
      value: 0, 
      error: "Could not access cookies" 
    }), {
      headers: { "Content-Type": "application/json" },
      status: 200 // Still return 200 to prevent app breaking
    });
  }
}