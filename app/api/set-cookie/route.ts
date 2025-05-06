import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const cookieKey = url.searchParams.get("key");
  const cookieValue = url.searchParams.get("value");

  if (cookieKey && cookieValue) {
    cookieStore.set(cookieKey, cookieValue, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 7), // 7 days
    });

    return new Response(JSON.stringify({ value: cookieValue }), {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    return new Response(
      JSON.stringify({ error: "Missing key or value parameters" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
