import cn from '@hey/ui/cn';
import type { FC } from 'react';

interface SlugProps {
  slug: string;
  prefix?: string;
  className?: string;
}

const Slug: FC<SlugProps> = ({ slug, prefix, className = '' }) => {
  return (
    <span className={cn('lt-text-gray-500', className)}>
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
