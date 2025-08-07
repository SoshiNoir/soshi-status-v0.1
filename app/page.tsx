'use client';
import { Switch } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import './globals.css';
import useDarkMode from './useDarkMode';

type StatusData = { isAwake: boolean; hasEaten: boolean };

const fetchStatus = async (): Promise<StatusData> => {
  const res = await fetch('/api/status');
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
};

const updateAwakeStatus = async (isAwake: boolean): Promise<void> => {
  await fetch('/api/status/awake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAwake }),
  });
};

const updateEatStatus = async (hasEaten: boolean): Promise<void> => {
  await fetch('/api/status/eat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hasEaten }),
  });
};

export default function HomePage() {
  const [isDark, setIsDark] = useDarkMode();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const { data: session, status: authStatus } = useSession();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery<StatusData, Error>({
    queryKey: ['soshiStatus'],
    queryFn: fetchStatus,
  });

  const awakeMutation = useMutation<void, Error, boolean>({
    mutationFn: updateAwakeStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['soshiStatus'] }),
  });

  const eatMutation = useMutation<void, Error, boolean>({
    mutationFn: updateEatStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['soshiStatus'] }),
  });

  const isAwake = data?.isAwake ?? false;
  const hasEaten = data?.hasEaten ?? false;
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const [awakeExpanded, setAwakeExpanded] = useState(false);
  const [eatExpanded, setEatExpanded] = useState(false);

  if (!mounted) return null;
  if (isLoading) return <p className='text-gray-900'>Loading...</p>;
  if (isError) return <p className='text-red-600'>Error loading status.</p>;

  const renderSwitch = (
    checked: boolean,
    onChange: () => void,
    label: string
  ) => (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-12 items-center rounded-full transition-colors`}
    >
      <span className='sr-only'>{label}</span>
      <span
        className={`${
          checked ? 'translate-x-7' : 'translate-x-1'
        } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
      />
    </Switch>
  );

  return (
    <main className='relative min-h-screen p-4 flex flex-col items-center space-y-8 bg-gray-100 dark:bg-gray-900 dark:text-gray-100'>
      <div className='absolute top-4 right-4 z-10 flex items-center space-x-4'>
        <button
          onClick={() => setIsDark((d) => !d)}
          className='px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs sm:text-sm'
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '🌙 Dark' : '☀️ Light'}
        </button>
        {authStatus === 'loading' ? (
          <span className='text-gray-600 dark:text-gray-300'>...</span>
        ) : session ? (
          <button
            onClick={() => signOut()}
            className='bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700'
          >
            Sair
          </button>
        ) : (
          <button
            onClick={() => signIn('github')}
            className='bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-700'
          >
            Admin Login
          </button>
        )}
      </div>

      {/* Acordado */}
      <div className='w-full max-w-md border rounded-lg shadow-md overflow-hidden bg-gray-200 dark:bg-gray-800'>
        <button
          onClick={() => setAwakeExpanded(!awakeExpanded)}
          className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center'
        >
          Soshi está acordado?
          <span>{awakeExpanded ? '▲' : '▼'}</span>
        </button>
        {awakeExpanded && (
          <div className='p-4 bg-gray-100 dark:bg-gray-700 text-center space-y-4'>
            <p className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              {isAwake ? 'Sim!' : 'Não, está amimir.'}
            </p>
            <div className='w-36 h-36 relative mx-auto'>
              <Image
                src={isAwake ? '/acordado.png' : '/amimir.png'}
                alt=''
                layout='fill'
                objectFit='contain'
              />
            </div>
            {isAdmin &&
              renderSwitch(
                isAwake,
                () => awakeMutation.mutate(!isAwake),
                'Toggle awake'
              )}
          </div>
        )}
      </div>

      {/* Comeu hoje */}
      <div className='w-full max-w-md border rounded-lg shadow-md overflow-hidden bg-gray-200 dark:bg-gray-800'>
        <button
          onClick={() => setEatExpanded(!eatExpanded)}
          className='w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-left font-semibold text-gray-900 dark:text-gray-100 flex justify-between items-center'
        >
          Comeu hoje?
          <span>{eatExpanded ? '▲' : '▼'}</span>
        </button>
        {eatExpanded && (
          <div className='p-4 bg-gray-100 dark:bg-gray-700 text-center space-y-4'>
            <p className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
              {hasEaten ? 'Sim, o Soshi comeu' : 'Não, o Soshi não comeu'}
            </p>
            <div className='w-36 h-36 relative mx-auto'>
              <Image
                src={hasEaten ? '/comeu.gif' : '/naocomeu.png'}
                alt=''
                layout='fill'
                objectFit='contain'
              />
            </div>
            {isAdmin &&
              renderSwitch(
                hasEaten,
                () => eatMutation.mutate(!hasEaten),
                'Toggle eaten'
              )}
          </div>
        )}
      </div>
    </main>
  );
}
