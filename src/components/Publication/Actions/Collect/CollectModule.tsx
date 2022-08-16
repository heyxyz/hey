import { LensHubProxy } from '@abis/LensHubProxy';
import { gql, useMutation, useQuery } from '@apollo/client';
import { PUBLICATION_REVENUE_QUERY } from '@components/Publication/Crowdfund';
import { ALLOWANCE_SETTINGS_QUERY } from '@components/Settings/Allowance';
import AllowanceButton from '@components/Settings/Allowance/Button';
import Collectors from '@components/Shared/Collectors';
import IndexStatus from '@components/Shared/IndexStatus';
import Loader from '@components/Shared/Loader';
import Markup from '@components/Shared/Markup';
import ReferenceAlert from '@components/Shared/ReferenceAlert';
import ReferralAlert from '@components/Shared/ReferralAlert';
import Uniswap from '@components/Shared/Uniswap';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import { WarningMessage } from '@components/UI/WarningMessage';
import { LensterPublication } from '@generated/lenstertypes';
import { CreateCollectBroadcastItemResult } from '@generated/types';
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation';
import { CollectModuleFields } from '@gql/CollectModuleFields';
import {
  CashIcon,
  ClockIcon,
  CollectionIcon,
  PhotographIcon,
  PuzzleIcon,
  SwitchHorizontalIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import getTokenImage from '@lib/getTokenImage';
import humanize from '@lib/humanize';
import { Mixpanel } from '@lib/mixpanel';
import omit from '@lib/omit';
import splitSignature from '@lib/splitSignature';
import dayjs from 'dayjs';
import React, { Dispatch, FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  POLYGONSCAN_URL,
  RELAY_ON
} from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { PUBLICATION } from 'src/tracking';
import { useAccount, useBalance, useContractWrite, useSignTypedData } from 'wagmi';

export const COLLECT_QUERY = gql`
  query CollectModule($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
      ... on Comment {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
      ... on Mirror {
        collectNftAddress
        collectModule {
          ...CollectModuleFields
        }
      }
    }
  }
  ${CollectModuleFields}
`;

const CREATE_COLLECT_TYPED_DATA_MUTATION = gql`
  mutation CreateCollectTypedData($options: TypedDataOptions, $request: CreateCollectRequest!) {
    createCollectTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;

interface Props {
  count: number;
  setCount: Dispatch<number>;
  publication: LensterPublication;
}

const CollectModule: FC<Props> = ({ count, setCount, publication }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const [revenue, setRevenue] = useState<number>(0);
  const [showCollectorsModal, setShowCollectorsModal] = useState<boolean>(false);
  const [allowed, setAllowed] = useState<boolean>(true);
  const { address } = useAccount();
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message);
      Mixpanel.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
        result: 'typed_data_error',
        error: error?.message
      });
    }
  });
  const { data, loading } = useQuery(COLLECT_QUERY, {
    variables: {
      request: { publicationId: publication?.pubId ?? publication?.id }
    }
  });

  const collectModule: any = data?.publication?.collectModule;

  const onCompleted = () => {
    setRevenue(revenue + parseFloat(collectModule?.amount?.value));
    setCount(count + 1);
    toast.success('Transaction submitted successfully!');
    Mixpanel.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
      result: 'success'
    });
  };

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess() {
      onCompleted();
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message);
    }
  });

  const percentageCollected = (count / parseInt(collectModule?.collectLimit)) * 100;

  const { data: allowanceData, loading: allowanceLoading } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: collectModule?.type,
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !isConnected,
    onCompleted(data) {
      setAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  const { data: revenueData, loading: revenueLoading } = useQuery(PUBLICATION_REVENUE_QUERY, {
    variables: {
      request: {
        publicationId:
          publication?.__typename === 'Mirror'
            ? publication?.mirrorOf?.id
            : publication?.pubId ?? publication?.id
      }
    },
    skip: !publication?.id
  });

  useEffect(() => {
    setRevenue(parseFloat(revenueData?.publicationRevenue?.revenue?.total?.value ?? 0));
  }, [revenueData]);

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    addressOrName: address,
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

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
    onCompleted,
    onError(error) {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
      Mixpanel.track(PUBLICATION.COLLECT_MODULE.COLLECT, {
        result: 'broadcast_error',
        error: error?.message
      });
    }
  });
  const [createCollectTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_COLLECT_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createCollectTypedData
      }: {
        createCollectTypedData: CreateCollectBroadcastItemResult;
      }) {
        const { id, typedData } = createCollectTypedData;
        const { deadline } = typedData?.value;

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          });
          setUserSigNonce(userSigNonce + 1);
          const { profileId, pubId, data: collectData } = typedData?.value;
          const { v, r, s } = splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            collector: address,
            profileId,
            pubId,
            data: collectData,
            sig
          };
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } });

            if ('reason' in result) write?.({ recklesslySetUnpreparedArgs: inputStruct });
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct });
          }
        } catch (error) {}
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE);
      }
    }
  );

  const createCollect = () => {
    if (!isConnected) return toast.error(CONNECT_WALLET);

    createCollectTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: { publicationId: publication?.pubId ?? publication?.id }
      }
    });
  };

  if (loading || revenueLoading) return <Loader message="Loading collect" />;

  return (
    <>
      {(collectModule?.type === 'LimitedFeeCollectModule' ||
        collectModule?.type === 'LimitedTimedFeeCollectModule') && (
        <Tooltip placement="top" content={`${percentageCollected.toFixed(0)}% Collected`}>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700">
            <div className="h-2.5 bg-brand-500" style={{ width: `${percentageCollected}%` }} />
          </div>
        </Tooltip>
      )}
      <div className="p-5">
        {collectModule?.followerOnly && (
          <div className="pb-5">
            <ReferenceAlert
              handle={publication?.profile?.handle}
              isSuperFollow={publication?.profile?.followModule?.__typename === 'FeeFollowModuleSettings'}
              action="collect"
            />
          </div>
        )}
        <div className="pb-2 space-y-1.5">
          <div className="flex items-center space-x-2">
            {publication?.__typename === 'Mirror' && (
              <Tooltip
                content={`Mirror of ${publication?.mirrorOf?.__typename?.toLowerCase()} by ${
                  publication?.mirrorOf?.profile?.handle
                }`}
              >
                <SwitchHorizontalIcon className="w-5 h-5 text-brand" />
              </Tooltip>
            )}
            {publication?.metadata?.name && (
              <div className="text-xl font-bold">{publication?.metadata?.name}</div>
            )}
          </div>
          {publication?.metadata?.description && (
            <div className="text-gray-500 line-clamp-2">
              <Markup>{publication?.metadata?.description}</Markup>
            </div>
          )}
          <ReferralAlert mirror={publication} referralFee={collectModule?.referralFee} />
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
                  Mixpanel.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECTORS);
                }}
              >
                {humanize(count)} collectors
              </button>
              <Modal
                title="Collectors"
                icon={<CollectionIcon className="w-5 h-5 text-brand" />}
                show={showCollectorsModal}
                onClose={() => setShowCollectorsModal(false)}
              >
                <Collectors
                  pubId={
                    publication?.__typename === 'Mirror'
                      ? publication?.mirrorOf?.id
                      : publication?.pubId ?? publication?.id
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
          {collectModule?.recipient && (
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-gray-500" />
              <div className="space-x-1.5">
                <span>Recipient:</span>
                <a
                  href={`${POLYGONSCAN_URL}/address/${collectModule.recipient}`}
                  target="_blank"
                  className="font-bold text-gray-600"
                  rel="noreferrer noopener"
                >
                  {formatAddress(collectModule.recipient)}
                </a>
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
            <IndexStatus txHash={writeData?.hash ? writeData?.hash : broadcastData?.broadcast?.txHash} />
          </div>
        ) : null}
        {isConnected ? (
          allowanceLoading || balanceLoading ? (
            <div className="mt-5 w-28 rounded-lg h-[34px] shimmer" />
          ) : allowed || collectModule.type === 'FreeCollectModule' ? (
            hasAmount ? (
              <Button
                className="mt-5"
                onClick={createCollect}
                disabled={typedDataLoading || signLoading || writeLoading || broadcastLoading}
                icon={
                  typedDataLoading || signLoading || writeLoading || broadcastLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <CollectionIcon className="w-4 h-4" />
                  )
                }
              >
                Collect now
              </Button>
            ) : (
              <WarningMessage className="mt-5" message={<Uniswap module={collectModule} />} />
            )
          ) : (
            <div className="mt-5">
              <AllowanceButton
                title="Allow collect module"
                module={allowanceData?.approvedModuleAllowanceAmount[0]}
                allowed={allowed}
                setAllowed={setAllowed}
              />
            </div>
          )
        ) : null}
      </div>
    </>
  );
};

export default CollectModule;
