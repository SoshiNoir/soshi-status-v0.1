'use client';

import { Session } from 'next-auth';

type HeaderProps = {
  isDark: boolean;
  setIsDark: (updater: (prev: boolean) => boolean) => void;
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  session: Session | null;
  onSignIn: () => void;
  onSignOut: () => void;
};

export default function Header({
  isDark,
  setIsDark,
  authStatus,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  return (
    <div className='sticky top-0 z-10 w-full flex flex-row items-center justify-end gap-2 p-4 bg-gray-100 dark:bg-gray-800'>
      <button
        onClick={() => setIsDark((d) => !d)}
        className='px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs sm:text-sm'
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '🌙 Dark' : '☀️ Light'}
      </button>

      {authStatus === 'loading' ? (
        <span className='text-gray-600 dark:text-gray-300'>...</span>
      ) : authStatus === 'authenticated' ? (
        <button
          onClick={onSignOut}
          className='bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700'
        >
          Sair
        </button>
      ) : (
        <button
          onClick={onSignIn}
          className='bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700'
        >
          Admin Login
        </button>
      )}
    </div>
  );
}
