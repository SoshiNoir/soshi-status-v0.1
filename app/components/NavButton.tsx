'use client';

import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';

type NavButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: string;
  border?: string;
  hoverBg?: string;
  hoverText?: string;
};

export default function NavButton({
  color = 'text-green-400',
  border = 'border-green-500',
  hoverBg = 'hover:bg-green-600',
  hoverText = 'hover:text-white',
  className,
  ...props
}: NavButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        'px-4 py-1.5 rounded-full border transition-colors text-sm font-medium cursor-pointer',
        color,
        border,
        hoverBg,
        hoverText,
        className
      )}
    />
  );
}
