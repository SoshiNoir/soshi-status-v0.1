// app/HeaderWrapper.tsx
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import useDarkMode from './useDarkMode';

export default function HeaderWrapper() {
  const [isDark, setIsDark] = useDarkMode();
  const { data: session, status: authStatus } = useSession();
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
    const checkSpotifyConnection = async () => {
      try {
        const res = await fetch('/api/spotify-login/status');
        const data = await res.json();
        setIsSpotifyConnected(data.isConnected);
      } catch (err) {
        console.error('Failed to check Spotify connection', err);
      }
    };

    checkSpotifyConnection();
  }, []);

  return (
    <Header
      isDark={isDark}
      setIsDark={setIsDark}
      authStatus={authStatus}
      session={session}
      onSignIn={() => signIn('github')}
      onSignOut={() => signOut()}
      isSpotifyConnected={isSpotifyConnected}
    />
  );
}
