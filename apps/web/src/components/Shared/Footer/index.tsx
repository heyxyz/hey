import Locale from '@components/Shared/Footer/Locale';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';

const Footer: FC = () => {
  const { allowed: staffMode } = useStaffMode();

  return (
    <footer className={`sticky text-sm leading-7 ${staffMode ? 'top-28' : 'top-20'}`} data-testid="footer">
      <div className={'mt-4 flex flex-wrap gap-x-[12px] px-3 lg:px-0'}>
        <span className="lt-text-gray-500 font-bold">
          &copy; {new Date().getFullYear()} {APP_NAME}
        </span>
        <Link href="/terms">
          <Trans>Terms</Trans>
        </Link>
        <Link href="/privacy">
          <Trans>Privacy</Trans>
        </Link>
        <a href="https://discord.com/invite/9QwXqsyAps" target="_blank" rel="noreferrer noopener">
          <Trans>ConsenSys Discord</Trans>
        </a>
        <a href="https://lenster.xyz/discord" target="_blank" rel="noreferrer noopener">
          <Trans>Lenster Discord</Trans>
        </a>
        <a href="https://lenster.xyz/donate" target="_blank" rel="noreferrer noopener">
          <Trans>Donate to Lenster</Trans>
        </a>
        <a href="https://feedback.lenster.xyz" target="_blank" rel="noreferrer noopener">
          <Trans>Feedback</Trans>
        </a>
        <a href="https://github.com/ConsenSys/lineaster" target="_blank" rel="noreferrer noopener">
          <Trans>GitHub</Trans>
        </a>
      </div>
      <div className="mt-2 flex space-x-4">
        <Locale />
      </div>
    </footer>
  );
};

export default Footer;
