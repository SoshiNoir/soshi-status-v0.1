'use client';

import { Session } from 'next-auth';
import Link from 'next/link';

type HeaderProps = {
  isDark: boolean;
  setIsDark: (updater: (prev: boolean) => boolean) => void;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  session: Session | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSpotifyConnected: boolean;
};

export default function Header({
  isDark,
  setIsDark,
  authStatus,
  onSignIn,
  onSignOut,
  isSpotifyConnected,
}: HeaderProps) {
  const playlistLink = isSpotifyConnected ? '/playlists' : '/api/spotify-login';

  return (
    <header className='sticky top-0 z-10 w-full bg-gray-100 dark:bg-gray-900 shadow-sm'>
      <div className='max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4'>
        {/* Left: Theme toggle */}
        <button
          onClick={() => setIsDark((d) => !d)}
          className='flex items-center gap-2 px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm'
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '🌙 Dark' : '☀️ Light'}
        </button>

        {/* Center: Playlists link */}
        <Link
          href={playlistLink}
          className='text-base sm:text-lg font-semibold text-green-700 dark:text-green-400 hover:underline transition-colors'
        >
          🎵 Playlists
        </Link>

        {/* Right: Auth buttons */}
        <div className='flex-shrink-0'>
          {authStatus === 'loading' ? (
            <span className='text-gray-600 dark:text-gray-300 text-sm'>
              Carregando...
            </span>
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
