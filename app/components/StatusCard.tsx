'use client';

import Image from 'next/image';
import { ReactNode } from 'react';
import SwitchControl from './SwitchControl';

type StatusCardProps = {
  title: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  status: boolean;
  textYes: ReactNode;
  textNo: ReactNode;
  imageYes: string;
  imageNo: string;
  isAdmin: boolean;
  onToggleStatus: () => void;
  switchLabel: string;
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
  isAdmin,
  onToggleStatus,
  switchLabel,
}: StatusCardProps) {
  return (
    <div className='w-full max-w-md border rounded-lg shadow-md overflow-hidden bg-transparent'>
      <button
        onClick={onToggleExpand}
        className='w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-left font-extrabold text-gray-800 dark:text-gray-100 md:text-xl flex justify-between items-center drop-shadow'
      >
        {title}
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {isExpanded && (
        <div className='flex flex-col items-center py-8 bg-transparent'>
          <span
            className={`${
              status ? 'text-green-400' : 'text-blue-400'
            } font-extrabold text-3xl md:text-5xl text-center leading-tight mb-4 drop-shadow`}
          >
            {status ? textYes : textNo}
          </span>
          <div className='w-64 h-64 relative mx-auto'>
            <Image
              src={status ? imageYes : imageNo}
              alt={title}
              layout='fill'
              objectFit='contain'
            />
          </div>
          {isAdmin && (
            <div className='mt-4'>
              <SwitchControl
                checked={status}
                onChange={onToggleStatus}
                label={switchLabel}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
