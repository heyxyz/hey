import Markup from '@components/Shared/Markup';
import Collectors from '@components/Shared/Modal/Collectors';
import Uniswap from '@components/Shared/Uniswap';
import { ClockIcon, CollectionIcon, UsersIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { formatTime } from '@lib/formatTime';
import getCoingeckoPrice from '@lib/getCoingeckoPrice';
// import { Leafwatch } from 'lib/leafwatch';
import onError from '@lib/onError';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { LensHub, QuadraticVoteCollectModule } from 'abis';
import { LENSHUB_PROXY } from 'data/constants';
import getEnvConfig from 'data/utils/getEnvConfig';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import type { ElectedMirror, Publication } from 'lens';
import { CollectModules, useApprovedModuleAllowanceAmountQuery } from 'lens';
import getAssetAddress from 'lib/getAssetAddress';
import getTokenImage from 'lib/getTokenImage';
import humanize from 'lib/humanize';
import type { Dispatch, FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Button, Modal, Spinner, WarningMessage } from 'ui';
import { useAccount, useBalance, useContractRead, useContractWrite } from 'wagmi';

import TipsOutlineIcon from '../../../Shared/TipIcons/TipsOutlineIcon';
import { getRoundInfo } from './QuadraticQueries/grantsQueries';
import { getVotesbyPubId } from './QuadraticQueries/voteCollectQueries';
interface Props {
  count: number;
  setCount: Dispatch<number>;
  publication: Publication;
  electedMirror?: ElectedMirror;
  setShowCollectModal?: Dispatch<boolean>;
}

export interface QuadraticCollectModuleData {
  __typename?: string;
  type: CollectModules;
  contractAddress: any;
  followerOnly: boolean;
  endTimestamp: Date;
  votingStrategy: string;
  grantsRound: string;
  amount: {
    __typename?: string;
    value: string;
    asset: { __typename?: string; symbol: string; decimals: number; address: any };
  };
}

const quadraticModuleSettings: QuadraticCollectModuleData = {
  __typename: 'UnknownCollectModuleSettings',
  type: CollectModules.UnknownCollectModule,
  contractAddress: '',
  followerOnly: false,
  endTimestamp: new Date(0),
  votingStrategy: '',
  grantsRound: '',
  amount: {
    __typename: 'ModuleFeeAmount',
    value: '0',
    asset: { __typename: 'Erc20', symbol: 'WMATIC', decimals: 18, address: '' }
  }
};

const QuadraticModule: FC<Props> = ({ count, setCount, publication, electedMirror, setShowCollectModal }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [revenue, setRevenue] = useState(0);
  const [hasCollectedByMe, setHasCollectedByMe] = useState(publication?.hasCollectedByMe);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();
  const [collectModule, setCollectModule] = useState<QuadraticCollectModuleData>(quadraticModuleSettings);

  const [moduleAllowed, setModuleAllowed] = useState(false);
  const [votingStrategyAllowed, setVotingStrategyAllowed] = useState(false);
  const [allAllowancesLoading, setAllAllowancesLoading] = useState(true);
  const [postTipTotal, setPostTipTotal] = useState(0);
  const [readyToDisplay, setReadyToDisplay] = useState(false);

  useEffect(() => {
    const fetchPostInfo = async () => {
      if (address && publication?.id) {
        const votes = await getVotesbyPubId(publication?.id);
        let voteTipTotal = 0;
        for (const vote of votes) {
          voteTipTotal += parseFloat(vote?.amount);
        }
        setPostTipTotal(voteTipTotal);
      }
    };
    fetchPostInfo();
  }, [address, publication?.id]);

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    token: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    formatUnits: 18,
    watch: true
  });

  let hasAmount = false;
  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(collectModule?.amount.value)) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  // const onCompleted = () => {
  //   setRevenue(revenue + parseFloat(collectModule?.amount?.value));
  //   setCount(count + 1);
  //   setHasCollectedByMe(true);
  //   toast.success(t`Collected successfully!`);
  //   setTimeout(() => {
  //     setShowCollectModal && setShowCollectModal(false);
  //   }, 2000);

  // };

  // needs to change to subgraph
  const { isFetching, refetch } = useContractRead({
    address: getEnvConfig().QuadraticVoteCollectModuleAddress,
    abi: QuadraticVoteCollectModule,
    functionName: 'getPublicationData',
    args: [parseInt(publication.profile?.id), parseInt(publication?.id.split('-')[1])]
  });

  const { isFetched: votingApprovalFetched } = useContractRead({
    address: collectModule?.amount?.asset?.address,
    abi: ['function allowance(address owner, address spender) view returns (uint256)'],
    functionName: 'allowance',
    args: [address, collectModule?.votingStrategy],
    onSettled(data: any) {
      setVotingStrategyAllowed(data?._hex !== '0x00');
    }
  });
  // change to votingStrategy (both)
  const { isLoading: writeLoading, write } = useContractWrite({
    address: LENSHUB_PROXY,
    abi: LensHub,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    // onSuccess: onCompleted,
    onError
  });

  const { data: allowanceData, loading: allowanceLoading } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        unknownCollectModules: [getEnvConfig().QuadraticVoteCollectModuleAddress],
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !currentProfile,
    onCompleted: (data) => {
      setModuleAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  useEffect(() => {
    async function fetchRoundInfo(grantsRound: string) {
      try {
        const roundInfo = await getRoundInfo(grantsRound);
        return roundInfo;
      } catch (error) {
        console.error('Error fetching round info:', error);
        return null;
      }
    }

    const round = fetchRoundInfo('0x19ca73094619006f143277b8a1b90c4da5e26bb4');
    console.log('roundInfo: ', round);
  }, []);

  // useEffect(() => {
  //   if (moduleAllowed && votingStrategyAllowed && votingApprovalFetched) {
  //     setAllowed(true);
  //   } else {
  //     setAllowed(false);
  //   }
  //   if (allowanceLoading || !votingApprovalFetched) {
  //     setAllAllowancesLoading(true);
  //   } else {
  //     setAllAllowancesLoading(false);
  //   }
  //   if (!allAllowancesLoading) {
  //     setReadyToDisplay(true);
  //   } else {
  //     setReadyToDisplay(false);
  //   }
  // }, [moduleAllowed, votingStrategyAllowed, allowanceLoading, votingApprovalFetched, allAllowancesLoading]);

  const { data: usdPrice } = useQuery(
    ['coingeckoData'],
    () => getCoingeckoPrice(getAssetAddress(collectModule?.amount?.asset?.symbol)).then((res) => res),
    { enabled: Boolean(collectModule?.amount) }
  );

  const isLoading = isFetching || writeLoading || balanceLoading || allowanceLoading;
  const resetAmount = () => {
    setCollectModule((prevState) => ({
      ...prevState,
      amount: {
        ...prevState.amount,
        value: quadraticModuleSettings.amount.value
      }
    }));
  };

  return (
    <div className="p-5">
      <div className="mb-2 flex items-center space-x-2">
        {currentProfile &&
          (allowanceLoading ? (
            <div className="shimmer h-[34px] w-28 rounded-lg" />
          ) : allowed ? (
            hasAmount ? (
              <div className="flex w-full justify-between">
                <input
                  className="mr-2 w-4/6 rounded"
                  type="number"
                  step="0.0001"
                  placeholder="How much do you want to tip?"
                  value={collectModule.amount.value}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (value === '' || value === '.') {
                      setCollectModule((prevState) => ({
                        ...prevState,
                        amount: {
                          ...prevState.amount,
                          value: '0'
                        }
                      }));
                    } else {
                      setCollectModule((prevState) => ({
                        ...prevState,
                        amount: {
                          ...prevState.amount,
                          value: Math.max(parseFloat(value), 0).toString()
                        }
                      }));
                    }
                  }}
                />

                <Button
                  onClick={() => console.log('clicked')}
                  disabled={isLoading}
                  icon={isLoading ? <Spinner size="xs" /> : <TipsOutlineIcon color="white" />}
                  className="flex w-2/6 justify-center"
                >
                  <div className="flex items-center">
                    <Trans>Tip</Trans>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="flex flex-1 items-center">
                <div>
                  <WarningMessage message={<Uniswap module={collectModule} />} />
                </div>

                <div className="mx-auto flex items-center">
                  <div className="flex w-full justify-center">
                    <Button className="text-center" onClick={resetAmount}>
                      Reset Amount
                    </Button>
                  </div>
                </div>
              </div>
            )
          ) : null)}
      </div>

      {/* <AllowanceButton
        title="Allow collect module"
        module={allowanceData?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmount}
        allowed={allowed}
        setAllowed={setAllowed}
        readyToDisplay={readyToDisplay}
        {...(collectModule ? { collectModule: collectModule } : {})}
      /> */}
      <div className="space-y-1.5 pb-2">
        {publication?.metadata?.name && (
          <div className="text-xl font-bold">{publication?.metadata?.name}</div>
        )}
        {publication?.metadata?.content && (
          <Markup className="lt-text-gray-500 line-clamp-2">{publication?.metadata?.content}</Markup>
        )}
      </div>
      {collectModule?.amount && (
        <div className="flex items-center space-x-1.5 py-2">
          <img
            className="h-7 w-7"
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
                <span className="lt-text-gray-500 px-0.5">·</span>
                <span className="lt-text-gray-500 text-xs font-bold">
                  ${(parseFloat(collectModule.amount.value) * usdPrice).toFixed(5)}
                </span>
              </>
            ) : null}
          </span>
        </div>
      )}
      <div className="space-y-1.5">
        <div className="item-center block space-y-1 sm:flex sm:space-x-5">
          <div className="flex items-center space-x-2">
            <UsersIcon className="lt-text-gray-500 h-4 w-4" />
            <button
              className="font-bold"
              type="button"
              onClick={() => {
                setShowCollectorsModal(!showCollectorsModal);
                // Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECTORS);
              }}
            >
              <div>
                {humanize(count)} tips totaling {ethers.utils.formatEther(postTipTotal)}{' '}
                {collectModule?.amount?.asset?.symbol}
              </div>
            </button>
            <Modal
              title={t`Collected by`}
              icon={<CollectionIcon className="text-brand h-5 w-5" />}
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
        </div>
        {collectModule?.endTimestamp && (
          <div className="flex items-center space-x-2">
            <ClockIcon className="lt-text-gray-500 h-4 w-4" />
            <div className="space-x-1.5">
              <span>
                <Trans>Round Ends:</Trans>
              </span>
              <span className="font-bold text-gray-600" title={formatTime(collectModule?.endTimestamp)}>
                {dayjs(collectModule?.endTimestamp).format('MMMM DD, YYYY')} at{' '}
                {dayjs(collectModule?.endTimestamp).format('hh:mm a')}
              </span>
            </div>
          </div>
        )}
      </div>
      {publication?.hasCollectedByMe && (
        <div className="mt-3 flex items-center space-x-1.5 font-bold text-green-500">
          <CheckCircleIcon className="h-5 w-5" />
          <div>
            <Trans>You have tipped this post!</Trans>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuadraticModule;
