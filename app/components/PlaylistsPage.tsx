'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Playlist = {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  external_urls: { spotify: string };
  owner: { id: string };
};

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch('/api/spotify-login/playlists');
        if (!res.ok) throw new Error('Failed to fetch playlists');
        const allPlaylists: Playlist[] = await res.json();

        const creatorId = '22uv452vf26v4fxk7auekggyi';

        const createdByMe = allPlaylists.filter(
          (playlist) => playlist.owner.id === creatorId
        );
        const savedPlaylists = allPlaylists.filter(
          (playlist) => playlist.owner.id !== creatorId
        );

        setPlaylists(createdByMe);
        setSavedPlaylists(savedPlaylists);
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

      <h2 className='text-xl font-semibold mb-4'>Created by Soshi</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10'>
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
              width={300}
              height={300}
              className='w-full h-72 object-cover'
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

      <h2 className='text-xl font-semibold mb-4'>Saved Playlists</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {savedPlaylists.map((playlist) => (
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
              width={300}
              height={300}
              className='w-full h-72 object-cover'
            />
            <div className='p-3'>
              <h2 className='text-md font-semibold text-gray-900 dark:text-white mb-1'>
                {playlist.name}
              </h2>
              {playlist.description && (
                <p className='text-xs text-gray-600 dark:text-gray-300 line-clamp-2'>
                  {playlist.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
