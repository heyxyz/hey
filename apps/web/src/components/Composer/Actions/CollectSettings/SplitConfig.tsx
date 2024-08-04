import type { CollectModuleType } from '@hey/types/hey';
import type { FC } from 'react';

import SearchProfiles from '@components/Shared/SearchProfiles';
import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import {
  ArrowsRightLeftIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { ADDRESS_PLACEHOLDER } from '@hey/data/constants';
import splitNumber from '@hey/helpers/splitNumber';
import { Button, H6, Input } from '@hey/ui';
import { useState } from 'react';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { useProfileStore } from 'src/store/persisted/useProfileStore';
import { isAddress } from 'viem';

interface SplitConfigProps {
  isRecipientsDuplicated: () => boolean;
  setCollectType: (data: CollectModuleType) => void;
}

const SplitConfig: FC<SplitConfigProps> = ({
  isRecipientsDuplicated,
  setCollectType
}) => {
  const { currentProfile } = useProfileStore();
  const { collectModule } = useCollectModuleStore((state) => state);

  const currentAddress = currentProfile?.ownedBy.address || '';
  const recipients = collectModule.recipients || [];
  const [isToggleOn, setIsToggleOn] = useState(
    recipients.length > 1 ||
      (recipients.length === 1 && recipients[0].recipient !== currentAddress)
  );
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.split, 0);

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

  const removeRecipient = (index: number) => {
    const updatedRecipients = recipients.filter((_, i) => i !== index);
    if (updatedRecipients.length === 0) {
      setCollectType({
        recipients: [{ recipient: currentAddress, split: 100 }]
      });
      setIsToggleOn(false);
    } else {
      setCollectType({ recipients: updatedRecipients });
    }
  };

  const toggleSplit = () => {
    setCollectType({
      recipients: [{ recipient: currentAddress, split: 100 }]
    });
    setIsToggleOn(!isToggleOn);
  };

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Set multiple recipients for the collect fee"
        heading="Split revenue"
        icon={<UsersIcon className="size-5" />}
        on={isToggleOn}
        setOn={toggleSplit}
      />
      {isToggleOn ? (
        <div className="ml-8 mt-4 space-y-3">
          <div className="space-y-2">
            {recipients.map((recipient, index) => (
              <div className="flex items-center space-x-2 text-sm" key={index}>
                <SearchProfiles
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
                <button onClick={() => removeRecipient(index)} type="button">
                  <XCircleIcon className="size-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            {recipients.length >= 4 ? (
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
            <H6 className="text-red-500">
              Splits cannot exceed 100%. Total: <span>{splitTotal}</span>%
            </H6>
          ) : null}
          {splitTotal < 100 ? (
            <H6 className="text-red-500">
              Splits cannot be less than 100%. Total: <span>{splitTotal}</span>%
            </H6>
          ) : null}
          {isRecipientsDuplicated() ? (
            <H6 className="text-red-500">Duplicate recipient address found</H6>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default SplitConfig;
