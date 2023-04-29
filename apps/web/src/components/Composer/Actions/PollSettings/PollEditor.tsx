import { ClockIcon, MenuAlt2Icon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { Button, Card, Input, Modal, Tooltip } from 'ui';

const PollEditor: FC = () => {
  const setShowPollEditor = usePublicationStore((state) => state.setShowPollEditor);
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const setPollConfig = usePublicationStore((state) => state.setPollConfig);

  const [showPollLengthModal, setShowPollLengthModal] = useState(false);

  return (
    <Card className="m-5 px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <MenuAlt2Icon className="text-brand h-4 w-4" />
          <b>Poll</b>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            icon={<ClockIcon className="h-4 w-4" />}
            onClick={() => setShowPollLengthModal(true)}
            outline
          >
            {pollConfig.pollLength} days
          </Button>
          <Modal
            title={t`Poll length`}
            icon={<ClockIcon className="text-brand h-5 w-5" />}
            show={showPollLengthModal}
            onClose={() => setShowPollLengthModal(false)}
          >
            <div className="p-5">
              <Input
                label={t`Poll length (days)`}
                type="number"
                value={pollConfig.pollLength}
                min={1}
                max={30}
                onChange={(e) =>
                  setPollConfig({
                    ...pollConfig,
                    pollLength: Number(e.target.value)
                  })
                }
              />
              <div className="flex space-x-2 pt-5">
                <Button
                  className="ml-auto"
                  variant="danger"
                  onClick={() => {
                    setPollConfig({
                      ...pollConfig,
                      pollLength: 7
                    });
                    setShowPollLengthModal(false);
                  }}
                  outline
                >
                  <Trans>Cancel</Trans>
                </Button>
                <Button className="ml-auto" variant="primary" onClick={() => setShowPollLengthModal(false)}>
                  <Trans>Save</Trans>
                </Button>
              </div>
            </div>
          </Modal>
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
