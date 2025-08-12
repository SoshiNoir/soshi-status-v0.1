import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET() {
  const cookieStore = await cookies();
  const access_token = cookieStore.get("spotify_access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ error: "Access token required" }, { status: 400 });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(access_token);

  try {
    const playlistsData = await spotifyApi.getUserPlaylists();
    return NextResponse.json(playlistsData.body.items);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}
