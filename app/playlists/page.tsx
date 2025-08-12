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

  const renderPlaylistCard = (playlist: Playlist) => (
    <a
      key={playlist.id}
      href={playlist.external_urls.spotify}
      target='_blank'
      rel='noopener noreferrer'
      className='group bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700'
    >
      <div className='relative w-full aspect-square'>
        <Image
          src={playlist.images[0]?.url || '/default-playlist.png'}
          alt={playlist.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </div>
      <div className='p-4'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-white truncate'>
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className='text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2'>
            {playlist.description}
          </p>
        )}
      </div>
    </a>
  );

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6'>Your Spotify Playlists</h1>

      <section className='mb-10'>
        <h2 className='text-xl font-semibold mb-4'>Created by Soshi</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {playlists.map(renderPlaylistCard)}
        </div>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-4'>Saved Playlists</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
          {savedPlaylists.map(renderPlaylistCard)}
        </div>
      </section>
    </div>
  );
}
