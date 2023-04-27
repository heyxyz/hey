import { SupportIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { DISCORD_URL } from 'data/constants';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

interface ContactProps {
  onClick?: () => void;
  className?: string;
}

const Contact: FC<ContactProps> = ({ onClick, className = '' }) => {
  return (
    <Link
      href={DISCORD_URL}
      className={clsx('bg-dark flex w-full  content-center items-center space-x-1.5 px-4 py-1.5', className)}
      onClick={onClick}
    >
      <SupportIcon className="h-4 w-4" />
      <div>
        <Trans>Contact</Trans>
      </div>
    </Link>
  );
};

export default Contact;
