import { MenuAlt2Icon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { Card, Tooltip } from 'ui';

const PollEditor: FC = () => {
  const setShowPollEditor = usePublicationStore((state) => state.setShowPollEditor);

  return (
    <Card className="m-5 px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <MenuAlt2Icon className="text-brand h-4 w-4" />
          <b>Poll</b>
        </div>
        <div>
          <Tooltip placement="top" content={t`Delete`}>
            <button className="flex" onClick={() => setShowPollEditor(false)}>
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default PollEditor;
