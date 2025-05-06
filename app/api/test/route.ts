export async function GET() {
  return new Response(JSON.stringify({ value: "test" }), {
    headers: { "Content-Type": "application/json" },
  });
}