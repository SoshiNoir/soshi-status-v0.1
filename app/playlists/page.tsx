'use client';

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
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
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
    <div
      key={playlist.id}
      className='relative group w-[160px] aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-500 cursor-pointer'
    >
      {/* Base Image */}
      <img
        src={playlist.images[0]?.url || '/default-playlist.png'}
        alt={playlist.name}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/default-playlist.png';
        }}
        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.5] group-hover:z-50 group-hover:rounded-xl'
      />

      {/* Expanded Overlay */}
      <div className='absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50 flex flex-col justify-center items-center text-white p-4'>
        <h2 className='text-xl font-bold mb-2 text-center'>{playlist.name}</h2>
        {playlist.description && (
          <p className='text-sm text-center'>{playlist.description}</p>
        )}
      </div>

      {/* Expansion Effect */}
      <div className='absolute inset-0 transition-all duration-500 group-hover:scale-[5] group-hover:z-40 group-hover:rounded-xl'></div>
    </div>
  );

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold mb-8 text-center'>
        Your Spotify Playlists
      </h1>

      {/* 🎁 Soshi's Playlists Wrapped in a Card */}
      <section className='mb-12 flex justify-center'>
        <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-300 dark:border-gray-700 p-6 w-full max-w-6xl'>
          <h2 className='text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white'>
            Created by Soshi
          </h2>
          <div className='flex flex-wrap justify-center gap-6'>
            {playlists.map(renderCard)}
          </div>
        </div>
      </section>

      {/* 📦 Saved Playlists Below */}
      <section className='flex justify-center'>
        <div className='w-full max-w-6xl'>
          <h2 className='text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white'>
            Saved Playlists
          </h2>
          <div className='flex flex-wrap justify-center gap-6'>
            {savedPlaylists.map(renderCard)}
          </div>
        </div>
      </section>

      {/* 🖼️ Fullscreen Modal */}
      {activePlaylist && (
        <div
          className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6'
          onClick={() => setActivePlaylist(null)}
        >
          <div className='bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-md w-full overflow-hidden'>
            <img
              src={activePlaylist.images[0]?.url || '/default-playlist.png'}
              alt={activePlaylist.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/default-playlist.png';
              }}
              className='w-full h-64 object-cover'
            />
            <div className='p-4'>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                {activePlaylist.name}
              </h2>
              {activePlaylist.description && (
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  {activePlaylist.description}
                </p>
              )}
              <a
                href={activePlaylist.external_urls.spotify}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline text-sm'
              >
                Open in Spotify →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
