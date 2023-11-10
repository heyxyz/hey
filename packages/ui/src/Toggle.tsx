import { Switch } from '@headlessui/react';
import type { FC } from 'react';

import cn from '../cn';

interface ToggleProps {
  on: boolean;
  setOn: (on: boolean) => void;
  disabled?: boolean;
}

export const Toggle: FC<ToggleProps> = ({ on, setOn, disabled = false }) => {
  return (
    <Switch
      checked={on}
      onChange={() => {
        setOn(!on);
      }}
      className={cn(
        on ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-50',
        'outline-brand-500 inline-flex h-[22px] w-[42.5px] min-w-[42.5px] rounded-full border-2 border-transparent outline-offset-4 transition-colors duration-200 ease-in-out'
      )}
      disabled={disabled}
    >
      <span
        className={cn(
          on ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  );
};
