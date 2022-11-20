import AllowanceButton from '@components/Settings/Allowance/Button';
import CollectWarning from '@components/Shared/CollectWarning';
import IndexStatus from '@components/Shared/IndexStatus';
import Loader from '@components/Shared/Loader';
import Markup from '@components/Shared/Markup';
import Collectors from '@components/Shared/Modal/Collectors';
import ReferralAlert from '@components/Shared/ReferralAlert';
import Uniswap from '@components/Shared/Uniswap';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import { WarningMessage } from '@components/UI/WarningMessage';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { LensterPublication } from '@generated/types';
import {
  CashIcon,
  ClockIcon,
  CollectionIcon,
  PhotographIcon,
  PuzzleIcon,
  SwitchHorizontalIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import formatAddress from '@lib/formatAddress';
import getAssetAddress from '@lib/getAssetAddress';
import getCoingeckoPrice from '@lib/getCoingeckoPrice';
import getSignature from '@lib/getSignature';
import getTokenImage from '@lib/getTokenImage';
import humanize from '@lib/humanize';
import { Leafwatch } from '@lib/leafwatch';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import { LensHubProxy, UpdateOwnableFeeCollectModule } from 'abis';
import { LENSHUB_PROXY, POLYGONSCAN_URL, RELAY_ON, SIGN_WALLET } from 'data/constants';
import getEnvConfig from 'data/utils/getEnvConfig';
import dayjs from 'dayjs';
import type { BigNumber } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import type { ElectedMirror } from 'lens';
import {
  CollectModules,
  useApprovedModuleAllowanceAmountQuery,
  useCollectModuleQuery,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation,
  usePublicationRevenueQuery
} from 'lens';
import type { Dispatch, FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { useAccount, useBalance, useContractRead, useContractWrite, useSignTypedData } from 'wagmi';

interface Props {
  count: number;
  setCount: Dispatch<number>;
  publication: LensterPublication;
  electedMirror?: ElectedMirror;
}

const CollectModule: FC<Props> = ({ count, setCount, publication, electedMirror }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [revenue, setRevenue] = useState(0);
  const [hasCollectedByMe, setHasCollectedByMe] = useState(publication?.hasCollectedByMe);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [usdPrice, setUsdPrice] = useState(0);
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });
  const isMirror = electedMirror ? false : publication.__typename === 'Mirror';

  const { data, loading } = useCollectModuleQuery({
    variables: { request: { publicationId: publication?.id } }
  });

  const collectModule: any = data?.publication?.collectModule;

  const onCompleted = () => {
    setRevenue(revenue + parseFloat(collectModule?.amount?.value));
    setCount(count + 1);
    setHasCollectedByMe(true);
    toast.success('Transaction submitted successfully!');
    Leafwatch.track(PUBLICATION.COLLECT_MODULE.COLLECT);
  };

  const { isFetching, refetch } = useContractRead({
    address: getEnvConfig().UpdateOwnableFeeCollectModuleAddress,
    abi: UpdateOwnableFeeCollectModule,
    functionName: 'getPublicationData',
    args: [parseInt(publication.profile?.id), parseInt(publication?.id.split('-')[1])],
    enabled: false
  });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHubProxy,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const percentageCollected = (count / parseInt(collectModule?.collectLimit)) * 100;

  const { data: allowanceData, loading: allowanceLoading } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: collectModule?.type,
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !currentProfile,
    onCompleted: (data) => {
      setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  const { data: revenueData, loading: revenueLoading } = usePublicationRevenueQuery({
    variables: {
      request: {
        publicationId: publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
      }
    },
    pollInterval: 5000,
    skip: !publication?.id
  });

  useEffect(() => {
    setRevenue(parseFloat((revenueData?.publicationRevenue?.revenue?.total?.value as any) ?? 0));
    if (collectModule?.amount) {
      getCoingeckoPrice(getAssetAddress(collectModule?.amount?.asset?.symbol)).then((data) => {
        setUsdPrice(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revenueData]);

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: true
  });

  let hasAmount = false;
  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(collectModule?.amount?.value)) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });
  const [createCollectTypedData, { loading: typedDataLoading }] = useCreateCollectTypedDataMutation({
    onCompleted: async ({ createCollectTypedData }) => {
      try {
        const { id, typedData } = createCollectTypedData;
        const { profileId, pubId, data: collectData, deadline } = typedData.value;
        const signature = await signTypedDataAsync(getSignature(typedData));
        const { v, r, s } = splitSignature(signature);
        const sig = { v, r, s, deadline };
        const inputStruct = {
          collector: address,
          profileId,
          pubId,
          data: collectData,
          sig
        };

        setUserSigNonce(userSigNonce + 1);
        if (!RELAY_ON) {
          return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }

        const {
          data: { broadcast: result }
        } = await broadcast({ request: { id, signature } });

        if ('reason' in result) {
          write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
        }
      } catch {}
    },
    onError
  });

  const [createCollectProxyAction, { loading: proxyActionLoading }] = useProxyActionMutation({
    onCompleted,
    onError
  });

  const createViaProxyAction = async (variables: any) => {
    const { data } = await createCollectProxyAction({ variables });
    if (!data?.proxyAction) {
      createCollectTypedData({
        variables: {
          request: { publicationId: publication?.id },
          options: { overrideSigNonce: userSigNonce }
        }
      });
    }
  };

  const createCollect = () => {
    if (!currentProfile) {
      return toast.error(SIGN_WALLET);
    }

    if (collectModule?.type === CollectModules.FreeCollectModule) {
      createViaProxyAction({
        request: { collect: { freeCollect: { publicationId: publication?.id } } }
      });
    } else if (collectModule?.__typename === 'UnknownCollectModuleSettings') {
      refetch().then(({ data }) => {
        if (data) {
          const decodedData: any = data;
          const encodedData = defaultAbiCoder.encode(
            ['address', 'uint256'],
            [decodedData?.[2] as string, decodedData?.[1] as BigNumber]
          );
          createCollectTypedData({
            variables: {
              options: { overrideSigNonce: userSigNonce },
              request: { publicationId: publication?.id, unknownModuleData: encodedData }
            }
          });
        }
      });
    } else {
      createCollectTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { publicationId: electedMirror ? electedMirror.mirrorId : publication?.id }
        }
      });
    }
  };

  if (loading || revenueLoading) {
    return <Loader message="Loading collect" />;
  }

  const isLoading =
    typedDataLoading || proxyActionLoading || signLoading || isFetching || writeLoading || broadcastLoading;

  return (
    <>
      {(collectModule?.type === CollectModules.LimitedFeeCollectModule ||
        collectModule?.type === CollectModules.LimitedTimedFeeCollectModule) && (
        <Tooltip placement="top" content={`${percentageCollected.toFixed(0)}% Collected`}>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700">
            <div className="h-2.5 bg-brand-500" style={{ width: `${percentageCollected}%` }} />
          </div>
        </Tooltip>
      )}
      <div className="p-5">
        {collectModule?.followerOnly && (
          <div className="pb-5">
            <CollectWarning
              handle={publication?.profile?.handle}
              isSuperFollow={publication?.profile?.followModule?.__typename === 'FeeFollowModuleSettings'}
            />
          </div>
        )}
        <div className="pb-2 space-y-1.5">
          <div className="flex items-center space-x-2">
            {(electedMirror || isMirror) && (
              <Tooltip
                content={`Mirror of ${
                  electedMirror ? publication.__typename : publication?.mirrorOf.__typename?.toLowerCase()
                } by ${isMirror ? publication?.mirrorOf?.profile?.handle : publication.profile.handle}`}
              >
                <SwitchHorizontalIcon className="w-5 h-5 text-brand" />
              </Tooltip>
            )}
            {publication?.metadata?.name && (
              <div className="text-xl font-bold">{publication?.metadata?.name}</div>
            )}
          </div>
          {publication?.metadata?.description && (
            <Markup className="text-gray-500 line-clamp-2">{publication?.metadata?.description}</Markup>
          )}
          <ReferralAlert
            electedMirror={electedMirror}
            mirror={publication}
            referralFee={collectModule?.referralFee}
          />
        </div>
        {collectModule?.amount && (
          <div className="flex items-center py-2 space-x-1.5">
            <img
              className="w-7 h-7"
              height={28}
              width={28}
              src={getTokenImage(collectModule?.amount?.asset?.symbol)}
              alt={collectModule?.amount?.asset?.symbol}
              title={collectModule?.amount?.asset?.symbol}
            />
            <span className="space-x-1">
              <span className="text-2xl font-bold">{collectModule.amount.value}</span>
              <span className="text-xs">{collectModule?.amount?.asset?.symbol}</span>
              {usdPrice ? (
                <>
                  <span className="text-gray-500 px-0.5">·</span>
                  <span className="text-xs font-bold text-gray-500">
                    ${(collectModule.amount.value * usdPrice).toFixed(2)}
                  </span>
                </>
              ) : null}
            </span>
          </div>
        )}
        <div className="space-y-1.5">
          <div className="block space-y-1 sm:flex sm:space-x-5 item-center">
            <div className="flex items-center space-x-2">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              <button
                className="font-bold"
                type="button"
                onClick={() => {
                  setShowCollectorsModal(!showCollectorsModal);
                  Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECTORS);
                }}
              >
                {humanize(count)} collectors
              </button>
              <Modal
                title="Collected by"
                icon={<CollectionIcon className="w-5 h-5 text-brand" />}
                show={showCollectorsModal}
                onClose={() => setShowCollectorsModal(false)}
              >
                <Collectors
                  publicationId={
                    publication.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id
                  }
                />
              </Modal>
            </div>
            {collectModule?.collectLimit && (
              <div className="flex items-center space-x-2">
                <PhotographIcon className="w-4 h-4 text-gray-500" />
                <div className="font-bold">{parseInt(collectModule?.collectLimit) - count} available</div>
              </div>
            )}
            {collectModule?.referralFee ? (
              <div className="flex items-center space-x-2">
                <CashIcon className="w-4 h-4 text-gray-500" />
                <div className="font-bold">{collectModule.referralFee}% referral fee</div>
              </div>
            ) : null}
          </div>
          {revenueData?.publicationRevenue && (
            <div className="flex items-center space-x-2">
              <CashIcon className="w-4 h-4 text-gray-500" />
              <div className="flex items-center space-x-1.5">
                <span>Revenue:</span>
                <span className="flex items-center space-x-1">
                  <img
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    className="w-5 h-5"
                    height={20}
                    width={20}
                    alt={collectModule?.amount?.asset?.symbol}
                    title={collectModule?.amount?.asset?.symbol}
                  />
                  <div className="flex items-baseline space-x-1.5">
                    <div className="font-bold">{revenue}</div>
                    <div className="text-[10px]">{collectModule?.amount?.asset?.symbol}</div>
                    {usdPrice ? (
                      <>
                        <span className="text-gray-500">·</span>
                        <span className="text-xs font-bold text-gray-500">
                          ${(revenue * usdPrice).toFixed(2)}
                        </span>
                      </>
                    ) : null}
                  </div>
                </span>
              </div>
            </div>
          )}
          {collectModule?.endTimestamp && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-4 h-4 text-gray-500" />
              <div className="space-x-1.5">
                <span>Sale Ends:</span>
                <span className="font-bold text-gray-600">
                  {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')} at{' '}
                  {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                </span>
              </div>
            </div>
          )}
          {data?.publication?.collectNftAddress && (
            <div className="flex items-center space-x-2">
              <PuzzleIcon className="w-4 h-4 text-gray-500" />
              <div className="space-x-1.5">
                <span>Token:</span>
                <a
                  href={`${POLYGONSCAN_URL}/token/${data?.publication?.collectNftAddress}`}
                  target="_blank"
                  className="font-bold text-gray-600"
                  rel="noreferrer noopener"
                >
                  {formatAddress(data?.publication?.collectNftAddress)}
                </a>
              </div>
            </div>
          )}
        </div>
        {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
          <div className="mt-5">
            <IndexStatus txHash={writeData?.hash ?? broadcastData?.broadcast?.txHash} />
          </div>
        ) : null}
        <div className="flex items-center space-x-2 mt-5">
          {currentProfile && !hasCollectedByMe ? (
            allowanceLoading || balanceLoading ? (
              <div className="w-28 rounded-lg h-[34px] shimmer" />
            ) : allowed ? (
              hasAmount ? (
                <Button
                  onClick={createCollect}
                  disabled={isLoading}
                  icon={isLoading ? <Spinner size="xs" /> : <CollectionIcon className="w-4 h-4" />}
                >
                  Collect now
                </Button>
              ) : (
                <WarningMessage message={<Uniswap module={collectModule} />} />
              )
            ) : (
              <AllowanceButton
                title="Allow collect module"
                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                allowed={allowed}
                setAllowed={setAllowed}
              />
            )
          ) : null}
        </div>
        {publication?.hasCollectedByMe && (
          <div className="mt-3 font-bold text-green-500 flex items-center space-x-1.5">
            <CheckCircleIcon className="h-5 w-5" />
            <div>You already collected this</div>
          </div>
        )}
      </div>
    </>
  );
};

export default CollectModule;
