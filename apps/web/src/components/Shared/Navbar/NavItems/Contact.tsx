import { SupportIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

type Props = {
  onClick?: () => void;
  className?: string;
};

const Contact: FC<Props> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="/contact"
      className={clsx(
        'flex w-full items-center space-x-1.5 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
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
