'use client';

import { Switch } from '@headlessui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

type StatusData = { isAwake: boolean };

// fetchStatus retorna Promise<StatusData>
const fetchStatus = async (): Promise<StatusData> => {
  const res = await fetch('/api/status');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// updateStatus retorna Promise<void>, recebe boolean
const updateStatus = async (isAwake: boolean): Promise<void> => {
  await fetch('/api/status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAwake }),
  });
};

export default function HomePage() {
  const { data: session, status: authStatus } = useSession();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<StatusData, Error>({
    queryKey: ['soshiStatus'],
    queryFn: fetchStatus,
  });

  const mutation = useMutation<void, Error, boolean>({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soshiStatus'] });
    },
  });

  const isAwake = data?.isAwake ?? false;
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const handleToggle = () => {
    mutation.mutate(!isAwake);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-center px-4 sm:px-8 py-8 max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto relative'>
      <div className='flex flex-col items-center space-y-8'>
        {isLoading ? (
          <p className='text-1xl text-gray-400 text-center'>
            Verificando o estado do Soshi...
          </p>
        ) : isError ? (
          <p className='text-2xl text-red-500 text-center'>
            Erro ao buscar o Soshi!
          </p>
        ) : (
          <>
            <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold text-center'>
              Soshi está acordado?
            </h1>
            <p
              className={`mt-4 font-extrabold ${
                isAwake ? 'text-green-400' : 'text-blue-400'
              } text-6xl sm:text-7xl md:text-9xl text-center`}
            >
              {isAwake ? 'Sim, está acordado' : 'Não, está a mimir.'}
            </p>
            <div className='mt-8 w-full max-w-[200px] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-square relative'>
              <Image
                src={isAwake ? '/acordado.png' : '/amimir.png'}
                alt={isAwake ? 'Soshi acordado' : 'Soshi dormindo'}
                layout='fill'
                objectFit='contain'
                priority
              />
            </div>
          </>
        )}
        {isAdmin && !isLoading && !isError && (
          <div className='mt-8 p-4 border border-dashed border-gray-600 rounded-lg flex items-center space-x-4'>
            <span className='font-bold text-sm sm:text-base'>
              Admin Control:
            </span>
            <span
              className={`${
                !isAwake ? 'text-blue-400' : 'text-gray-500'
              } text-sm`}
            >
              Amimir
            </span>
            <Switch
              checked={isAwake}
              onChange={handleToggle}
              disabled={mutation.isPending}
              className={`$${
                isAwake ? 'bg-green-500' : 'bg-blue-600'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50`}
            >
              <span
                className={`$${
                  isAwake ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
            <span
              className={`$${
                isAwake ? 'text-green-400' : 'text-gray-500'
              } text-sm`}
            >
              Acordado
            </span>
          </div>
        )}
      </div>

      <div className='mt-10 flex justify-center w-full'>
        {authStatus === 'loading' ? (
          <span className='text-gray-400'>...</span>
        ) : session ? (
          <button
            onClick={() => signOut()}
            className='px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base'
          >
            Sair
          </button>
        ) : (
          <button
            onClick={() => signIn('github')}
            className='px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base'
          >
            Admin Login
          </button>
        )}
      </div>
    </main>
  );
}
