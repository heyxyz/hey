import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { Input } from '@components/UI/Input';
import { CollectionIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import type { Erc20 } from 'lens';
import type { FC } from 'react';
import { useCollectModuleStore } from 'src/store/collect-module';

import ReferralConfig from './ReferralConfig';

interface AmountConfigProps {
  enabledModuleCurrencies?: Erc20[];
}

const AmountConfig: FC<AmountConfigProps> = ({ enabledModuleCurrencies }) => {
  const amount = useCollectModuleStore((state) => state.amount);
  const setAmount = useCollectModuleStore((state) => state.setAmount);
  const setRecipients = useCollectModuleStore((state) => state.setRecipients);
  const selectedCurrency = useCollectModuleStore((state) => state.selectedCurrency);
  const setSelectedCurrency = useCollectModuleStore((state) => state.setSelectedCurrency);

  return (
    <div className="pt-3">
      <ToggleWithHelper
        on={Boolean(amount)}
        setOn={() => {
          setAmount(amount ? null : '1');
          setRecipients([]);
        }}
        heading={t`Charge for collecting`}
        description={t`Get paid whenever someone collects your post`}
        icon={<CollectionIcon className="h-4 w-4" />}
      />
      {amount ? (
        <div className="pt-4">
          <div className="flex space-x-2 text-sm">
            <Input
              label={t`Price`}
              type="number"
              placeholder="0.5"
              min="0"
              max="100000"
              value={parseFloat(amount)}
              onChange={(event) => {
                setAmount(event.target.value ? event.target.value : '0');
              }}
            />
            <div>
              <div className="label">
                <Trans>Select Currency</Trans>
              </div>
              <select
                className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800"
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {enabledModuleCurrencies?.map((currency: Erc20) => (
                  <option
                    key={currency.address}
                    value={currency.address}
                    selected={currency?.address === selectedCurrency}
                  >
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ReferralConfig />
        </div>
      ) : null}
    </div>
  );
};

export default AmountConfig;
