import { LifebuoyIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

interface ContactProps {
  onClick?: () => void;
  className?: string;
}

const Contact: FC<ContactProps> = ({ onClick, className = '' }) => {
  return (
    <Link
      href="/contact"
      className={cn(
        'flex w-full items-center space-x-1.5 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200',
        className
      )}
      onClick={onClick}
    >
      <LifebuoyIcon className="h-4 w-4" />
      <div>
        <Trans>Contact</Trans>
      </div>
    </Link>
  );
};

export default Contact;
