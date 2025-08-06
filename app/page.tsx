// app/page.tsx
'use client';

import { Switch } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Type for our API response
type StatusData = {
  isAwake: boolean;
};

// Function to fetch the status from our API
const fetchStatus = async (): Promise<StatusData> => {
  const res = await fetch('/api/status');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

// Function to update the status via our API
const updateStatus = async (isAwake: boolean): Promise<void> => {
  await fetch('/api/status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isAwake }),
  });
};

export default function HomePage() {
  const { data: session, status: authStatus } = useSession();
  const queryClient = useQueryClient();

  // Use TanStack Query to fetch data
  const { data, isLoading, isError } = useQuery<StatusData>({
    queryKey: ['soshiStatus'],
    queryFn: fetchStatus,
  });

  // Use TanStack Query for mutations (updates)
  const mutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      // When mutation is successful, refetch the status
      queryClient.invalidateQueries({ queryKey: ['soshiStatus'] });
    },
  });

  const isAwake = data?.isAwake ?? false;
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleToggle = () => {
    // Optimistically set the state while the mutation is in flight
    // This makes the UI feel faster
    const newStatus = !isAwake;
    mutation.mutate(newStatus);
  };

  const LoginButton = () => (
    <div className='absolute top-4 right-4'>
      {authStatus === 'loading' ? (
        <div className='text-gray-400'>...</div>
      ) : session ? (
        <button
          onClick={() => signOut()}
          className='px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors'
        >
          Sair
        </button>
      ) : (
        <button
          onClick={() => signIn('github')}
          className='px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors'
        >
          Admin Login
        </button>
      )}
    </div>
  );

  const StatusDisplay = () => {
    if (isLoading)
      return (
        <p className='text-2xl text-gray-400'>
          Verificando o estado do Soshi...
        </p>
      );
    if (isError)
      return <p className='text-2xl text-red-500'>Erro ao buscar o Soshi!</p>;

    return (
      <>
        <h1 className='text-6xl font-bold text-center'>Soshi está acordado?</h1>
        <p
          className={`text-9xl font-extrabold mt-4 ${
            isAwake ? 'text-green-400' : 'text-blue-400'
          }`}
        >
          {isAwake ? 'Sim!' : 'Não, está amimir.'}
        </p>
        <div className='mt-8 relative w-80 h-80 md:w-96 md:h-96'>
          <Image
            src={isAwake ? '/acordado.png' : '/amimir.png'}
            alt={isAwake ? 'Soshi acordado' : 'Soshi dormindo'}
            layout='fill'
            objectFit='contain'
            priority
          />
        </div>
      </>
    );
  };

  const AdminSwitch = () => (
    <div className='mt-8 p-4 border border-dashed border-gray-600 rounded-lg flex items-center justify-center space-x-4'>
      <span className='font-bold'>Admin Control:</span>
      <span className={`${!isAwake ? 'text-blue-400' : 'text-gray-500'}`}>
        Amimir
      </span>
      <Switch
        checked={isAwake}
        onChange={handleToggle}
        disabled={mutation.isPending}
        className={`${
          isAwake ? 'bg-green-500' : 'bg-blue-600'
        } relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
      >
        <span
          className={`${
            isAwake ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
        />
      </Switch>
      <span className={`${isAwake ? 'text-green-400' : 'text-gray-500'}`}>
        Acordado
      </span>
    </div>
  );

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8 relative'>
      <LoginButton />
      <div className='flex flex-col items-center'>
        <StatusDisplay />
        {isAdmin && <AdminSwitch />}
      </div>
    </main>
  );
}
