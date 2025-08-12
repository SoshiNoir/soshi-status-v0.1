'use client';

import type { Metadata } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import './globals.css';
import Providers from './providers';
import useDarkMode from './useDarkMode';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: 'Stoshi',
    template: '%s | Stoshi',
  },
  description: 'A dashboard to track Soshi’s state — awake, fed, and hydrated.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Stoshi Dashboard',
    description: 'Track Soshi’s status in real time.',
    url: 'https://yourdomain.com',
    siteName: 'Stoshi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Stoshi status preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stoshi Dashboard',
    description: 'Track Soshi’s status in real time.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <html lang='en' className='scroll-smooth'>
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-gray-900 dark:text-white`}
      >
        <Providers>
          <Header
            isDark={isDark}
            setIsDark={setIsDark}
            authStatus={authStatus}
            session={session}
            onSignIn={() => signIn('github')}
            onSignOut={() => signOut()}
            isSpotifyConnected={isSpotifyConnected}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
