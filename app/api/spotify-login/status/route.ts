import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies(); // ✅ Await the promise
  const accessToken = cookieStore.get("spotify_access_token");

  return NextResponse.json({ isConnected: !!accessToken });
}
