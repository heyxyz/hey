import { t } from '@lingui/macro';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface MetaDetailsProps {
  children: ReactNode;
  title?: string;
  value: string;
  icon: ReactNode;
  noFlex?: boolean;
}

const MetaDetails: FC<MetaDetailsProps> = ({
  children,
  title,
  value,
  icon,
  noFlex = false
}) => (
  <div
    className={clsx(
      noFlex ? '' : 'flex items-center gap-1',
      'linkify cursor-pointer text-sm font-bold'
    )}
    onClick={async () => {
      await navigator.clipboard.writeText(value);
      toast.success(t`Copied to clipboard!`);
    }}
    aria-hidden="true"
  >
    <div className="flex items-center gap-1">
      {icon}
      {title ? (
        <div className="lt-text-gray-500">
          {title}
          {noFlex ? '' : ':'}
        </div>
      ) : null}
    </div>
    <div className={clsx(noFlex ? 'mt-1' : '')}>{children}</div>
  </div>
);

export default MetaDetails;
