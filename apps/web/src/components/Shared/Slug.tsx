import cn from '@hey/ui/cn';
import type { FC } from 'react';

interface SlugProps {
  slug: string;
  prefix?: string;
  useBrandColor?: boolean;
  className?: string;
}

const Slug: FC<SlugProps> = ({
  slug,
  prefix,
  useBrandColor = false,
  className = ''
}) => {
  return (
    <span
      className={cn(
        useBrandColor ? 'text-brand' : 'lt-text-gray-500',
        className
      )}
    >
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
