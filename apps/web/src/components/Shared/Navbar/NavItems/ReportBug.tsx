import { ExternalLinkIcon, HandIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

type Props = {
  onClick?: () => void;
  className?: string;
};

const ReportBug: FC<Props> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="https://github.com/lensterxyz/lenster/issues/new?assignees=bigint&labels=needs+review&template=bug_report.yml"
      target="_blank"
      className={clsx(
        'flex items-center justify-between px-4 py-1.5 text-sm w-full text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-1.5">
        <HandIcon className="w-4 h-4" />
        <div>
          <Trans>Report a bug</Trans>
        </div>
      </div>
      <ExternalLinkIcon className="md:hidden w-4 h-4" />
    </Link>
  );
};

export default ReportBug;
