import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from '@hey/data/constants';
import { OpenActionModuleType } from '@hey/lens';
import { Input, Select } from '@hey/ui';
import { useCollectModuleStore } from 'src/store/non-persisted/publication/useCollectModuleStore';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokens';

interface AmountConfigProps {
  setCollectType: (data: any) => void;
}

const AmountConfig: FC<AmountConfigProps> = ({ setCollectType }) => {
  const { collectModule } = useCollectModuleStore((state) => state);
  const { allowedTokens } = useAllowedTokensStore();

  return (
    <div>
      <ToggleWithHelper
        description="Get paid whenever someone collects your post"
        heading="Charge for collecting"
        icon={<CurrencyDollarIcon className="size-5" />}
        on={Boolean(collectModule.amount?.value)}
        setOn={() => {
          setCollectType({
            amount: collectModule.amount?.value
              ? null
              : { currency: DEFAULT_COLLECT_TOKEN, value: '1' },
            type: collectModule.amount?.value
              ? OpenActionModuleType.SimpleCollectOpenActionModule
              : collectModule.recipients?.length
                ? OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
                : OpenActionModuleType.SimpleCollectOpenActionModule
          });
        }}
      />
      {collectModule.amount?.value ? (
        <div className="ml-8 mt-4">
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              max="100000"
              min="0"
              onChange={(event) => {
                setCollectType({
                  amount: {
                    currency: collectModule.amount?.currency,
                    value: event.target.value ? event.target.value : '0'
                  }
                });
              }}
              placeholder="0.5"
              type="number"
              value={parseFloat(collectModule.amount.value)}
            />
            <div className="w-5/6">
              <div className="label">Select currency</div>
              <Select
                iconClassName="size-4"
                onChange={(value) => {
                  setCollectType({
                    amount: {
                      currency: value,
                      value: collectModule.amount?.value
                    }
                  });
                }}
                options={allowedTokens?.map((token) => ({
                  icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
                  label: token.name,
                  selected:
                    token.contractAddress === collectModule.amount?.currency,
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
