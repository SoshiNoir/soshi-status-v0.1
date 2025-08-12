import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const access_token = data.body["access_token"];
    const refresh_token = data.body["refresh_token"];

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/playlists`);


    response.cookies.set("spotify_access_token", access_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 3600, // 1 hour
    });

    response.cookies.set("spotify_refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    console.error("Spotify callback error:", err);
    return NextResponse.json({ error: "Error getting tokens" }, { status: 400 });
  }
}
