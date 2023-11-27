import { SparklesIcon } from '@heroicons/react/24/solid';
import type { FC } from 'react';

const New: FC = () => {
  return (
    <div className="flex items-center space-x-1 rounded-md border border-blue-600 bg-blue-500 px-1.5 text-xs text-white shadow-sm">
      <SparklesIcon className="h-3 w-3" />
      <div>New</div>
    </div>
  );
};

export default New;
