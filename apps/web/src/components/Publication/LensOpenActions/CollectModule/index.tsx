import type {
  AnyPublication,
  LegacyMultirecipientFeeCollectModuleSettings,
  LegacySimpleCollectModuleSettings,
  MultirecipientFeeCollectOpenActionSettings,
  OpenActionModule,
  SimpleCollectOpenActionSettings
} from '@hey/lens';
import type { FC } from 'react';

import CollectWarning from '@components/Shared/CollectWarning';
import CountdownTimer from '@components/Shared/CountdownTimer';
import Collectors from '@components/Shared/Modal/Collectors';
import Slug from '@components/Shared/Slug';
import {
  BanknotesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  RectangleStackIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import { FollowModuleType } from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import formatDate from '@hey/lib/datetime/formatDate';
import formatAddress from '@hey/lib/formatAddress';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getProfile from '@hey/lib/getProfile';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import getTokenImage from '@hey/lib/getTokenImage';
import humanize from '@hey/lib/humanize';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Modal, Tooltip } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import plur from 'plur';
import { useState } from 'react';

import CollectAction from './CollectAction';
import Splits from './Splits';

interface CollectModuleProps {
  openAction: OpenActionModule;
  publication: AnyPublication;
}

const CollectModule: FC<CollectModuleProps> = ({ openAction, publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const { data: allowedTokens } = useQuery({
    queryFn: () => getAllTokens(),
    queryKey: ['getAllTokens']
  });

  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [countOpenActions, setCountOpenActions] = useState(
    targetPublication.stats.countOpenActions
  );

  const collectModule = openAction as
    | LegacyMultirecipientFeeCollectModuleSettings
    | LegacySimpleCollectModuleSettings
    | MultirecipientFeeCollectOpenActionSettings
    | SimpleCollectOpenActionSettings;

  const endTimestamp = collectModule?.endsAt;
  const collectLimit = parseInt(collectModule?.collectLimit || '0');
  const amount = parseFloat(collectModule?.amount?.value || '0');
  const currency = collectModule?.amount?.asset?.symbol;
  const referralFee = collectModule?.referralFee;
  const isMultirecipientFeeCollectModule =
    collectModule.__typename === 'MultirecipientFeeCollectOpenActionSettings';
  const percentageCollected = (countOpenActions / collectLimit) * 100;
  const enabledTokens = allowedTokens?.map((t) => t.symbol);
  const isTokenEnabled = enabledTokens?.includes(currency);
  const isSaleEnded = new Date(endTimestamp) < new Date();

  const { data: usdPrice } = useQuery({
    enabled: Boolean(amount),
    queryFn: async () => await getRedstonePrice(getAssetSymbol(currency)),
    queryKey: ['getRedstonePrice', currency]
  });

  return (
    <>
      {collectLimit ? (
        <Tooltip
          content={`${percentageCollected.toFixed(0)}% Collected`}
          placement="top"
        >
          <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700">
            <div
              className="bg-brand-500 h-2.5"
              style={{ width: `${percentageCollected}%` }}
            />
          </div>
        </Tooltip>
      ) : null}
      <div className="p-5">
        {collectModule?.followerOnly ? (
          <div className="pb-5">
            <CollectWarning
              handle={getProfile(publication.by).slugWithPrefix}
              isSuperFollow={
                publication?.by?.followModule?.type ===
                FollowModuleType.FeeFollowModule
              }
            />
          </div>
        ) : null}
        <div className="mb-4">
          <div className="text-xl font-bold">
            {targetPublication.__typename} by{' '}
            <Slug slug={getProfile(targetPublication.by).slugWithPrefix} />
          </div>
        </div>
        {amount ? (
          <div className="flex items-center space-x-1.5 py-2">
            {isTokenEnabled ? (
              <img
                alt={currency}
                className="size-7"
                height={28}
                src={getTokenImage(currency)}
                title={currency}
                width={28}
              />
            ) : (
              <CurrencyDollarIcon className="text-brand-500 size-7" />
            )}
            <span className="space-x-1">
              <span className="text-2xl font-bold">{amount}</span>
              <span className="text-xs">{currency}</span>
              {isTokenEnabled && usdPrice ? (
                <>
                  <span className="ld-text-gray-500 px-0.5">·</span>
                  <span className="ld-text-gray-500 text-xs font-bold">
                    ${(amount * usdPrice).toFixed(2)}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <div className="block items-center space-y-1 sm:flex sm:space-x-5">
            <div className="flex items-center space-x-2">
              <UsersIcon className="ld-text-gray-500 size-4" />
              <button
                className="font-bold"
                onClick={() => setShowCollectorsModal(!showCollectorsModal)}
                type="button"
              >
                {humanize(countOpenActions)}{' '}
                {plur('collector', countOpenActions)}
              </button>
              <Modal
                icon={<RectangleStackIcon className="text-brand-500 size-5" />}
                onClose={() => setShowCollectorsModal(false)}
                show={showCollectorsModal}
                title="Collected by"
              >
                <Collectors publicationId={targetPublication.id} />
              </Modal>
            </div>
            {collectLimit ? (
              <div className="flex items-center space-x-2">
                <PhotoIcon className="ld-text-gray-500 size-4" />
                <div className="font-bold">
                  {collectLimit - countOpenActions} available
                </div>
              </div>
            ) : null}
            {referralFee ? (
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="ld-text-gray-500 size-4" />
                <div className="font-bold">{referralFee}% referral fee</div>
              </div>
            ) : null}
          </div>
          {endTimestamp ? (
            <div className="flex items-center space-x-2">
              <ClockIcon className="ld-text-gray-500 size-4" />
              <div className="space-x-1.5">
                <span>{isSaleEnded ? 'Sale ended on:' : 'Sale ends:'}</span>
                <span className="font-bold text-gray-600">
                  {isSaleEnded ? (
                    `${formatDate(endTimestamp, 'MMM D, YYYY, hh:mm A')}`
                  ) : (
                    <CountdownTimer targetDate={endTimestamp} />
                  )}
                </span>
              </div>
            </div>
          ) : null}
          {collectModule.contract.address ? (
            <div className="flex items-center space-x-2">
              <PuzzlePieceIcon className="ld-text-gray-500 size-4" />
              <div className="space-x-1.5">
                <span>Token:</span>
                <Link
                  className="font-bold text-gray-600"
                  href={`${POLYGONSCAN_URL}/token/${collectModule.contract.address}`}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {formatAddress(collectModule.contract.address)}
                </Link>
              </div>
            </div>
          ) : null}
          {isMultirecipientFeeCollectModule ? (
            <Splits recipients={collectModule?.recipients} />
          ) : null}
        </div>
        <div className="flex items-center space-x-2">
          <CollectAction
            countOpenActions={countOpenActions}
            openAction={openAction}
            publication={publication}
            setCountOpenActions={setCountOpenActions}
          />
        </div>
      </div>
    </>
  );
};

export default CollectModule;
