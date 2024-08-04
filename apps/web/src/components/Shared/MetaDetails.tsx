import type { FC, ReactNode } from 'react';

import { H6 } from '@hey/ui';
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
}) => {
  const handleClick = async () => {
    if (value) {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div
      className={cn(
        !noFlex && 'flex items-center gap-1',
        value && 'cursor-pointer',
        'linkify'
      )}
      onClick={handleClick}
    >
      <H6 className="flex items-center gap-1">
        {icon}
        {title && (
          <div className="ld-text-gray-500">
            {title}
            {!noFlex && ':'}
          </div>
        )}
      </H6>
      <H6 className={noFlex ? 'mt-1' : ''}>{children}</H6>
    </div>
  );
};

export default MetaDetails;
