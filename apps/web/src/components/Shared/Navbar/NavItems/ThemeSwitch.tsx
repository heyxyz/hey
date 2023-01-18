import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import type { FC } from 'react';
import React from 'react';
import { SYSTEM } from 'src/tracking';

type Props = {
  onClick?: () => void;
  className?: string;
};

const ThemeSwitch: FC<Props> = ({ onClick, className = '' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className={clsx('flex px-4 py-1.5 text-sm w-full text-gray-700 dark:text-gray-200', className)}
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        Analytics.track(SYSTEM.SWITCH_THEME, { mode: theme });
        onClick?.();
      }}
    >
      <div className="flex items-center space-x-1.5">
        {theme === 'light' ? (
          <>
            <MoonIcon className="w-4 h-4" />
            <div>
              <Trans>Dark mode</Trans>
            </div>
          </>
        ) : (
          <>
            <SunIcon className="w-4 h-4" />
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
