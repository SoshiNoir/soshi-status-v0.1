'use client';

import Image from 'next/image';

type StatusCardProps = {
  title: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  status: boolean;
  textYes: string;
  textNo: string;
  imageYes: string;
  imageNo: string;
  isAdmin?: boolean;
  onToggleStatus?: () => void;
  switchLabel?: string;
};

export default function StatusCard({
  title,
  isExpanded,
  onToggleExpand,
  status,
  textYes,
  textNo,
  imageYes,
  imageNo,
  isAdmin = false,
  onToggleStatus,
  switchLabel = 'Toggle status',
}: StatusCardProps) {
  return (
    <section className='status-card w-full max-w-2xl rounded-lg bg-gray-900/80 ring-1 ring-gray-800 backdrop-blur-sm shadow-md overflow-hidden'>
      {/* Header */}
      <button
        type='button'
        onClick={onToggleExpand}
        className='w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-left'
        aria-expanded={isExpanded}
      >
        <h2 className='text-white text-lg sm:text-xl font-semibold'>{title}</h2>
        <span
          className='ml-3 inline-flex h-7 w-7 items-center justify-center rounded-md bg-gray-800 text-gray-200 ring-1 ring-gray-700'
          aria-hidden='true'
        >
          {isExpanded ? '▾' : '▸'}
        </span>
      </button>

      {/* Divider */}
      <div className='h-px bg-gray-800' />

      {/* Content (dropdown) */}
      {isExpanded && (
        <div className='px-4 py-4 sm:px-5 sm:py-5 bg-gray-900'>
          <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            <div className='flex-1'>
              <p className='text-gray-200'>{status ? textYes : textNo}</p>

              {isAdmin && onToggleStatus && (
                <div className='mt-4'>
                  <button
                    onClick={onToggleStatus}
                    className='inline-flex items-center gap-2 rounded-md bg-gray-800 text-gray-100 px-3 py-1.5 text-sm ring-1 ring-gray-700 hover:bg-gray-700 hover:text-white transition-colors'
                    aria-label={switchLabel}
                  >
                    <span
                      className='text-xs h-2 w-2 rounded-full'
                      style={{
                        backgroundColor: status ? '#22c55e' : '#ef4444',
                      }}
                    />
                    {status ? 'Marcar como não' : 'Marcar como sim'}
                  </button>
                </div>
              )}
            </div>

            <div className='flex-shrink-0 overflow-hidden rounded-md ring-1 ring-gray-800'>
              {/* Use next/image if your paths are static and public */}
              <Image
                src={status ? imageYes : imageNo}
                alt=''
                width={160}
                height={160}
                className='object-cover bg-gray-800'
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
