import AllowanceButton from '@components/Settings/Allowance/Button';
import CollectWarning from '@components/Shared/CollectWarning';
import Markup from '@components/Shared/Markup';
import Collectors from '@components/Shared/Modal/Collectors';
import Uniswap from '@components/Shared/Uniswap';
import {
  BanknotesIcon,
  ClockIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  RectangleStackIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { LensHub } from '@hey/abis';
import { LENSHUB_PROXY, POLYGONSCAN_URL } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
import { PUBLICATION } from '@hey/data/tracking';
import type {
  AnyPublication,
  ApprovedAllowanceAmountResult,
  MultirecipientFeeCollectOpenActionSettings,
  SimpleCollectOpenActionSettings
} from '@hey/lens';
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation
} from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import formatHandle from '@hey/lib/formatHandle';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getSignature from '@hey/lib/getSignature';
import getTokenImage from '@hey/lib/getTokenImage';
import humanize from '@hey/lib/humanize';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Button, Modal, Spinner, Tooltip, WarningMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { formatDate } from '@lib/formatTime';
import getRedstonePrice from '@lib/getRedstonePrice';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import plur from 'plur';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useHandleWrongNetwork from 'src/hooks/useHandleWrongNetwork';
import { useAppStore } from 'src/store/app';
import { useNonceStore } from 'src/store/nonce';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useSignTypedData
} from 'wagmi';

import Splits from './Splits';

interface CollectModuleProps {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  publication: AnyPublication;
}

const CollectModule: FC<CollectModuleProps> = ({
  count,
  setCount,
  publication
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const userSigNonce = useNonceStore((state) => state.userSigNonce);
  const setUserSigNonce = useNonceStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCollectedByMe, setHasCollectedByMe] = useState(
    targetPublication.operations.hasActed.value
  );
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();
  const handleWrongNetwork = useHandleWrongNetwork();

  const collectModule = targetPublication?.openActionModules?.[0] as
    | SimpleCollectOpenActionSettings
    | MultirecipientFeeCollectOpenActionSettings;

  const endTimestamp = collectModule?.endsAt;
  const collectLimit = collectModule?.collectLimit || '0';
  const amount = collectModule?.amount?.value || '0';
  const currency = collectModule?.amount?.asset?.symbol;
  const assetAddress = collectModule?.amount?.asset?.contract.address;
  const assetDecimals = collectModule?.amount?.asset?.decimals;
  const referralFee = collectModule?.referralFee;

  const isFreeCollectModule = !collectModule;
  const isSimpleFreeCollectModule =
    collectModule.__typename === 'SimpleCollectOpenActionSettings';
  const isMultirecipientFeeCollectModule =
    collectModule.__typename === 'MultirecipientFeeCollectOpenActionSettings';

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return;
    }

    setIsLoading(false);
    setCount(count + 1);
    setHasCollectedByMe(true);
    toast.success('Collected successfully!');
    Leafwatch.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
      publication_id: publication?.id,
      collect_module: collectModule?.type
    });
  };

  const onError = (error: any) => {
    setIsLoading(false);
    errorToast(error);
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });

  const { write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'act',
    onSuccess: () => {
      onCompleted();
      setUserSigNonce(userSigNonce + 1);
    },
    onError: (error) => {
      onError(error);
      setUserSigNonce(userSigNonce - 1);
    }
  });

  const percentageCollected = (count / parseInt(collectLimit)) * 100;

  const { data: allowanceData, loading: allowanceLoading } =
    useApprovedModuleAllowanceAmountQuery({
      variables: {
        request: {
          currencies: assetAddress,
          followModules: [],
          openActionModules: [collectModule?.type],
          referenceModules: []
        }
      },
      skip: !assetAddress || !currentProfile,
      onCompleted: ({ approvedModuleAllowanceAmount }) => {
        setAllowed(
          approvedModuleAllowanceAmount[0]?.allowance.value !== '0x00'
        );
      }
    });

  const { data: usdPrice } = useQuery(
    ['redstoneData'],
    () => getRedstonePrice(getAssetSymbol(currency)).then((res) => res),
    { enabled: Boolean(amount) }
  );

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    token: assetAddress,
    formatUnits: assetDecimals,
    watch: true
  });

  let hasAmount = false;
  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(amount)) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  });
  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        });
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] });
        }
      },
      onError
    });

  const createCollect = async () => {
    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    if (handleWrongNetwork()) {
      return;
    }

    try {
      setIsLoading(true);
      return await createActOnOpenActionTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: {
            for: publication?.id,
            actOn: { [collectModule?.type]: true }
          }
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  const isLimitedCollectAllCollected = collectLimit
    ? count >= parseInt(collectLimit)
    : false;
  const isCollectExpired = endTimestamp
    ? new Date(endTimestamp).getTime() / 1000 < new Date().getTime() / 1000
    : false;

  return (
    <>
      {Boolean(collectLimit) ? (
        <Tooltip
          placement="top"
          content={`${percentageCollected.toFixed(0)}% Collected`}
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
              handle={
                formatHandle(publication?.by?.handle) || publication.by.id
              }
              isSuperFollow={
                publication?.by?.followModule?.type ===
                FollowModuleType.FeeFollowModule
              }
            />
          </div>
        ) : null}
        <div className="mb-4 space-y-1.5">
          {targetPublication.metadata?.marketplace?.name ? (
            <div className="text-xl font-bold">
              {targetPublication.metadata?.marketplace?.name}
            </div>
          ) : null}
          {targetPublication.metadata?.marketplace?.description ? (
            <Markup className="lt-text-gray-500 line-clamp-2">
              {targetPublication.metadata?.marketplace?.description}
            </Markup>
          ) : null}
        </div>
        {amount ? (
          <div className="flex items-center space-x-1.5 py-2">
            <img
              className="h-7 w-7"
              height={28}
              width={28}
              src={getTokenImage(currency)}
              alt={currency}
              title={currency}
            />
            <span className="space-x-1">
              <span className="text-2xl font-bold">{amount}</span>
              <span className="text-xs">{currency}</span>
              {usdPrice ? (
                <>
                  <span className="lt-text-gray-500 px-0.5">·</span>
                  <span className="lt-text-gray-500 text-xs font-bold">
                    ${(parseFloat(amount) * usdPrice).toFixed(2)}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <div className="block items-center space-y-1 sm:flex sm:space-x-5">
            <div className="flex items-center space-x-2">
              <UsersIcon className="lt-text-gray-500 h-4 w-4" />
              <button
                className="font-bold"
                type="button"
                onClick={() => setShowCollectorsModal(!showCollectorsModal)}
              >
                {humanize(count)} {plur('collector', count)}
              </button>
              <Modal
                title="Collected by"
                icon={<RectangleStackIcon className="text-brand h-5 w-5" />}
                show={showCollectorsModal}
                onClose={() => setShowCollectorsModal(false)}
              >
                <Collectors publicationId={targetPublication.id} />
              </Modal>
            </div>
            {collectLimit ? (
              <div className="flex items-center space-x-2">
                <PhotoIcon className="lt-text-gray-500 h-4 w-4" />
                <div className="font-bold">
                  {parseInt(collectLimit) - count} available
                </div>
              </div>
            ) : null}
            {referralFee ? (
              <div className="flex items-center space-x-2">
                <BanknotesIcon className="lt-text-gray-500 h-4 w-4" />
                <div className="font-bold">{referralFee}% referral fee</div>
              </div>
            ) : null}
          </div>
          {endTimestamp ? (
            <div className="flex items-center space-x-2">
              <ClockIcon className="lt-text-gray-500 h-4 w-4" />
              <div className="space-x-1.5">
                <span>Sale Ends:</span>
                <span className="font-bold text-gray-600">
                  {formatDate(endTimestamp, 'MMMM DD, YYYY')} at{' '}
                  {formatDate(endTimestamp, 'hh:mm a')}
                </span>
              </div>
            </div>
          ) : null}
          {collectModule.contract.address ? (
            <div className="flex items-center space-x-2">
              <PuzzlePieceIcon className="lt-text-gray-500 h-4 w-4" />
              <div className="space-x-1.5">
                <span>Token:</span>
                <Link
                  href={`${POLYGONSCAN_URL}/token/${collectModule.contract.address}`}
                  target="_blank"
                  className="font-bold text-gray-600"
                  rel="noreferrer noopener"
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
          {currentProfile &&
          (!hasCollectedByMe ||
            (!isFreeCollectModule && !isSimpleFreeCollectModule)) ? (
            allowanceLoading || balanceLoading ? (
              <div className="shimmer mt-5 h-[34px] w-28 rounded-lg" />
            ) : allowed ? (
              hasAmount ? (
                !isLimitedCollectAllCollected && !isCollectExpired ? (
                  <Button
                    className="mt-5"
                    onClick={createCollect}
                    disabled={isLoading}
                    icon={
                      isLoading ? (
                        <Spinner size="xs" />
                      ) : (
                        <RectangleStackIcon className="h-4 w-4" />
                      )
                    }
                  >
                    Collect now
                  </Button>
                ) : null
              ) : (
                <WarningMessage
                  className="mt-5 w-full"
                  message={<Uniswap module={collectModule} />}
                />
              )
            ) : (
              <span className="mt-5">
                <AllowanceButton
                  title="Allow collect module"
                  module={
                    allowanceData
                      ?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmountResult
                  }
                  allowed={allowed}
                  setAllowed={setAllowed}
                />
              </span>
            )
          ) : null}
        </div>
        {targetPublication.operations.hasActed.value ? (
          <div className="mt-3 flex items-center space-x-1.5 font-bold text-green-500">
            <CheckCircleIcon className="h-5 w-5" />
            <div>You already collected this</div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default CollectModule;
