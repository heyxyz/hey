// import type { Publication } from 'lens';
// import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { getRoundTippingData } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import getEnvConfig from 'data/utils/getEnvConfig';
import { ethers } from 'ethers';
import type { Dispatch, FC, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { Card } from 'ui';
import { useAccount } from 'wagmi';

// interface Props {
//   icon: ReactNode;
//   publication: Publication;
//   showCount: boolean;
// }

interface ChildrenProps {
  // icon: ReactNode;
  // publication: Publication;
  // showCount: boolean;
  showDetails: boolean;
  setShowDetails: Dispatch<SetStateAction<boolean>>;
  roundOpen: boolean;
  roundInfo: any;
}
const RoundStats: FC<ChildrenProps> = ({ showDetails, roundInfo }) => {
  // const RoundStats: FC<ChildrenProps> = ({ icon, publication, showCount, showDetails, roundOpen }) => {
  function getUniqueVotes(roundResults: any): number {
    const uniqueVotes: Set<string> = new Set();
    for (const vote of roundResults.votingStrategy.votes) {
      uniqueVotes.add(vote.from.toLowerCase());
    }
    return uniqueVotes.size;
  }

  function getTotalAmount(roundResults: any): string {
    const amounts: string[] = roundResults.votingStrategy.votes.map((vote: any) => vote.amount);
    const totalAmount: number = amounts.reduce((total, amount) => total + Number(amount), 0);
    return totalAmount.toString();
  }

  function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  const topic = 'justify-between flex';
  const category = 'text-gray-500';

  return (
    <div
      className={`pt-3 ${
        showDetails ? 'block h-auto transition-all duration-500 ease-in-out' : 'hidden overflow-hidden'
      }`}
    >
      {roundInfo && (
        <div>
          <div className="md:max-lg:px-50">
            <div className={topic}>
              <p className={category}>Amount of Tippers in this Round</p>
              <p>{getUniqueVotes(roundInfo)}</p>
            </div>
            <div className={topic}>
              <p className={category}>Total Tip Amount in this Round</p>
              <p>{ethers.utils.formatEther(getTotalAmount(roundInfo))}</p>
            </div>
            <div className={`pt-3 ${topic}`}>
              <p className={category}>End of matching round</p>
              <p>{formatDate(roundInfo.roundEndTime)}</p>
            </div>
          </div>
          <div className="mb-2 mt-8 text-xs text-gray-500">Tips per post:</div>
          <Card>
            <div className="text-md m-4">
              <div className="my-2">
                <p>Coming to Eth Denver for the first time!</p>
                <p className="text-sm text-red-500">67 tips by 10 voters</p>
              </div>
              <div className="divider w-full" />
              <div className="my-2">
                <p>Some other post</p>
                <p className="text-sm text-red-500">4 tips by 1 voters</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// const ClaimReward: FC<ChildrenProps> = ({ icon, publication, showCount, showDetails, setShowDetails }) => {
const ClaimReward: FC<ChildrenProps> = ({ showDetails, setShowDetails, roundInfo }) => {
  return (
    <div className="alight-items-center flex flex-col">
      <button className="mx-auto  w-60 rounded-full bg-green-100 px-4 py-2 text-green-400">
        Claim Reward
      </button>
      <button onClick={() => setShowDetails(!showDetails)}>
        <p className="mt-4 text-xs text-gray-500 underline">{showDetails ? 'hide' : 'show'} details</p>
      </button>
      <div>
        <RoundStats
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          roundOpen={false}
          roundInfo={roundInfo}
        />
      </div>
    </div>
  );
};

export const ProfileTipsStats: FC = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [roundInfo, setRoundInfo] = useState<any>();
  const [userTippingData, setUserTippingData] = useState<{ amount: string }[]>();
  // alert
  const { address } = useAccount();
  const roundOpen = true;
  const grantsRound = getEnvConfig().GrantsRound.toLowerCase();

  function filterAmountsByAddress(address: string, roundResults: any): { amount: string }[] {
    const amounts: { amount: string }[] = [];
    for (const vote of roundResults.votingStrategy.votes) {
      if (vote.from.toLowerCase() === address.toLowerCase()) {
        amounts.push({ amount: vote.amount });
      }
    }
    return amounts;
  }

  useEffect(() => {
    const getRoundStats = async () => {
      const roundResults = await getRoundTippingData(grantsRound);
      setRoundInfo(roundResults);
      if (address) {
        const userTips = filterAmountsByAddress(address, roundResults);
        if (userTips.length > 0) {
          setUserTippingData(userTips);
        }
      }
    };
    getRoundStats();
  }, [grantsRound, address]);

  function tipsTotal(userTippingData: { amount: string }[] | undefined) {
    if (!userTippingData) {
      return '0';
    }

    const amounts = userTippingData
      .map((tip) => Number(tip.amount))
      .filter((amount) => !Number.isNaN(amount));

    const sum = amounts.reduce((total, amount) => total + amount, 0);
    return sum.toString();
  }

  function getTimeLeft(timestamp: number): string {
    const now = new Date();
    const target = new Date(timestamp * 1000);

    const diff = target.getTime() - now.getTime();
    const diffInHours = diff / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInHoursRemainder = Math.round(diffInHours % 24);

    const daysString = diffInDays === 1 ? '1 day' : `${diffInDays} days`;
    const hoursString = diffInHoursRemainder === 1 ? '1 hour' : `${diffInHoursRemainder} hours`;

    return `${daysString} & ${hoursString}`;
  }

  // const iconClassName = true ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <div>
      <div className="flex justify-center px-10 py-3">
        <div className="mr-3 mt-1">
          <TipsSolidIcon />
        </div>
        <div>
          {userTippingData ? (
            <div className="flex flex-col justify-between">
              <p className="mb-1">You've tipped {userTippingData?.length} times in the current round!</p>
              <p>
                You have tipped a total of {ethers.utils.formatEther(tipsTotal(userTippingData))} WMATIC in
                the current round!
              </p>
            </div>
          ) : null}
          {roundOpen && roundInfo ? (
            <div className="item-center my-auto flex justify-between pt-3 text-xs text-gray-500">
              <div>
                <p>Round ends in {getTimeLeft(roundInfo.roundEndTime)}</p>
              </div>
              <div className="mr-4">
                <button onClick={() => setShowDetails(!showDetails)}>
                  <p className="underline">{showDetails ? 'hide' : 'show'} details</p>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {roundOpen ? (
        <RoundStats
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          roundOpen={roundOpen}
          roundInfo={roundInfo}
        />
      ) : (
        <ClaimReward
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          roundOpen={roundOpen}
          roundInfo={roundInfo}
        />
      )}
    </div>
  );
};
