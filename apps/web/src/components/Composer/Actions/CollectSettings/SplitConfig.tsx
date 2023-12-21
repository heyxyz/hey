import type { FC } from 'react';

import Beta from '@components/Shared/Badges/Beta';
import SearchUser from '@components/Shared/SearchUser';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import {
  ArrowsRightLeftIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ADDRESS_PLACEHOLDER } from '@hey/data/constants';
import { OpenActionModuleType } from '@hey/lens';
import splitNumber from '@hey/lib/splitNumber';
import { Button, Input } from '@hey/ui';
import { useCollectModuleStore } from 'src/store/non-persisted/useCollectModuleStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { isAddress } from 'viem';

interface SplitConfigProps {
  isRecipientsDuplicated: () => boolean;
  setCollectType: (data: any) => void;
}

const SplitConfig: FC<SplitConfigProps> = ({
  isRecipientsDuplicated,
  setCollectType
}) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  const recipients = collectModule.recipients || [];
  const hasRecipients = (recipients || []).length > 0;
  const splitTotal = recipients?.reduce((acc, curr) => acc + curr.split, 0);

  const splitEvenly = () => {
    const equalSplits = splitNumber(100, recipients.length);
    const splits = recipients.map((recipient, i) => {
      return {
        recipient: recipient.recipient,
        split: equalSplits[i]
      };
    });
    setCollectType({
      recipients: [...splits]
    });
  };

  const onChangeRecipientOrSplit = (
    index: number,
    value: string,
    type: 'recipient' | 'split'
  ) => {
    const getRecipients = (value: string) => {
      return recipients.map((recipient, i) => {
        if (i === index) {
          return {
            ...recipient,
            [type]: type === 'split' ? parseInt(value) : value
          };
        }
        return recipient;
      });
    };

    setCollectType({ recipients: getRecipients(value) });
  };

  const updateRecipient = (index: number, value: string) => {
    onChangeRecipientOrSplit(index, value, 'recipient');
  };

  return (
    <div className="pt-5">
      <ToggleWithHelper
        description="Set multiple recipients for the collect fee"
        heading={
          <div className="flex items-center space-x-2">
            <span>Split revenue</span>
            <Beta />
          </div>
        }
        icon={<UsersIcon className="size-4" />}
        on={recipients.length > 0}
        setOn={() => {
          setCollectType({
            recipients:
              recipients.length > 0
                ? []
                : [{ recipient: currentProfile?.ownedBy.address, split: 100 }],
            type:
              recipients.length > 0
                ? OpenActionModuleType.SimpleCollectOpenActionModule
                : OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
          });
        }}
      />
      {hasRecipients ? (
        <div className="space-y-3 pt-4">
          <div className="space-y-2">
            {recipients.map((recipient, index) => (
              <div
                className="flex items-center space-x-2 text-sm"
                key={recipient.recipient}
              >
                <SearchUser
                  error={
                    recipient.recipient.length > 0 &&
                    !isAddress(recipient.recipient)
                  }
                  hideDropdown={isAddress(recipient.recipient)}
                  onChange={(event) =>
                    updateRecipient(index, event.target.value)
                  }
                  onProfileSelected={(profile) =>
                    updateRecipient(index, profile.ownedBy.address)
                  }
                  placeholder={`${ADDRESS_PLACEHOLDER} or wagmi`}
                  value={recipient.recipient}
                />
                <div className="w-1/3">
                  <Input
                    iconRight="%"
                    max="100"
                    min="1"
                    onChange={(event) =>
                      onChangeRecipientOrSplit(
                        index,
                        event.target.value,
                        'split'
                      )
                    }
                    placeholder="5"
                    type="number"
                    value={recipient.split}
                  />
                </div>
                <button
                  onClick={() => {
                    setCollectType({
                      recipients: recipients.filter((_, i) => i !== index)
                    });
                  }}
                  type="button"
                >
                  <XCircleIcon className="size-5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            {recipients.length >= 5 ? (
              <div />
            ) : (
              <Button
                icon={<PlusIcon className="size-3" />}
                onClick={() => {
                  setCollectType({
                    recipients: [...recipients, { recipient: '', split: 0 }]
                  });
                }}
                outline
                size="sm"
              >
                Add recipient
              </Button>
            )}
            <Button
              icon={<ArrowsRightLeftIcon className="size-3" />}
              onClick={splitEvenly}
              outline
              size="sm"
            >
              Split evenly
            </Button>
          </div>
          {splitTotal > 100 ? (
            <div className="text-sm font-bold text-red-500">
              Splits cannot exceed 100%. Total: <span>{splitTotal}</span>%
            </div>
          ) : null}
          {isRecipientsDuplicated() ? (
            <div className="text-sm font-bold text-red-500">
              Duplicate recipient address found
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default SplitConfig;
