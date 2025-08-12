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
  const [savedPlaylists, setSavedPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch('/api/spotify-login/playlists');
        if (!res.ok) throw new Error('Failed to fetch playlists');
        const allPlaylists: Playlist[] = await res.json();

        const creatorId = '22uv452vf26v4fxk7auekggyi';
        setPlaylists(allPlaylists.filter((p) => p.owner.id === creatorId));
        setSavedPlaylists(allPlaylists.filter((p) => p.owner.id !== creatorId));
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

  const renderCard = (playlist: Playlist) => (
    <a
      key={playlist.id}
      href={playlist.external_urls.spotify}
      target='_blank'
      rel='noopener noreferrer'
      className='group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700'
    >
      <div className='relative w-full aspect-square'>
        <Image
          src={playlist.images[0]?.url || '/default-playlist.png'}
          alt={playlist.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/default-playlist.png';
          }}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      <div className='absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
        <h3 className='text-white text-sm font-semibold mb-1'>
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className='text-gray-200 text-xs line-clamp-none'>
            {playlist.description}
          </p>
        )}
      </div>
    </a>
  );

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        Your Spotify Playlists
      </h1>

      {/* 🎁 Soshi's Playlists Wrapped in a Card */}
      <section className='mb-12 flex justify-center'>
        <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 w-full max-w-6xl'>
          <h2 className='text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-white'>
            Created by Soshi
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center'>
            {playlists.map(renderCard)}
          </div>
        </div>
      </section>

      {/* 📦 Saved Playlists Below */}
      <section className='flex justify-center'>
        <div className='w-full max-w-6xl'>
          <h2 className='text-xl font-semibold mb-4 text-center text-gray-900 dark:text-white'>
            Saved Playlists
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center'>
            {savedPlaylists.map(renderCard)}
          </div>
        </div>
      </section>
    </div>
  );
}
