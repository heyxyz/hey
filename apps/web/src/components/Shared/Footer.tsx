import type { FC } from 'react';

import { APP_NAME } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import urlcat from 'urlcat';

const Footer: FC = () => {
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  return (
    <footer
      className={`sticky text-sm leading-7 ${staffMode ? 'top-28' : 'top-20'}`}
    >
      <div className="mt-4 flex flex-wrap gap-x-[12px] px-3 lg:px-0">
        <span className="ld-text-gray-500 font-bold">
          &copy; {new Date().getFullYear()} {APP_NAME}.xyz
        </span>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link
          href="https://hey.xyz/discord"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DISCORD)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Discord
        </Link>
        <Link
          href="https://hey.xyz/donate"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DONATE)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Donate
        </Link>
        <Link
          href="https://status.hey.xyz"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_STATUS)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Status
        </Link>
        <Link
          href="https://feedback.hey.xyz"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_FEEDBACK)}
          rel="noreferrer noopener"
          target="_blank"
        >
          Feedback
        </Link>
        <Link href="/thanks">Thanks</Link>
        <Link
          href="https://github.com/heyxyz/hey"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_GITHUB)}
          rel="noreferrer noopener"
          target="_blank"
        >
          GitHub
        </Link>
        <Link
          href="/support"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_SUPPORT)}
        >
          Support
        </Link>
      </div>
      <div className="mt-2">
        <Link
          className="hover:font-bold"
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
