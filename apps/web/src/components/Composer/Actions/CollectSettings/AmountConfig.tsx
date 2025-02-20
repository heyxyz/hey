import ToggleWithHelper from "@components/Shared/ToggleWithHelper";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from "@hey/data/constants";
import { tokens } from "@hey/data/tokens";
import type { CollectActionType } from "@hey/types/hey";
import { Input, Select } from "@hey/ui";
import type { FC } from "react";
import { useCollectActionStore } from "src/store/non-persisted/post/useCollectActionStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface AmountConfigProps {
  setCollectType: (data: CollectActionType) => void;
}

const AmountConfig: FC<AmountConfigProps> = ({ setCollectType }) => {
  const { currentAccount } = useAccountStore();
  const { collectAction } = useCollectActionStore((state) => state);

  const enabled = Boolean(collectAction.amount?.value);

  return (
    <div>
      <ToggleWithHelper
        description="Get paid whenever someone collects your post"
        heading="Charge for collecting"
        icon={<CurrencyDollarIcon className="size-5" />}
        on={enabled}
        setOn={() => {
          setCollectType({
            amount: enabled
              ? null
              : { currency: DEFAULT_COLLECT_TOKEN, value: "1" },
            recipients: enabled
              ? undefined
              : [{ address: currentAccount?.address, percent: 100 }]
          });
        }}
      />
      {collectAction.amount?.value ? (
        <div className="mt-4 ml-8">
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              max="100000"
              min="0"
              onChange={(event) => {
                setCollectType({
                  amount: {
                    currency: collectAction.amount?.currency,
                    value: event.target.value ? event.target.value : "0"
                  }
                });
              }}
              placeholder="0.5"
              type="number"
              value={Number.parseFloat(collectAction.amount.value)}
            />
            <div className="w-5/6">
              <div className="label">Select currency</div>
              <Select
                iconClassName="size-4"
                onChange={(value) => {
                  setCollectType({
                    amount: {
                      currency: value,
                      value: collectAction.amount?.value as string
                    }
                  });
                }}
                options={tokens.map((token) => ({
                  icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
                  label: token.name,
                  selected:
                    token.contractAddress === collectAction.amount?.currency,
                  value: token.contractAddress
                }))}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AmountConfig;
