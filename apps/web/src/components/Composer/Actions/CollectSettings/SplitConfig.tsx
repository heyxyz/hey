import SearchAccounts from "@components/Shared/SearchAccounts";
import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import {
  ArrowsRightLeftIcon,
  PlusIcon,
  UsersIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";
import { ADDRESS_PLACEHOLDER } from "@hey/data/constants";
import splitNumber from "@hey/helpers/splitNumber";
import type { CollectModuleType } from "@hey/types/hey";
import { Button, H6, Input } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useCollectModuleStore } from "src/store/non-persisted/post/useCollectModuleStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { isAddress } from "viem";

interface SplitConfigProps {
  isRecipientsDuplicated: () => boolean;
  setCollectType: (data: CollectModuleType) => void;
}

const SplitConfig: FC<SplitConfigProps> = ({
  isRecipientsDuplicated,
  setCollectType
}) => {
  const { currentAccount } = useAccountStore();
  const { collectModule } = useCollectModuleStore((state) => state);

  const currentAddress = currentAccount?.ownedBy.address || "";
  const recipients = collectModule.recipients || [];
  const [isToggleOn, setIsToggleOn] = useState(
    recipients.length > 1 ||
      (recipients.length === 1 && recipients[0].recipient !== currentAddress)
  );
  const splitTotal = recipients.reduce((acc, curr) => acc + curr.split, 0);

  const handleSplitEvenly = () => {
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
    type: "recipient" | "split"
  ) => {
    const getRecipients = (value: string) => {
      return recipients.map((recipient, i) => {
        if (i === index) {
          return {
            ...recipient,
            [type]: type === "split" ? Number.parseInt(value) : value
          };
        }
        return recipient;
      });
    };

    setCollectType({ recipients: getRecipients(value) });
  };

  const updateRecipient = (index: number, value: string) => {
    onChangeRecipientOrSplit(index, value, "recipient");
  };

  const handleRemoveRecipient = (index: number) => {
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
        <div className="mt-4 ml-8 space-y-3">
          <div className="space-y-2">
            {recipients.map((recipient, index) => (
              <H6
                className="flex items-center space-x-2 font-normal"
                key={index}
              >
                <SearchAccounts
                  error={
                    recipient.recipient.length > 0 &&
                    !isAddress(recipient.recipient)
                  }
                  hideDropdown={isAddress(recipient.recipient)}
                  onChange={(event) =>
                    updateRecipient(index, event.target.value)
                  }
                  onAccountSelected={(account) =>
                    updateRecipient(index, account.ownedBy.address)
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
                        "split"
                      )
                    }
                    placeholder="5"
                    type="number"
                    value={recipient.split}
                  />
                </div>
                <button
                  onClick={() => handleRemoveRecipient(index)}
                  type="button"
                >
                  <XCircleIcon className="size-5" />
                </button>
              </H6>
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
                    recipients: [...recipients, { recipient: "", split: 0 }]
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
              onClick={handleSplitEvenly}
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
