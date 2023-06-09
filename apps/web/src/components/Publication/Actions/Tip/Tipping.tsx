import Markup from '@components/Shared/Markup';
import Collectors from '@components/Shared/Modal/Collectors';
import Uniswap from '@components/Shared/Uniswap';
import { ClockIcon, CollectionIcon, UsersIcon, MinusIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { formatTime } from '@lib/formatTime';
import getCoingeckoPrice from '@lib/getCoingeckoPrice';
import onError from '@lib/onError';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import { RoundImplementation } from 'abis';
import dayjs from 'dayjs';
import { ethers } from 'ethers';
import type { Publication } from 'lens';
import { CollectModules } from 'lens';
import getAssetAddress from 'lib/getAssetAddress';
import toast from 'react-hot-toast';
import getTokenImage from 'lib/getTokenImage';
import humanize from 'lib/humanize';
import type { Dispatch, FC } from 'react';
import { useEffect, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { Button, Modal, Spinner, WarningMessage } from 'ui';
import {
  useAccount,
  useBalance,
  useContractRead,
  useSendTransaction,
  useWaitForTransaction,
  useContractWrite
} from 'wagmi';

import TipsOutlineIcon from '../../../Shared/TipIcons/TipsOutlineIcon';
import { getRoundInfo } from './QuadraticQueries/grantsQueries';
import { getVotesbyPubId } from './QuadraticQueries/voteCollectQueries';
import { parseEther } from 'ethers/lib/utils.js';
interface Props {
  count: number;
  setCount: Dispatch<number>;
  publication: Publication;
  setShowTipModal?: Dispatch<boolean>;
  roundAddress: string;
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

const Tipping: FC<Props> = ({ count, setCount, publication, roundAddress, setShowTipModal }) => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  // const [revenue, setRevenue] = useState(0);
  // const [hasCollectedByMe, setHasCollectedByMe] = useState(publication?.hasCollectedByMe);
  const [showCollectorsModal, setShowCollectorsModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const { address } = useAccount();

  const [collectModule, setCollectModule] = useState<QuadraticCollectModuleData>(quadraticModuleSettings);

  const [votingStrategyAllowed, setVotingStrategyAllowed] = useState(false);
  const [tipAmount, setTipAmount] = useState('0');
  const [postTipTotal, setPostTipTotal] = useState(0);
  const [roundInfo, setRoundInfo] = useState({
    id: '',
    payoutStrategy: '',
    roundEndTime: '',
    roundStartTime: '',
    token: '',
    votingStrategy: {
      id: ''
    }
  });

  // Get and store round info
  useEffect(() => {
    async function fetchRoundInfo(roundAddress: string) {
      try {
        const round = await getRoundInfo(roundAddress);
        if (round) {
          setRoundInfo(round);
        }
      } catch (error) {
        console.error('Error fetching round info:', error);
        return null;
      }
    }

    fetchRoundInfo(roundAddress);
  }, [roundAddress]);

  // Get user balance. need to dynamically change token address, or just use wmatic
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    token: roundInfo.token as `0x${string}`,
    formatUnits: 18,
    watch: true
  });

  let hasAmount = false;

  if (balanceData && parseFloat(balanceData?.formatted) < parseFloat(tipAmount)) {
    hasAmount = false;
  } else {
    hasAmount = true;
  }

  // Get and store post info

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

  // **********
  // CHECK VOTING STRATEGY ALLOWANCE
  // **********
  const { isFetched: votingApprovalFetched } = useContractRead({
    address: roundInfo.token as `0x${string}`,
    abi: ['function allowance(address owner, address spender) view returns (uint256)'],
    functionName: 'allowance',
    args: [address, roundInfo.votingStrategy.id],
    onSettled(data: any) {
      const hexTipAmount = ethers.BigNumber.from(tipAmount).toHexString();
      const dataValue = data ? ethers.BigNumber.from(data._hex) : ethers.BigNumber.from(0);
      const comparisonResult = dataValue.gt(hexTipAmount) && !dataValue.isZero();
      setVotingStrategyAllowed(comparisonResult);
    }
  });

  // **********
  // ALLOWANCES
  // **********
  const {
    data: txData,
    isLoading: transactionLoading,
    sendTransaction
  } = useSendTransaction({
    request: {},
    mode: 'recklesslyUnprepared',
    onError
  });
  const { isLoading: waitLoading } = useWaitForTransaction({
    hash: txData?.hash,
    onSuccess: () => {
      toast.success(allowed ? t`Module disabled successfully!` : t`Module enabled successfully!`);
      setShowWarningModal(false);
      setAllowed(!allowed);
    },
    onError
  });

  const handleAllowance = (customAllowance?: string) => {
    const abi = ['function approve(address spender, uint256 value)'];
    let iface = new ethers.utils.Interface(abi);

    const approveVotingStrategy = iface.encodeFunctionData('approve', [
      roundInfo.votingStrategy.id,
      tipAmount === '0' ? 0 : customAllowance ? customAllowance : tipAmount
    ]);

    sendTransaction?.({
      recklesslySetUnpreparedRequest: {
        from: address,
        to: roundInfo.token as `0x${string}`,
        data: approveVotingStrategy
      }
    });
  };

  let encodedData;

  if (roundInfo.token.length > 0 && publication?.id) {
    const postId = publication?.id.split('-')[1];
    let postIdBN = ethers.BigNumber.from(postId);
    const bytesPostId = ethers.utils.hexZeroPad(postIdBN.toHexString(), 32);

    encodedData = ethers.utils.defaultAbiCoder.encode(
      ['address', 'address', 'uint256', 'address', 'bytes32'],
      [address, roundInfo.token, 1000000, publication.profile.ownedBy, bytesPostId]
    );
  }

  const {
    isLoading: writeLoading,
    data,
    isSuccess,
    write
  } = useContractWrite({
    address: roundAddress as `0x${string}`,
    abi: RoundImplementation,
    functionName: 'vote',
    args: [[encodedData]],
    overrides: {
      from: address,
      value: ethers.utils.parseEther('0.0001')
    },
    mode: 'recklesslyUnprepared'
  });

  const { data: usdPrice } = useQuery(
    ['coingeckoData'],
    () => getCoingeckoPrice(getAssetAddress(collectModule?.amount?.asset?.symbol)).then((res) => res),
    { enabled: Boolean(collectModule?.amount) }
  );

  const isLoading = writeLoading || balanceLoading;

  const resetAmount = () => {
    setTipAmount('0');
  };

  return (
    <div className="p-5">
      <div className="mb-2 flex items-center space-x-2">
        {currentProfile &&
          (allowed ? (
            hasAmount ? (
              <div className="flex w-full flex-col">
                <div className="flex items-stretch">
                  <input
                    className="mr-2 flex-grow rounded"
                    type="number"
                    step="0.0001"
                    placeholder="How much do you want to tip?"
                    value={tipAmount}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      if (value === '' || value === '.') {
                        setTipAmount('0');
                      } else {
                        setTipAmount(Math.max(parseFloat(value), 0).toString());
                      }
                    }}
                  />

                  <Button
                    onClick={votingStrategyAllowed ? () => write() : () => handleAllowance()}
                    disabled={isLoading || tipAmount === '0'}
                    icon={isLoading ? <Spinner size="xs" /> : <TipsOutlineIcon color="white" />}
                    className="flex w-2/6 justify-center"
                  >
                    <div className="flex items-center">
                      <Trans>{votingStrategyAllowed ? 'Tip' : 'Approve and Tip'}</Trans>
                    </div>
                  </Button>
                </div>

                {allowed && (
                  <div className="mt-2 flex w-full justify-end text-xs">
                    <Button
                      variant="warning"
                      icon={
                        transactionLoading || waitLoading ? (
                          <Spinner variant="warning" size="xs" />
                        ) : (
                          <MinusIcon className="h-4 w-4" />
                        )
                      }
                      onClick={() => handleAllowance('0')}
                    >
                      <Trans>Revoke Allowance</Trans>
                    </Button>
                  </div>
                )}
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

            <div>
              {humanize(count)} tips totaling {ethers.utils.formatEther(postTipTotal)}{' '}
              {collectModule?.amount?.asset?.symbol}
            </div>
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

export default Tipping;
