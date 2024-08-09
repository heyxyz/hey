import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { APP_NAME } from '@hey/data/constants';
import { MISCELLANEOUS } from '@hey/data/tracking';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

const currentYear = new Date().getFullYear();

const links = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  {
    href: 'https://hey.xyz/discord',
    label: 'Discord',
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_DISCORD)
  },
  {
    href: 'https://status.hey.xyz',
    label: 'Status',
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_STATUS)
  },
  {
    href: 'https://feedback.hey.xyz',
    label: 'Feedback',
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_FEEDBACK)
  },
  { href: '/rules', label: 'Rules' },
  {
    href: 'https://github.com/heyxyz/hey',
    label: 'GitHub',
    onClick: () => Leafwatch.track(MISCELLANEOUS.FOOTER.OPEN_GITHUB)
  },
  { href: 'http://hey.xyz/support', label: 'Support' }
];

const Footer: FC = () => {
  const { staffMode } = useFeatureFlagsStore();

  return (
    <footer
      className={cn(
        staffMode ? 'top-28' : 'top-20',
        'sticky mt-4 flex flex-wrap gap-x-[12px] gap-y-2 px-3 text-sm lg:px-0'
      )}
    >
      <span className="ld-text-gray-500 font-bold">
        &copy; {currentYear} {APP_NAME}.xyz
      </span>
      {links.map((link) => (
        <Link
          className="outline-offset-4"
          href={link.href}
          key={link.href}
          onClick={link.onClick}
          rel="noreferrer noopener"
          target={link.href.startsWith('http') ? '_blank' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </footer>
  );
};

export default Footer;
