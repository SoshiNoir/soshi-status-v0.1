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
    <div className='w-full max-w-md border border-gray-800 rounded-lg shadow-md overflow-hidden bg-gray-900'>
      {/* Header */}
      <button
        onClick={onToggleExpand}
        className='w-full px-4 py-2 bg-gray-800 text-left font-extrabold text-gray-100 md:text-xl flex justify-between items-center hover:bg-gray-700 transition-colors'
      >
        {title}
        <span className='text-gray-400'>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className='flex flex-col items-center py-8 bg-gray-900'>
          <span
            className={`${
              status ? 'text-green-400' : 'text-blue-400'
            } font-extrabold text-3xl md:text-5xl text-center leading-tight mb-4`}
          >
            {status ? textYes : textNo}
          </span>

          <div className='w-64 h-64 relative mx-auto rounded-lg overflow-hidden bg-gray-800'>
            <Image
              src={status ? imageYes : imageNo}
              alt={title}
              fill
              className='object-contain'
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
