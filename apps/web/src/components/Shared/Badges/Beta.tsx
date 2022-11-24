import { StarIcon } from '@heroicons/react/solid';
import type { FC } from 'react';

const Beta: FC = () => {
  return (
    <div className="px-1.5 text-xs flex items-center space-x-1 text-white rounded-md border shadow-sm bg-brand-500 border-brand-600">
      <StarIcon className="h-3 w-3" />
      <div>Beta</div>
    </div>
  );
};

export default Beta;
