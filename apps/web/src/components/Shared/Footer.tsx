import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Menu } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import { setLocale, supportedLocales } from '@lib/i18n';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import clsx from 'clsx';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { FOOTER } from 'src/tracking';

import MenuTransition from './MenuTransition';

const Footer: FC = () => {
  const { allowed: staffMode } = useStaffMode();
  const { i18n } = useLingui();

  return (
    <footer className={`sticky leading-7 text-sm ${staffMode ? 'top-28' : 'top-20'}`} data-test="footer">
      <div className={'mt-4 flex flex-wrap px-3 lg:px-0 gap-x-[12px]'}>
        <span className="font-bold lt-text-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}
        </span>
        <Link href="/privacy">
          <Trans>Terms</Trans>
        </Link>
        <Link href="/privacy">
          <Trans>Privacy</Trans>
        </Link>
        <a
          href="https://lenster.xyz/discord"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.DISCORD)}
        >
          <Trans>Discord</Trans>
        </a>
        <a
          href="https://lenster.xyz/donate"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.DONATE)}
        >
          <Trans>Donate</Trans>
        </a>
        <a
          href="https://status.lenster.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.STATUS)}
        >
          <Trans>Status</Trans>
        </a>
        <a
          href="https://feedback.lenster.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.FEEDBACK)}
        >
          <Trans>Feedback</Trans>
        </a>
        <Link href="/thanks">
          <Trans>Thanks</Trans>
        </Link>
        <a
          href="https://github.com/lensterxyz/lenster"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.GITHUB)}
        >
          <Trans>GitHub</Trans>
        </a>
        <a
          href="https://translate.lenster.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.TRANSLATE)}
        >
          <Trans>Translate</Trans>
        </a>
      </div>
      <div className="mt-2 flex space-x-4">
        <Menu as="span">
          <Menu.Button className="inline-flex items-center space-x-1">
            <GlobeAltIcon className="h-4 w-4" />
            <span>{supportedLocales[i18n.locale]}</span>
          </Menu.Button>
          <MenuTransition>
            <Menu.Items
              static
              className="absolute py-1 mt-2 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700"
            >
              {Object.entries(supportedLocales).map(([localeCode, localeName]) => (
                <Menu.Item
                  key={localeCode}
                  as="div"
                  onClick={() => {
                    setLocale(localeCode);
                    Analytics.track(`locale_changed_to_${localeCode}`);
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
        <a
          className="hover:font-bold"
          href={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Analytics.track(FOOTER.VERCEL)}
        >
          <Trans>▲ Powered by Vercel</Trans>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
