import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { PlusIcon, SwitchHorizontalIcon, UsersIcon, XCircleIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import splitNumber from '@lib/splitNumber';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useCollectModuleStore } from 'src/store/collect-module';
import { PUBLICATION } from 'src/tracking';

const SplitConfig: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const recipients = useCollectModuleStore((state) => state.recipients);
  const setRecipients = useCollectModuleStore((state) => state.setRecipients);

  const hasRecipients = recipients.length > 0;
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.split, 0);

  const splitEvenly = () => {
    const equalSplits = splitNumber(100, recipients.length);
    const splits = recipients.map((recipient, i) => {
      return {
        recipient: recipient.recipient,
        split: equalSplits[i]
      };
    });
    setRecipients([...splits]);
  };

  return (
    <div className="pt-5">
      <ToggleWithHelper
        on={recipients.length > 0}
        setOn={() => {
          if (recipients.length > 0) {
            setRecipients([]);
          } else {
            setRecipients([{ recipient: currentProfile?.ownedBy, split: 100 }]);
          }
          Mixpanel.track(PUBLICATION.NEW.COLLECT_MODULE.TOGGLE_MULTIPLE_RECIPIENTS_COLLECT);
        }}
        heading={t`Split revenue`}
        description={t`Set multiple recipients for the collect fee`}
        icon={<UsersIcon className="h-4 w-4" />}
      />
      {hasRecipients ? (
        <div className="space-y-3 pt-4">
          <div className="no-scrollbar max-h-[20vh] overflow-auto">
            {recipients.map((recipient, index) => (
              <div key={index} className="flex items-center space-x-2 py-2 pt-2 text-sm">
                <Input
                  placeholder="0x1234..."
                  value={recipient.recipient}
                  disabled={index === 0}
                  onChange={(event) => {
                    setRecipients(
                      recipients.map((r, i) => {
                        if (i === index) {
                          return { ...r, recipient: event.target.value };
                        }
                        return r;
                      })
                    );
                  }}
                />
                <div className="w-1/3">
                  <Input
                    type="number"
                    placeholder="5"
                    min="1"
                    max="100"
                    value={recipient.split}
                    iconRight="%"
                    onChange={(event) => {
                      setRecipients(
                        recipients.map((r, i) => {
                          if (i === index) {
                            return { ...r, split: parseInt(event.target.value) };
                          }
                          return r;
                        })
                      );
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    setRecipients(recipients.filter((_, i) => i !== index));
                  }}
                >
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              outline
              icon={<PlusIcon className="h-3 w-3" />}
              onClick={() => {
                setRecipients([...recipients, { recipient: '', split: 0 }]);
              }}
            >
              Add recipient
            </Button>
            <Button
              size="sm"
              outline
              icon={<SwitchHorizontalIcon className="h-3 w-3" />}
              onClick={splitEvenly}
            >
              Split evenly
            </Button>
          </div>
          {splitTotal > 100 ? (
            <div className="text-sm font-bold text-red-500">
              <Trans>
                Splits cannot exceed 100%. Total: <span>{splitTotal}</span>%
              </Trans>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default SplitConfig;
