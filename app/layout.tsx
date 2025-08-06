// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers'; // Import the providers

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Soshi está acordado?',
  description: "The definitive source on Soshi's current state.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        {/* Wrap children with Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
