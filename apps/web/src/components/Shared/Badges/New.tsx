import type { FC } from 'react';

import { SparklesIcon } from '@heroicons/react/24/solid';

const New: FC = () => {
  return (
    <div className="flex items-center space-x-1 rounded-md border border-blue-600 bg-blue-500 px-1.5 text-xs text-white shadow-sm">
      <SparklesIcon className="size-3" />
      <div>New</div>
    </div>
  );
};

export default New;
