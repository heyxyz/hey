import type { Profile } from '@hey/lens';
import type { ActionData } from 'nft-openaction-kit';
import type { FC } from 'react';
import type { Address } from 'viem';

import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { useDefaultProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import truncateByWords from '@hey/lib/truncateByWords';
import { Image } from '@hey/ui';

// TODO: take into account other currencies
const defaultCurrency = {
  contractAddress: DEFAULT_COLLECT_TOKEN,
  decimals: 18,
  id: 'WMATIC',
  name: 'Wrapped MATIC',
  symbol: 'WMATIC'
};

interface ActionInfoProps {
  actionData: ActionData;
  collectionName: string;
  creatorAddress: Address;
}

const ActionInfo: FC<ActionInfoProps> = ({
  actionData,
  collectionName,
  creatorAddress
}) => {
  const { data, loading } = useDefaultProfileQuery({
    skip: !creatorAddress,
    variables: { request: { for: creatorAddress } }
  });

  const formattedPrice = (
    actionData.actArgumentsFormatted.paymentToken.amount /
    BigInt(10 ** defaultCurrency.decimals)
  ).toString();

  if (!creatorAddress && loading) {
    return null;
  }

  if (!data?.defaultProfile) {
    return null;
  }

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-start justify-start">
        <Image
          alt={actionData.uiData.platformName}
          className="size-6 rounded-full border bg-gray-200 dark:border-gray-700"
          height={24}
          loading="lazy"
          // TODO: manage on platform image onError
          src={actionData.uiData.platformLogoUrl}
          width={24}
        />
      </div>
      <div className="flex flex-col items-start gap-1 sm:gap-0">
        <span className="block sm:inline-flex sm:gap-2">
          <h2 className="sm:hidden">{truncateByWords(collectionName, 3)}</h2>
          <h2 className="hidden sm:block">
            {truncateByWords(collectionName, 5)}
          </h2>
          <p className="text-black/50">
            by {getProfile(data.defaultProfile as Profile).slug}
          </p>
        </span>
        <p className="text-black/50">
          {formattedPrice} {defaultCurrency.symbol}
        </p>
      </div>
    </div>
  );
};

export default ActionInfo;
