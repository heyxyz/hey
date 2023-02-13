import TipsSolidIcon from '@components/Shared/TipIcons/TipsSolidIcon';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import nFormatter from '@lib/nFormatter';
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
  const isMirror = publication.__typename === 'Mirror';
  const hasCollected = isMirror ? publication?.mirrorOf?.hasCollectedByMe : publication?.hasCollectedByMe;
  const totalUpvotes = publication?.stats?.totalUpvotes;

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
  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';
  return (
    <Card>
      <div className="justify-items-left m-3 grid space-y-2 p-5">
        <div className="flex">
          <div className="mt-1 flex">
            <TipsSolidIcon />
          </div>
          <div className="ml-3 text-red-500">{`You've tipped ${publication.stats.totalUpvotes} times for this post!`}</div>
          {count > 0 && !showCount && <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>}
        </div>

        <div>
          This post has received 9885 tips of 44 users in total for 10,500 DAI. It will be matched with 20000
          DAI.
        </div>
        <div className="flex justify-between pt-3">
          <div className="my-auto flex items-center justify-between text-sm text-gray-500">
            <p className="mr-3">This matching round will end in # days</p>
            <QuestionMarkCircleIcon className={iconClassName} />
          </div>
        </div>
      </div>
    </Card>
  );
};
``;
