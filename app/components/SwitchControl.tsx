'use client';

import { Switch } from '@headlessui/react';

type SwitchControlProps = {
  checked: boolean;
  onChange: () => void;
  label: string;
};

export default function SwitchControl({
  checked,
  onChange,
  label,
}: SwitchControlProps) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`${
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
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
}
