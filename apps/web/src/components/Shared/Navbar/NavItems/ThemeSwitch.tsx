import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { SYSTEM } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useTheme } from '@hooks/theme';
import { type FC } from 'react';

interface ThemeSwitchProps {
  onClick?: () => void;
  className?: string;
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ onClick, className = '' }) => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-left text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        Leafwatch.track(SYSTEM.SWITCH_THEME, {
          mode: theme === 'light' ? 'dark' : 'light'
        });
        onClick?.();
      }}
    >
      {theme === 'light' ? (
        <>
          <MoonIcon className="h-4 w-4" />
          <div>Dark mode</div>
        </>
      ) : (
        <>
          <SunIcon className="h-4 w-4" />
          <div>Light mode</div>
        </>
      )}
    </button>
  );
};

export default ThemeSwitch;
