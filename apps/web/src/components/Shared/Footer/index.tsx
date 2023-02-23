import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Mixpanel } from '@lib/mixpanel';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { FOOTER } from 'src/tracking';

import Locale from './Locale';

const Footer: FC = () => {
  const { allowed: staffMode } = useStaffMode();

  return (
    <footer className={`sticky text-sm leading-7 ${staffMode ? 'top-28' : 'top-20'}`} data-test="footer">
      <div className={'mt-4 flex flex-wrap gap-x-[12px] px-3 lg:px-0'}>
        <span className="lt-text-gray-500 font-bold">
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
          onClick={() => Mixpanel.track(FOOTER.DISCORD)}
        >
          <Trans>Discord</Trans>
        </a>
        <a
          href="https://lenster.xyz/donate"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Mixpanel.track(FOOTER.DONATE)}
        >
          <Trans>Donate</Trans>
        </a>
        <a
          href="https://status.lenster.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Mixpanel.track(FOOTER.STATUS)}
        >
          <Trans>Status</Trans>
        </a>
        <a
          href="https://feedback.lenster.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Mixpanel.track(FOOTER.FEEDBACK)}
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
          onClick={() => Mixpanel.track(FOOTER.GITHUB)}
        >
          <Trans>GitHub</Trans>
        </a>
        <a
          href="https://translate.lenster.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Mixpanel.track(FOOTER.TRANSLATE)}
        >
          <Trans>Translate</Trans>
        </a>
      </div>
      <div className="mt-2 flex space-x-4">
        <Locale />
        <a
          className="hover:font-bold"
          href={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Mixpanel.track(FOOTER.VERCEL)}
        >
          <Trans>▲ Powered by Vercel</Trans>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
