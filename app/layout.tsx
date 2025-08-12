import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import HeaderWrapper from './HeaderWrapper';
import Providers from './providers';

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
  return (
    <html lang='pt-br' className='scroll-smooth'>
      <body
        className={`${inter.className} scroll-smooth bg-gray-900 text-white`}
      >
        <Providers>
          <HeaderWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
