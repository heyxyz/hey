import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import type { Erc20 } from '@hey/lens';
import { OpenActionModuleType } from '@hey/lens';
import { Input } from '@hey/ui';
import { type FC, memo } from 'react';
import { useCollectModuleStore } from 'src/store/useCollectModuleStore';

interface AmountConfigProps {
  enabledModuleCurrencies?: Erc20[];
  setCollectType: (data: any) => void;
}

const AmountConfig: FC<AmountConfigProps> = ({
  enabledModuleCurrencies,
  setCollectType
}) => {
  const collectModule = useCollectModuleStore((state) => state.collectModule);

  return (
    <div className="pt-3">
      <ToggleWithHelper
        on={Boolean(collectModule.amount?.value)}
        setOn={() => {
          setCollectType({
            type: collectModule.amount?.value
              ? OpenActionModuleType.SimpleCollectOpenActionModule
              : collectModule.recipients?.length
              ? OpenActionModuleType.MultirecipientFeeCollectOpenActionModule
              : OpenActionModuleType.SimpleCollectOpenActionModule,
            amount: collectModule.amount?.value
              ? null
              : { currency: DEFAULT_COLLECT_TOKEN, value: '1' }
          });
        }}
        heading="Charge for collecting"
        description="Get paid whenever someone collects your post"
        icon={<CurrencyDollarIcon className="h-4 w-4" />}
      />
      {collectModule.amount?.value ? (
        <div className="pt-4">
          <div className="flex space-x-2 text-sm">
            <Input
              label="Price"
              type="number"
              placeholder="0.5"
              min="0"
              max="100000"
              value={parseFloat(collectModule.amount.value)}
              onChange={(event) => {
                setCollectType({
                  amount: {
                    currency: collectModule.amount?.currency,
                    value: event.target.value ? event.target.value : '0'
                  }
                });
              }}
            />
            <div>
              <div className="label">Select currency</div>
              <select
                className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
                onChange={(e) => {
                  setCollectType({
                    amount: {
                      currency: e.target.value,
                      value: collectModule.amount?.value
                    }
                  });
                }}
              >
                {enabledModuleCurrencies?.map((currency: Erc20) => (
                  <option
                    key={currency.contract.address}
                    value={currency.contract.address}
                    selected={
                      currency.contract.address ===
                      collectModule.amount?.currency
                    }
                  >
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default memo(AmountConfig);
