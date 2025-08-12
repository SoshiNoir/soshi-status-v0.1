import { NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";

export async function GET() {
  const scopes = ["playlist-read-private", "playlist-read-collaborative"];

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID!,
  });

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, "some-random-state");
  return NextResponse.redirect(authorizeURL);
}
