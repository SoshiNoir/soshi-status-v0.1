// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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
      <body
        className={`${inter.className} bg-white text-gray-900 dark:bg-gray-900 dark:text-white`}
      >
        {/* Wrap children with Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
