'use client';

import { Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import NavButton from './NavButton';

type HeaderProps = {
  authStatus: 'loading' | 'authenticated' | 'unauthenticated';
  session: Session | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isSpotifyConnected: boolean;
};

export default function Header(props: HeaderProps) {
  const { authStatus, onSignIn, onSignOut, isSpotifyConnected } = props;
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  const playlistLink = useMemo(
    () => (isSpotifyConnected ? '/playlists' : '/api/spotify-login'),
    [isSpotifyConnected]
  );
  const router = useRouter();

  // Lock scroll when menu is open
  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  // Close on ESC + focus first link on open
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
      {/* Top bar */}
      <header className='sticky top-0 z-20 w-full bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80 shadow-sm'>
        <div className='max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4'>
          {/* Left: Home */}
          <Link
            href='/'
            className='flex items-center gap-2 text-white font-semibold text-lg hover:text-green-400 transition-colors'
            aria-label='Home'
          >
            <span className='text-xl'>Home</span>
            <span className='hidden sm:inline'>Home</span>
          </Link>

          {/* Right: Desktop inline nav */}
          <nav className='hidden md:flex items-center gap-4'>
            <NavButton
              onClick={() => router.push('/')}
              color='text-white'
              border='border-gray-500'
              hoverBg='hover:bg-gray-800'
              hoverText='hover:text-green-400'
            >
              Home
            </NavButton>

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
                onClick={onSignOut}
                color='text-red-400'
                border='border-red-500'
                hoverBg='hover:bg-red-600'
                hoverText='hover:text-white'
              >
                Sair
              </NavButton>
            ) : (
              <NavButton
                onClick={onSignIn}
                color='text-green-400'
                border='border-green-500'
                hoverBg='hover:bg-green-600'
                hoverText='hover:text-white'
              >
                Admin Login
              </NavButton>
            )}
          </nav>

          {/* Right: Burger (mobile/tablet) */}
          <button
            onClick={() => setOpen((v) => !v)}
            className='md:hidden relative h-10 w-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 group'
            aria-label='Toggle menu'
            aria-expanded={open}
            aria-controls='mobile-menu'
          >
            {/* 3 lines */}
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

      {/* Fullscreen overlay menu */}
      <div
        id='mobile-menu'
        className={`fixed inset-0 z-30 bg-gray-950/95 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        role='dialog'
        aria-modal='true'
      >
        <div className='max-w-screen-xl mx-auto h-full px-6 py-8 flex flex-col'>
          {/* Top row: brand + close */}
          <div className='flex items-center justify-between'>
            <Link
              href='/'
              onClick={closeMenu}
              className='flex items-center gap-2 text-white font-semibold text-lg hover:text-green-400 transition-colors'
            >
              <span className='text-xl'>🏠</span>
              <span>Home</span>
            </Link>

            <button
              onClick={closeMenu}
              className='h-10 w-10 grid place-items-center rounded-md text-gray-200 hover:text-white hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400'
              aria-label='Close menu'
            >
              ✕
            </button>
          </div>

          {/* Menu content */}
          <div className='flex-1 mt-10 flex flex-col items-center justify-center'>
            <ul className='space-y-6 text-center'>
              {[
                { href: '/', label: 'Home' },
                { href: playlistLink, label: 'Playlists' },
              ].map((item, idx) => (
                <li key={item.label}>
                  <Link
                    ref={idx === 0 ? firstLinkRef : null}
                    href={item.href}
                    onClick={closeMenu}
                    className='inline-block text-3xl sm:text-4xl font-semibold text-white tracking-wide hover:text-green-300 transition-colors'
                    style={{ transitionDelay: `${0.06 * (idx + 1)}s` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className='mt-10'>
              {authStatus === 'loading' ? (
                <span className='text-gray-300 text-sm'>Carregando...</span>
              ) : authStatus === 'authenticated' ? (
                <button
                  onClick={() => {
                    closeMenu();
                    onSignOut();
                  }}
                  className='bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition-colors text-sm'
                >
                  Sair
                </button>
              ) : (
                <button
                  onClick={() => {
                    closeMenu();
                    onSignIn();
                  }}
                  className='bg-gray-800 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 transition-colors text-sm'
                >
                  Admin Login
                </button>
              )}
            </div>
          </div>

          {/* Footer (optional quick links) */}
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
