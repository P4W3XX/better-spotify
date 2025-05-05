import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const cookieName = url.searchParams.get("key");
  const cookieValue = cookieName ? cookieStore.get(cookieName)?.value : null;

  return new Response(JSON.stringify({ value: cookieValue }), {
    headers: { "Content-Type": "application/json" },
  });
}
