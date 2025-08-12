'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Playlist = {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  external_urls: { spotify: string };
};

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch('/api/spotify-login/playlists');
        if (!res.ok) throw new Error('Failed to fetch playlists');
        const data: Playlist[] = await res.json();
        setPlaylists(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading)
    return (
      <div className='text-center mt-10 text-lg'>Loading playlists...</div>
    );
  if (error)
    return <div className='text-center mt-10 text-red-500'>{error}</div>;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
      {playlists.map((playlist) => (
        <a
          key={playlist.id}
          href={playlist.external_urls.spotify}
          target='_blank'
          rel='noopener noreferrer'
          className='bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700'
        >
          <Image
            src={playlist.images[0]?.url || '/default-playlist.png'}
            alt={playlist.name}
            width={500}
            height={300}
            className='w-full h-48 object-cover'
          />
          <div className='p-4'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {playlist.name}
            </h2>
            {playlist.description && (
              <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-3'>
                {playlist.description}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
