import type { Profile } from '@hey/lens';
import type { ActionData, UIData } from 'nft-openaction-kit';
import type { FC } from 'react';
import type { Address } from 'viem';

import { useDefaultProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import truncateByWords from '@hey/lib/truncateByWords';
import { Image } from '@hey/ui';
import { useOaCurrency } from 'src/store/persisted/useOaCurrency';

interface ActionInfoProps {
  actionData?: ActionData;
  collectionName: string;
  creatorAddress: Address;
  uiData: UIData;
}

const ActionInfo: FC<ActionInfoProps> = ({
  actionData,
  collectionName,
  creatorAddress,
  uiData
}) => {
  const { selectedCurrency } = useOaCurrency();

  const { data, loading } = useDefaultProfileQuery({
    skip: !creatorAddress,
    variables: { request: { for: creatorAddress } }
  });

  const formattedPrice: string | undefined = !actionData
    ? undefined
    : (
        actionData.actArgumentsFormatted.paymentToken.amount /
        BigInt(10 ** selectedCurrency.decimals)
      ).toString();

  if (!creatorAddress && loading) {
    return null;
  }

  const profileExists = !!data && !!data.defaultProfile;

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-start justify-start">
        <Image
          alt={uiData.platformName}
          className="size-6 rounded-full border bg-gray-200 dark:border-gray-700"
          height={24}
          loading="lazy"
          // TODO: manage on platform image onError
          src={uiData.platformLogoUrl}
          width={24}
        />
      </div>
      <div className="flex flex-col items-start gap-1 sm:gap-0">
        <span className="block sm:inline-flex sm:gap-2">
          <h2 className="sm:hidden">{truncateByWords(collectionName, 3)}</h2>
          <h2 className="hidden sm:block">
            {truncateByWords(collectionName, 5)}
          </h2>
          <p className="opacity-50">
            by{' '}
            {profileExists
              ? getProfile(data.defaultProfile as Profile).slug
              : `${creatorAddress.slice(0, 6)}...${creatorAddress.slice(-4)}`}
          </p>
        </span>
        {!!formattedPrice && (
          <p className="opacity-50">
            {formattedPrice} {selectedCurrency.symbol}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionInfo;
