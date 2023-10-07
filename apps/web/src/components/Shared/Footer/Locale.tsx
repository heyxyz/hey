import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Localstorage } from '@hey/data/storage';
import { MISCELLANEOUS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useLingui } from '@lingui/react';
import type { FC } from 'react';
import { useCallback, useRef } from 'react'; // Remove useState and useEffect
import { SUPPORTED_LOCALES } from 'src/i18n';
import { usePreferencesStore } from 'src/store/preferences';

import MenuTransition from '../MenuTransition';

const Locale: FC = () => {
  const { i18n } = useLingui();
  const isStaff = usePreferencesStore((state) => state.isStaff);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const gatedLocales = ['fr', 'ru', 'ta'];
  const locales = Object.fromEntries(
    Object.entries(SUPPORTED_LOCALES).filter(([key]) =>
      isStaff ? true : !gatedLocales.includes(key)
    )
  );

  const setLanguage = useCallback((locale: string) => {
    localStorage.setItem(Localstorage.LocaleStore, locale);
    location.reload();
  }, []);

  // Calculate whether to open the dropdown upwards or downwards initially
  const initialOpenUpwards =
    dropdownRef.current &&
    dropdownRef.current.getBoundingClientRect().bottom > window.innerHeight;

  return (
    <Menu as="span">
      <Menu.Button
        className="inline-flex items-center space-x-1"
        data-testid="locale-selector"
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span>{locales[i18n.locale]}</span>
      </Menu.Button>
      <MenuTransition>
        <Menu.Items
          static
          className={`absolute mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900 ${
            initialOpenUpwards ? 'bottom-full' : '' // Add a CSS class to open upwards initially
          }`}
          ref={dropdownRef} // Attach the ref to the dropdown
          data-testid="locale-selector-menu"
        >
          {Object.entries(locales).map(([localeCode, localeName]) => (
            <Menu.Item
              key={localeCode}
              as="div"
              onClick={() => {
                setLanguage(localeCode);
                Leafwatch.track(MISCELLANEOUS.SELECT_LOCALE, {
                  locale: localeCode
                });
                location.reload();
              }}
              className={({ active }: { active: boolean }) =>
                cn({ 'dropdown-active': active }, 'menu-item')
              }
            >
              {localeName}
            </Menu.Item>
          ))}
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default Locale;
