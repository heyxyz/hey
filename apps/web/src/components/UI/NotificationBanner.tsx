import { getRoundTippingData } from '@components/Publication/Actions/Collect/quadraticUtils/utils';
import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { SANDBOX_GRANTS_ROUND } from 'data/contracts';
import type { Publication } from 'lens';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { Card } from './Card';

interface Props {
  icon: ReactNode;
  publication: Publication;
  showCount: boolean;
}

// export const NotificationBanner: FC<Props> = ({ icon, publication, showCount }) => {
export const NotificationBanner: FC<Props> = ({ publication, showCount }) => {
  const [count, setCount] = useState(0);
  const [roundInfo, setRoundInfo] = useState<any>();
  const isMirror = publication.__typename === 'Mirror';
  const hasCollected = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;
  const totalUpvotes = publication?.stats?.totalUpvotes;
  const grantsRound = SANDBOX_GRANTS_ROUND.toLowerCase();

  useEffect(() => {
    if (
      isMirror
        ? publication?.mirrorOf?.stats?.totalAmountOfCollects
        : publication?.stats?.totalAmountOfCollects
    ) {
      setCount(
        publication.__typename === 'Mirror'
          ? publication?.mirrorOf?.stats?.totalAmountOfCollects
          : publication?.stats?.totalAmountOfCollects
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);
  useEffect(() => {
    const getRoundStats = async () => {
      const roundResults = await getRoundTippingData(grantsRound);
      setRoundInfo(roundResults);
    };
    getRoundStats();
  }, [grantsRound]);
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
  return (
    <Card>
      <div className="justify-items-left m-3 grid space-y-2 p-5">
        <div className="flex">
          <div className="mt-1 flex">
            <TipsSolidIcon />
          </div>
          <div className="ml-3 text-red-500">{`This post has received ${publication.stats.totalAmountOfCollects} tips!`}</div>
        </div>

        {/* <div>
          This post has received 9885 tips of 44 users in total for 10,500 DAI. It will be matched with 20000
          DAI.
        </div> */}
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
