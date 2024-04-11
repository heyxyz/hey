import type { FC } from 'react';

import { APP_NAME } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import showCrisp from '@lib/showCrisp';
import Link from 'next/link';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import urlcat from 'urlcat';

const Footer: FC = () => {
  const { staffMode } = useFeatureFlagsStore();

  return (
    <footer className={cn(staffMode ? 'top-28' : 'top-20', 'sticky text-sm')}>
      <div className="mt-4 flex flex-wrap gap-x-[12px] gap-y-2 px-3 lg:px-0">
        <span className="ld-text-gray-500 font-bold">
          &copy; {new Date().getFullYear()} {APP_NAME}.xyz
        </span>
        <Link className="outline-offset-4" href="/terms">
          Terms
        </Link>
        <Link className="outline-offset-4" href="/privacy">
          Privacy
        </Link>
        <Link
          className="outline-offset-4"
          href="https://hey.xyz/discord"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DISCORD)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Discord
        </Link>
        <Link
          className="outline-offset-4"
          href="https://status.hey.xyz"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_STATUS)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Status
        </Link>
        <Link
          className="outline-offset-4"
          href="https://feedback.hey.xyz"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_FEEDBACK)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Feedback
        </Link>
        <Link className="outline-offset-4" href="/rules">
          Rules
        </Link>
        <Link
          className="outline-offset-4"
          href="https://github.com/heyxyz/hey"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_GITHUB)}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </Link>
        <button className="outline-offset-4" onClick={showCrisp}>
          Support
        </button>
      </div>
      <div className="mt-4">
        <Link
          className="outline-offset-4 hover:font-bold focus:font-bold"
          href={urlcat('https://vercel.com', {
            utm_campaign: 'oss',
            utm_source: APP_NAME
          })}
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_VERCEL)}
          rel="noreferrer noopener"
          target="_blank"
        >
          ▲ Powered by Vercel
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
