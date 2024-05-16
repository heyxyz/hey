import type { ActionData, UIData } from 'nft-openaction-kit';
import type { FC } from 'react';

import truncateByWords from '@hey/helpers/truncateByWords';
import { Image } from '@hey/ui';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';
import { useNftOaCurrencyStore } from 'src/store/persisted/useNftOaCurrencyStore';

const formatPrice = (value: Number) => {
  const num = Number(value);
  if (num < 1) {
    if (num < 0.0001) {
      return '<0.0001';
    }
    return num.toFixed(3);
  }
  return Math.round(num).toString();
};

interface ActionInfoProps {
  actionData?: ActionData;
  collectionName: string;
  hidePrice?: boolean;
  uiData?: UIData;
}

const ActionInfo: FC<ActionInfoProps> = ({
  actionData,
  collectionName,
  hidePrice,
  uiData
}) => {
  const { selectedNftOaCurrency } = useNftOaCurrencyStore();
  const { allowedTokens } = useAllowedTokensStore();

  const formattedPrice = actionData?.actArgumentsFormatted?.paymentToken?.amount
    ? formatPrice(
        Number(actionData?.actArgumentsFormatted.paymentToken.amount) /
          Math.pow(
            10,
            allowedTokens?.find(
              (t) => t.contractAddress === selectedNftOaCurrency
            )?.decimals || 18
          )
      )
    : null;

  return (
    <div className="flex items-center space-x-2">
      <Image
        alt={uiData?.platformName}
        className="size-5 rounded-full border bg-gray-200 dark:border-gray-700"
        height={20}
        loading="lazy"
        src={uiData?.platformLogoUrl}
        width={20}
      />
      <div className="flex items-center space-x-2">
        <h2 className="text-sm font-bold">
          {truncateByWords(collectionName, 3)}
        </h2>
        {formattedPrice && !hidePrice && (
          <p className="ld-text-gray-500">
            {formattedPrice}{' '}
            {allowedTokens?.find(
              (t) => t.contractAddress === selectedNftOaCurrency
            )?.symbol || 'WMATIC'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionInfo;
