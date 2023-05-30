import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import { DEFAULT_COLLECT_TOKEN } from 'data';
import type { Erc20 } from 'lens';
import { CollectModules } from 'lens';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';
import { Input } from 'ui';

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
              ? CollectModules.SimpleCollectModule
              : collectModule.recipients?.length
              ? CollectModules.MultirecipientFeeCollectModule
              : CollectModules.SimpleCollectModule,
            amount: collectModule.amount?.value
              ? null
              : { currency: DEFAULT_COLLECT_TOKEN, value: '1' }
          });
        }}
        heading={t`Charge for collecting`}
        description={t`Get paid whenever someone collects your post`}
        icon={<CurrencyDollarIcon className="h-4 w-4" />}
      />
      {collectModule.amount?.value ? (
        <div className="pt-4">
          <div className="flex space-x-2 text-sm">
            <Input
              label={t`Price`}
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
              <div className="label">
                <Trans>Select Currency</Trans>
              </div>
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
                    key={currency.address}
                    value={currency.address}
                    selected={
                      currency?.address === collectModule.amount?.currency
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

export default AmountConfig;
