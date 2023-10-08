import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Localstorage } from '@hey/data/storage';
import { MISCELLANEOUS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { useLingui } from '@lingui/react';
import type { FC } from 'react';
import { useCallback } from 'react';
import { SUPPORTED_LOCALES } from 'src/i18n';
import { usePreferencesStore } from 'src/store/preferences';

import { usePopper } from '../../../hooks/usePopper';
import MenuTransition from '../MenuTransition';

const Locale: FC = () => {
  const { i18n } = useLingui();
  const isStaff = usePreferencesStore((state) => state.isStaff);

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

  const [popperTrigger, popperContainer] = usePopper({
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'toggle-placement',
        enabled: true,
        phase: 'main',
        fn: ({ state, instance }) => {
          const popperElement = state?.elements?.popper;
          const popperHeight = popperElement.clientHeight || 105;
          const referenceElement = state?.elements?.reference;
          const referenceElementDistance =
            referenceElement?.getBoundingClientRect()?.bottom + popperHeight;
          const windowHeight = window.innerHeight;
          const togglePlacement = referenceElementDistance - windowHeight > 0;
          if (togglePlacement) {
            if (state.placement === 'bottom-start') {
              instance.setOptions({
                placement: 'top-start'
              });
            }
          } else {
            if (state.placement === 'top-start') {
              instance.setOptions({
                placement: 'bottom-start'
              });
            }
          }
        }
      },
      {
        name: 'preventOverflow'
      }
    ]
  });

  return (
    <Menu as="span">
      <Menu.Button
        className="inline-flex items-center space-x-1"
        data-testid="locale-selector"
        ref={popperTrigger}
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span>{locales[i18n.locale]}</span>
      </Menu.Button>
      <div ref={popperContainer}>
        <MenuTransition>
          <Menu.Items
            static
            className="mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
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
      </div>
    </Menu>
  );
};

export default Locale;
