import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import React from 'react';
import { SYSTEM } from 'src/tracking';

interface Props {
  onClick?: () => void;
  className?: string;
}

const ThemeSwitch: FC<Props> = ({ onClick, className = '' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className={clsx('flex w-full px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200', className)}
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        Analytics.track(SYSTEM.SWITCH_THEME, { mode: theme === 'light' ? 'dark' : 'light' });
        onClick?.();
      }}
    >
      <div className="flex items-center space-x-1.5">
        {theme === 'light' ? (
          <>
            <MoonIcon className="h-4 w-4" />
            <div>
              <Trans>Dark mode</Trans>
            </div>
          </>
        ) : (
          <>
            <SunIcon className="h-4 w-4" />
            <div>
              <Trans>Light mode</Trans>
            </div>
          </>
        )}
      </div>
    </button>
  );
};

export default ThemeSwitch;
