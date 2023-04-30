import { useFeature } from '@growthbook/growthbook-react';
import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/outline';
import { setLocale, supportedLocales } from '@lib/i18n';
import { Mixpanel } from '@lib/mixpanel';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { FeatureFlag } from 'data';
import type { FC } from 'react';
import { MISCELLANEOUS } from 'src/tracking';

import MenuTransition from '../MenuTransition';

const Locale: FC = () => {
  const { i18n } = useLingui();
  const { on: isGatedLocalesEnabled } = useFeature(
    FeatureFlag.GatedLocales as string
  );
  const gatedLocales = ['ta', 'es', 'kn', 'ru'];
  const locales = Object.fromEntries(
    Object.entries(supportedLocales).filter(([key]) =>
      isGatedLocalesEnabled ? true : !gatedLocales.includes(key)
    )
  );

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
          className="absolute mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          data-testid="locale-selector-menu"
        >
          {Object.entries(locales).map(([localeCode, localeName]) => (
            <Menu.Item
              key={localeCode}
              as="div"
              onClick={() => {
                setLocale(localeCode);
                Mixpanel.track(MISCELLANEOUS.SELECT_LOCALE, {
                  locale: localeCode
                });
              }}
              className={({ active }: { active: boolean }) =>
                clsx({ 'dropdown-active': active }, 'menu-item')
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
