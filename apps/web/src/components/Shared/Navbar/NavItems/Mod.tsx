import { ShieldCheckIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';

type Props = {
  onClick?: () => void;
  className?: string;
};

const Mod: FC<Props> = ({ onClick, className }) => {
  return (
    <Link href="/mod" className={clsx('flex items-center space-x-1.5', className)} onClick={onClick}>
      <ShieldCheckIcon className="w-4 h-4" />
      <div>
        <Trans>Moderation</Trans>
      </div>
    </Link>
  );
};

export default Mod;
