import { APP_NAME } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { Link } from 'react-router-dom';
import type { FC } from 'react';
import { useFeatureFlagsStore } from '@persisted/useFeatureFlagsStore';
// @ts-ignore
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
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <Link
          to="https://hey.xyz/discord"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DISCORD)}
        >
          Discord
        </Link>
        <Link
          to="https://hey.xyz/donate"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DONATE)}
        >
          Donate
        </Link>
        <Link
          to="https://status.hey.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_STATUS)}
        >
          Status
        </Link>
        <Link
          to="https://feedback.hey.xyz"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_FEEDBACK)}
        >
          Feedback
        </Link>
        <Link to="/thanks">Thanks</Link>
        <Link
          to="https://github.com/heyxyz/hey"
          target="_blank"
          rel="noreferrer noopener"
          onClick={() => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_GITHUB)}
        >
          GitHub
        </Link>
        <Link
          to="https://translate.hey.xyz"
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
          to={urlcat('https://vercel.com', {
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
