'use client';

import { Session } from 'next-auth';
import Link from 'next/link';

type HeaderProps = {
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  session: Session | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSpotifyConnected: boolean;
};

export default function Header({
  authStatus,
  onSignIn,
  onSignOut,
  isSpotifyConnected,
}: HeaderProps) {
  const playlistLink = isSpotifyConnected ? '/playlists' : '/api/spotify-login';

  return (
    <header className='sticky top-0 z-10 w-full bg-gray-900 shadow-sm'>
      <div className='max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4'>
        {/* Left: Brand or logo placeholder */}
        <div className='text-white font-bold text-lg'>🎵 My App</div>

        {/* Center: Playlists link */}
        <Link
          href={playlistLink}
          className='text-base sm:text-lg font-semibold text-green-400 hover:underline transition-colors'
        >
          Playlists
        </Link>

        {/* Right: Auth buttons */}
        <div className='flex-shrink-0'>
          {authStatus === 'loading' ? (
            <span className='text-gray-300 text-sm'>Carregando...</span>
          ) : authStatus === 'authenticated' ? (
            <button
              onClick={onSignOut}
              className='bg-red-600 text-white px-3 py-1.5 rounded-md shadow hover:bg-red-700 transition-colors text-sm'
            >
              Sair
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className='bg-gray-800 text-white px-3 py-1.5 rounded-md shadow hover:bg-gray-700 transition-colors text-sm'
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
