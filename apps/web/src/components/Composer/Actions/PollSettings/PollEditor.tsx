import { ClockIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import { MenuAlt2Icon, XCircleIcon } from '@heroicons/react/solid';
import { Button, Card, Input, Modal, Tooltip } from '@lenster/ui';
import { Plural, t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/publication';

const PollEditor: FC = () => {
  const setShowPollEditor = usePublicationStore(
    (state) => state.setShowPollEditor
  );
  const pollConfig = usePublicationStore((state) => state.pollConfig);
  const setPollConfig = usePublicationStore((state) => state.setPollConfig);
  const resetPollConfig = usePublicationStore((state) => state.resetPollConfig);
  const [showPollLengthModal, setShowPollLengthModal] = useState(false);

  return (
    <Card className="m-5 px-5 py-3" forceRounded>
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
            {pollConfig.length}{' '}
            <Plural
              value={pollConfig.length}
              zero="day"
              one="day"
              other="days"
            />
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
                value={pollConfig.length}
                min={1}
                max={30}
                onChange={(e) =>
                  setPollConfig({
                    ...pollConfig,
                    length: Number(e.target.value)
                  })
                }
              />
              <div className="flex space-x-2 pt-5">
                <Button
                  className="ml-auto"
                  variant="danger"
                  onClick={() => {
                    setPollConfig({ ...pollConfig, length: 7 });
                    setShowPollLengthModal(false);
                  }}
                  outline
                >
                  <Trans>Cancel</Trans>
                </Button>
                <Button
                  className="ml-auto"
                  variant="primary"
                  onClick={() => setShowPollLengthModal(false)}
                >
                  <Trans>Save</Trans>
                </Button>
              </div>
            </div>
          </Modal>
          <Tooltip placement="top" content={t`Delete`}>
            <button
              className="flex"
              onClick={() => {
                resetPollConfig();
                setShowPollEditor(false);
              }}
            >
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {pollConfig.choices.map((choice, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <Input
              placeholder={t`Choice ${index + 1}`}
              value={choice}
              onChange={(event) => {
                const newChoices = [...pollConfig.choices];
                newChoices[index] = event.target.value;
                setPollConfig({ ...pollConfig, choices: newChoices });
              }}
              iconRight={
                index > 1 && (
                  <button
                    className="flex"
                    onClick={() => {
                      const newChoices = [...pollConfig.choices];
                      newChoices.splice(index, 1);
                      setPollConfig({ ...pollConfig, choices: newChoices });
                    }}
                  >
                    <XIcon className="h-5 w-5 text-red-500" />
                  </button>
                )
              }
            />
          </div>
        ))}
        {pollConfig.choices.length !== 5 && (
          <button
            className="text-brand mt-2 flex items-center space-x-2 text-sm"
            onClick={() => {
              const newChoices = [...pollConfig.choices];
              newChoices.push('');
              setPollConfig({ ...pollConfig, choices: newChoices });
            }}
          >
            <PlusIcon className="h-4 w-4" />
            <span>
              <Trans>Add another option</Trans>
            </span>
          </button>
        )}
      </div>
    </Card>
  );
};

export default PollEditor;
