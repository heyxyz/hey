import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Input } from '@hey/ui';
import { type FC, useRef } from 'react';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';

import { useRentableBillboardActionStore } from '.';

const CostConfig: FC = () => {
  const { costPerSecond, currency, setCostPerSecond } =
    useRentableBillboardActionStore();
  const { allowedTokens } = useAllowedTokensStore();
  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  return (
    <div className="mt-5">
      <Input
        className="no-spinner"
        iconRight={
          <img
            src={`${STATIC_IMAGES_URL}/tokens/${
              allowedTokens?.find((t) => t.contractAddress === currency.token)
                ?.symbol
            }.svg`}
          />
        }
        inputMode="numeric"
        label="Cost per second"
        onChange={(e) => {
          setCostPerSecond(e.target.value as unknown as number);
        }}
        placeholder="0.5"
        ref={inputRef}
        type="number"
        value={costPerSecond}
      />
    </div>
  );
};

export default CostConfig;
