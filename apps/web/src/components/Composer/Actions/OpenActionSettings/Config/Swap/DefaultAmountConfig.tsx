import type { FC } from 'react';

import ToggleWithHelper from '@components/Shared/ToggleWithHelper';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { KNOWN_ATTRIBUTES } from '@hey/data/constants';
import { Input } from '@hey/ui';
import { MetadataAttributeType } from '@lens-protocol/metadata';
import { usePublicationAttributesStore } from 'src/store/non-persisted/publication/usePublicationAttributesStore';

const DefaultAmountConfig: FC = () => {
  const { addAttribute, getAttribute, removeAttribute, updateAttribute } =
    usePublicationAttributesStore();
  const amount = Number(
    getAttribute(KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT)?.value
  );

  return (
    <div className="mt-5">
      <ToggleWithHelper
        description="Set a default amount for the swap action."
        heading="Default amount"
        icon={<CurrencyDollarIcon className="size-5" />}
        on={amount > 0}
        setOn={() => {
          // toggle default amount
          if (amount > 0) {
            removeAttribute(KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT);
          } else {
            addAttribute({
              key: KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT,
              type: MetadataAttributeType.NUMBER,
              value: '1'
            });
          }
        }}
      />
      {amount > 0 ? (
        <div className="ml-8 mt-4 flex space-x-2 text-sm">
          <Input
            label="Default amount"
            max="100000"
            min="1"
            onChange={(event) => {
              const { value } = event.target;
              if (value) {
                updateAttribute(KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT, value);
              } else {
                removeAttribute(KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT);
              }
            }}
            placeholder="5"
            type="number"
            value={amount}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DefaultAmountConfig;
