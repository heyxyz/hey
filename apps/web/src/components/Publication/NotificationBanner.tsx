import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import getEnvConfig from 'data/utils/getEnvConfig';
import { ethers } from 'ethers';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Card } from 'ui/src/Card';

import { getPostQuadraticTipping } from './Actions/Tip/QuadraticQueries/grantsQueries';

interface Props {
  publication: Publication;
  showCount: boolean;
}

// export const NotificationBanner: FC<Props> = ({ icon, publication, showCount }) => {
export const NotificationBanner: FC<Props> = ({ publication, showCount }) => {
  const [roundInfo, setRoundInfo] = useState<any>();
  const [votes, setVotes] = useState<any>([]);
  const [postTipTotal, setPostTipTotal] = useState(0);

  const grantsRound = getEnvConfig().GrantsRound;

  useEffect(() => {
    const getPostInfo = async () => {
      const roundResults = await getPostQuadraticTipping(publication.id, grantsRound);
      if (!roundResults) {
        return;
      }
      setRoundInfo(roundResults);
      console.log('roundResults', roundResults);
      const votes = roundResults?.votes || [];
      setVotes(votes);
      let voteTipTotal = 0;
      for (const vote of votes) {
        voteTipTotal += parseFloat(vote?.amount);
      }
      setPostTipTotal(voteTipTotal);
    };
    getPostInfo();
  }, [grantsRound, publication.id]);

  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  const uniqueCollectors = new Set(votes.map((vote: any) => vote?.collector)).size;

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
  return (
    <Card>
      <div className="justify-items-left m-3 grid space-y-2 p-5">
        <div className="flex">
          <div className="mt-1 flex">
            <TipsSolidIcon color="black" />
          </div>
          <div className="ml-3">{`This post has received ${votes.length} tips!`}</div>
        </div>

        <div>
          This post has received {ethers.utils.formatEther(postTipTotal)} in tips from {uniqueCollectors}{' '}
          users.
        </div>
        {roundInfo && (
          <div className="flex justify-between pt-3">
            <div className="my-auto flex items-center justify-between text-sm text-gray-500">
              <p className="mr-3">This matching round will end in {getTimeLeft(roundInfo.roundEndTime)}</p>
              <QuestionMarkCircleIcon className={iconClassName} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
``;
