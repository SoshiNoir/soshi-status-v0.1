'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Playlist = {
  id: string;
  name: string;
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
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Spotify Playlists</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {playlists.map((playlist) => (
          <a
            key={playlist.id}
            href={playlist.external_urls.spotify}
            target='_blank'
            rel='noopener noreferrer'
            className='bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden'
          >
            <Image
              src={playlist.images[0]?.url || '/default-playlist.png'}
              alt={playlist.name}
              width={500}
              height={300}
              className='w-full h-48 object-cover'
            />
            <div className='p-4'>
              <h2 className='text-lg font-semibold'>{playlist.name}</h2>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
