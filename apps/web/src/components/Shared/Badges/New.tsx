import { SparklesIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const New: FC = () => {
  return (
    <div className="px-1.5 text-xs flex items-center space-x-1 text-white rounded-md border shadow-sm bg-blue-500 border-blue-600">
      <SparklesIcon className="h-3 w-3" />
      <div>
        <Trans>New</Trans>
      </div>
    </div>
  );
};

export default New;
