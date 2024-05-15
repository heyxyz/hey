import type { Profile } from '@hey/lens';
import type { ActionData, UIData } from 'nft-openaction-kit';
import type { FC } from 'react';
import type { Address } from 'viem';

import getProfile from '@hey/helpers/getProfile';
import truncateByWords from '@hey/helpers/truncateByWords';
import { useDefaultProfileQuery } from '@hey/lens';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
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
  creatorAddress: Address;
  hidePrice?: boolean;
  isPreview?: boolean;
  uiData: UIData;
}

const ActionInfo: FC<ActionInfoProps> = ({
  actionData,
  collectionName,
  creatorAddress,
  hidePrice,
  isPreview,
  uiData
}) => {
  const { selectedNftOaCurrency } = useNftOaCurrencyStore();

  const { allowedTokens } = useAllowedTokensStore();

  const { data, loading } = useDefaultProfileQuery({
    skip: !creatorAddress || isPreview,
    variables: { request: { for: creatorAddress } }
  });

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

  if (!creatorAddress && loading) {
    return null;
  }

  const profileExists = Boolean(data?.defaultProfile);

  return (
    <div className={cn('flex items-start', isPreview ? 'gap-2' : 'gap-4')}>
      <div className="flex flex-col items-start justify-start">
        <Image
          alt={uiData.platformName}
          className="size-6 rounded-full border bg-gray-200 dark:border-gray-700"
          height={24}
          loading="lazy"
          src={uiData.platformLogoUrl}
          width={24}
        />
      </div>
      <div className="flex flex-col items-start gap-1 sm:gap-0">
        <span className="block sm:inline-flex sm:gap-2">
          <h2 className="font-semibold sm:hidden">
            {truncateByWords(collectionName, 3)}
          </h2>
          <h2 className="hidden font-semibold sm:block">
            {truncateByWords(collectionName, 4)}
          </h2>
          {!isPreview && (
            <p className="opacity-50">
              by {loading && '...'}
              {profileExists
                ? `@` + getProfile(data?.defaultProfile as Profile).slug
                : `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`}
            </p>
          )}
        </span>
        {formattedPrice && !hidePrice && (
          <p className="opacity-50">
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
