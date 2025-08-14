'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import NavButton from './NavButton';

export default function Header() {
  const { data: session, status: authStatus } = useSession();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  const playlistLink = '/playlists';

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    if (open) {
      setTimeout(() => firstLinkRef.current?.focus(), 50);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className='sticky top-0 z-20 w-full bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 shadow-sm'>
        <div className='max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4'>
          {/* Left: Home */}
          <NavButton
            onClick={() => router.push('/')}
            color='text-white'
            border='border-gray-500'
            hoverBg='hover:bg-gray-800'
            hoverText='hover:text-green-400'
          >
            Home
          </NavButton>

          {/* Right: Desktop nav */}
          <nav className='hidden md:flex items-center gap-4'>
            <NavButton
              onClick={() => router.push(playlistLink)}
              color='text-green-400'
              border='border-green-500'
              hoverBg='hover:bg-green-600'
              hoverText='hover:text-white'
            >
              Playlists
            </NavButton>

            {authStatus === 'loading' ? (
              <span className='text-gray-300 text-sm'>Carregando...</span>
            ) : authStatus === 'authenticated' ? (
              <NavButton
                onClick={() => signOut()}
                color='text-red-400'
                border='border-red-500'
                hoverBg='hover:bg-red-600'
                hoverText='hover:text-white'
              >
                Sair
              </NavButton>
            ) : (
              <NavButton
                onClick={() => signIn('github')}
                color='text-green-400'
                border='border-green-500'
                hoverBg='hover:bg-green-600'
                hoverText='hover:text-white'
              >
                Admin Login
              </NavButton>
            )}
          </nav>

          {/* Burger menu */}
          <button
            onClick={() => setOpen((v) => !v)}
            className='md:hidden relative h-10 w-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 group'
            aria-label='Toggle menu'
            aria-expanded={open}
            aria-controls='mobile-menu'
          >
            <span
              className={`absolute left-2 right-2 top-3 h-0.5 rounded bg-gray-200 transition-transform duration-300 ${
                open ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-2 right-2 top-1/2 -mt-0.5 h-0.5 rounded bg-gray-200 transition-opacity duration-300 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-2 right-2 bottom-3 h-0.5 rounded bg-gray-200 transition-transform duration-300 ${
                open ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id='mobile-menu'
        className={`fixed inset-0 z-30 bg-gray-950/95 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        role='dialog'
        aria-modal='true'
      >
        <div className='max-w-screen-xl mx-auto h-full px-6 py-8 flex flex-col'>
          <div className='flex items-center justify-between'>
            <NavButton
              onClick={() => {
                closeMenu();
                router.push('/');
              }}
              color='text-white'
              border='border-gray-500'
              hoverBg='hover:bg-gray-800'
              hoverText='hover:text-green-400'
            >
              Home
            </NavButton>

            <button
              onClick={closeMenu}
              className='h-10 w-10 grid place-items-center rounded-md text-gray-200 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400'
              aria-label='Close menu'
            >
              ✕
            </button>
          </div>

          <div className='flex-1 mt-10 flex flex-col items-center justify-center gap-6'>
            <NavButton
              onClick={() => {
                closeMenu();
                router.push(playlistLink);
              }}
            >
              Playlists
            </NavButton>

            {authStatus === 'loading' ? (
              <span className='text-gray-300 text-sm'>Carregando...</span>
            ) : authStatus === 'authenticated' ? (
              <NavButton
                onClick={() => {
                  closeMenu();
                  signOut();
                }}
                color='text-red-400'
                border='border-red-500'
                hoverBg='hover:bg-red-600'
                hoverText='hover:text-white'
              >
                Sair
              </NavButton>
            ) : (
              <NavButton
                onClick={() => {
                  closeMenu();
                  signIn('github');
                }}
                color='text-green-400'
                border='border-green-500'
                hoverBg='hover:bg-green-600'
                hoverText='hover:text-white'
              >
                Admin Login
              </NavButton>
            )}
          </div>

          <div className='pb-4 flex items-center justify-center gap-6 text-gray-400 text-sm'>
            <a
              href='https://github.com/'
              target='_blank'
              rel='noreferrer'
              className='hover:text-gray-200 transition-colors'
            >
              GitHub
            </a>
            <a
              href='https://spotify.com/'
              target='_blank'
              rel='noreferrer'
              className='hover:text-gray-200 transition-colors'
            >
              Spotify
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
