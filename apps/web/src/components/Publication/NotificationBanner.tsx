import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { getTokenName } from '@components/utils/getTokenName';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { ethers } from 'ethers';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { Card } from 'ui/src/Card';
import { useChainId } from 'wagmi';

import {
  useGetPostQuadraticTipping,
  useGetPublicationMatchData,
  useGetRoundInfo
} from './Actions/Tip/QuadraticQueries/grantsQueries';

interface Props {
  publication: Publication;
  showCount: boolean;
  roundAddress?: string;
}

// export const NotificationBanner: FC<Props> = ({ icon, publication, showCount }) => {
export const NotificationBanner: FC<Props> = ({ publication, showCount, roundAddress }) => {
  const { data: matchUpdate } = useGetPublicationMatchData(roundAddress, publication.id);
  const { data: roundInfo } = useGetRoundInfo(roundAddress);
  const { data: postQuadraticTipping } = useGetPostQuadraticTipping(publication.id, roundAddress);
  const chainId = useChainId();

  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

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

  const getDaysAgo = (end: number) => {
    const current = Date.now();
    const diffTime = Math.abs(current - end * 1000);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card>
      <div className="justify-items-left m-3 grid space-y-2 p-5">
        <div className="flex">
          <div className="mt-1 flex">
            <TipsSolidIcon color="black" />
          </div>
          <div className="ml-3">
            {`This post has received ${postQuadraticTipping?.votes.length} ${
              postQuadraticTipping?.votes.length === 1 ? 'tip' : 'tips'
            }! `}
          </div>
        </div>

        {!!(matchUpdate && roundInfo) && (
          <div>
            This post has received {ethers.utils.formatEther(postQuadraticTipping?.voteTipTotal)} in tips from{' '}
            {matchUpdate.uniqueContributorsCount} users. It received {matchUpdate.matchAmountInToken}{' '}
            {getTokenName(roundInfo.token, { id: chainId })} in matching.
          </div>
        )}
        {roundInfo && (
          <div className="flex justify-between pt-3">
            <div className="my-auto flex items-center justify-between text-sm text-gray-500">
              <p className="mr-3">
                {roundInfo.roundEndTime !== 0 && Date.now() < roundInfo.roundEndTime * 1000
                  ? `This matching round will end in ${getTimeLeft(roundInfo.roundEndTime)}`
                  : `This round ended ${getDaysAgo(roundInfo.roundEndTime)} day(s) ago.`}
              </p>
              <QuestionMarkCircleIcon className={iconClassName} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
``;
