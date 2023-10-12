import { APP_NAME } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import type { FC } from 'react';
import { usePreferencesStore } from 'src/store/preferences';
import urlcat from 'urlcat';

const Footer: FC = () => {
  const staffMode = usePreferencesStore((state) => state.staffMode);

  return (
    <footer
      className={`sticky text-sm leading-7 ${staffMode ? 'top-28' : 'top-20'}`}
      data-testid="footer"
    >
      <div className={'mt-4 flex flex-wrap gap-x-[12px] px-3 lg:px-0'}>
        <span className="lt-text-gray-500 font-bold">
          &copy; {new Date().getFullYear()} {APP_NAME}.xyz
        </span>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link
          href="https://hey.xyz/discord"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DISCORD)}
        >
          Discord
        </Link>
        <Link
          href="https://hey.xyz/donate"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DONATE)}
        >
          Donate
        </Link>
        <Link
          href="https://status.hey.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_STATUS)}
        >
          Status
        </Link>
        <Link
          href="https://feedback.hey.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_FEEDBACK)}
        >
          Feedback
        </Link>
        <Link href="/thanks">Thanks</Link>
        <Link
          href="https://github.com/heyxyz/hey"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_GITHUB)}
        >
          GitHub
        </Link>
        <Link
          href="https://translate.hey.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_TRANSLATE)}
        >
          Translate
        </Link>
      </div>
      <div className="mt-2">
        <Link
          className="hover:font-bold"
          href={urlcat('https://vercel.com', {
            utm_source: APP_NAME,
            utm_campaign: 'oss'
          })}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_VERCEL)}
        >
          ▲ Powered by Vercel
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
