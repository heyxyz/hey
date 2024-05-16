import type { FC, ReactNode } from 'react';

import cn from '@hey/ui/cn';
import { toast } from 'react-hot-toast';

interface MetaDetailsProps {
  children: ReactNode;
  icon: ReactNode;
  noFlex?: boolean;
  title?: string;
  value?: string;
}

const MetaDetails: FC<MetaDetailsProps> = ({
  children,
  icon,
  noFlex = false,
  title,
  value
}) => (
  <div
    className={cn(
      !noFlex && 'flex items-center gap-1',
      value && 'cursor-pointer',
      'linkify text-sm font-bold'
    )}
    onClick={async () => {
      if (!value) {
        return;
      }

      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    }}
  >
    <div className="flex items-center gap-1">
      {icon}
      {title ? (
        <div className="ld-text-gray-500">
          {title}
          {noFlex ? '' : ':'}
        </div>
      ) : null}
    </div>
    <div className={cn(noFlex ? 'mt-1' : '')}>{children}</div>
  </div>
);

export default MetaDetails;
