import type { FC } from 'react';

interface SlugProps {
  slug: string;
  prefix?: string;
  className?: string;
}

const Slug: FC<SlugProps> = ({ slug, prefix, className = '' }) => {
  return (
    <span className={className}>
      {prefix}
      {slug}
    </span>
  );
};

export default Slug;
