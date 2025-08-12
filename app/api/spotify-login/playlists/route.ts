import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET() {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  try {
    // Get access token using Client Credentials Flow
    const { body } = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(body.access_token);

    // Fetch playlists from Soshi's public profile
    const userId = "22uv452vf26v4fxk7auekggyi";
    const playlistsData = await spotifyApi.getUserPlaylists(userId);

    return NextResponse.json(playlistsData.body.items);
  } catch (err) {
    console.error("Error fetching Soshi's playlists:", err);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}
