'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import StatusCard from './components/StatusCard';

type StatusData = {
  isAwake: boolean;
  hasEaten: boolean;
  hasDrunk: boolean;
};

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

const updateDrinkStatus = async (hasDrunk: boolean): Promise<void> => {
  await fetch('/api/status/drink', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hasDrunk }),
  });
};

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();
  const qc = useQueryClient();

  const [expandedCard, setExpandedCard] = useState<
    'awake' | 'eat' | 'drink' | null
  >('awake');

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const drinkMutation = useMutation<void, Error, boolean>({
    mutationFn: updateDrinkStatus,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['soshiStatus'] }),
  });

  if (!mounted) return null;

  const isAwake = data?.isAwake ?? false;
  const hasEaten = data?.hasEaten ?? false;
  const hasDrunk = data?.hasDrunk ?? false;
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (isLoading) return <p className='text-gray-300'>Loading...</p>;
  if (isError) return <p className='text-red-400'>Error loading status.</p>;

  return (
    <main className='relative min-h-screen p-4 flex flex-col items-center space-y-8 bg-gray-900 text-white'>
      <StatusCard
        title='Soshi está acordado?'
        isExpanded={expandedCard === 'awake'}
        onToggleExpand={() =>
          setExpandedCard(expandedCard === 'awake' ? null : 'awake')
        }
        status={isAwake}
        textYes='Sim, Soshi está acordado.'
        textNo='Não, Soshi está a mimir.'
        imageYes='/acordado.png'
        imageNo='/amimir.png'
        isAdmin={isAdmin}
        onToggleStatus={() => awakeMutation.mutate(!isAwake)}
        switchLabel='Toggle awake status'
      />

      <StatusCard
        title='Soshi comeu hoje?'
        isExpanded={expandedCard === 'eat'}
        onToggleExpand={() =>
          setExpandedCard(expandedCard === 'eat' ? null : 'eat')
        }
        status={hasEaten}
        textYes='Sim, Soshi comeu.'
        textNo='Não, Soshi não comeu.'
        imageYes='/comeu.gif'
        imageNo='/naocomeu.png'
        isAdmin={isAdmin}
        onToggleStatus={() => eatMutation.mutate(!hasEaten)}
        switchLabel='Toggle eaten status'
      />

      <StatusCard
        title='Soshi tomou cerveja?'
        isExpanded={expandedCard === 'drink'}
        onToggleExpand={() =>
          setExpandedCard(expandedCard === 'drink' ? null : 'drink')
        }
        status={hasDrunk}
        textYes='Sim, Soshi tomou cerveja.'
        textNo='Não, Soshi não tomou cerveja.'
        imageYes='/tomou.jpg'
        imageNo='/naotomou.jpg'
        isAdmin={isAdmin}
        onToggleStatus={() => drinkMutation.mutate(!hasDrunk)}
        switchLabel='Toggle drink status'
      />
    </main>
  );
}
