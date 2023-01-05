import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import { APP_NAME } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import { FOOTER } from 'src/tracking';

const Footer: FC = () => {
  const { allowed: staffMode } = useStaffMode();

  return (
    <footer
      className={`mt-4 leading-7 text-sm sticky flex flex-wrap px-3 lg:px-0 gap-x-[12px] ${
        staffMode ? 'top-28' : 'top-20'
      }`}
      data-test="footer"
    >
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
      <a
        className="pr-3 hover:font-bold"
        href={`https://vercel.com/?utm_source=${APP_NAME}&utm_campaign=oss`}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => Analytics.track(FOOTER.VERCEL)}
      >
        <Trans>▲ Powered by Vercel</Trans>
      </a>
    </footer>
  );
};

export default Footer;
