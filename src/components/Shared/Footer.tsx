import useStaffMode from '@components/utils/hooks/useStaffMode';
import { BirdStats } from '@lib/birdstats';
import Link from 'next/link';
import type { FC } from 'react';
import { APP_NAME } from 'src/constants';
import { FOOTER } from 'src/tracking';

const Footer: FC = () => {
  const { allowed: staffMode } = useStaffMode();

  return (
    <footer
      className={`mt-4 leading-7 text-sm sticky flex flex-wrap px-3 lg:px-0 gap-x-[12px] ${
        staffMode ? 'top-28' : 'top-20'
      }`}
    >
      <span className="font-bold text-gray-500 dark:text-gray-300">
        &copy; {new Date().getFullYear()} {APP_NAME}
      </span>
      <Link href="/privacy">Privacy</Link>
      <a
        href="https://lenster.xyz/discord"
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.DISCORD)}
      >
        Discord
      </a>
      <a
        href="https://lenster.xyz/donate"
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.DONATE)}
      >
        Donate
      </a>
      <a
        href="https://status.lenster.xyz"
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.STATUS)}
      >
        Status
      </a>
      <a
        href="https://vote.lenster.xyz"
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.VOTE)}
      >
        Vote
      </a>
      <a
        href="https://feedback.lenster.xyz"
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.FEEDBACK)}
      >
        Feedback
      </a>
      <Link href="/thanks">Thanks</Link>
      <a
        href="https://github.com/lensterxyz/lenster"
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.GITHUB)}
      >
        GitHub
      </a>
      <a
        className="pr-3 hover:font-bold"
        href={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => BirdStats.track(FOOTER.VERCEL)}
      >
        ▲ Powered by Vercel
      </a>
    </footer>
  );
};

export default Footer;
