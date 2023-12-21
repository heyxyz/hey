import type { FC } from 'react';

import { StarIcon } from '@heroicons/react/24/solid';

const Beta: FC = () => {
  return (
    <span className="bg-brand-500 border-brand-600 flex items-center space-x-1 rounded-md border px-1.5 text-xs text-white shadow-sm">
      <StarIcon className="size-3" />
      <span>Beta</span>
    </span>
  );
};

export default Beta;
