import Claps from '@components/Publication/Actions/Claps';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import type { Publication } from 'lens';
import type { FC, ReactNode } from 'react';

import { Card } from './Card';

interface Props {
  icon: ReactNode;
  publication: Publication;
  showCount: boolean;
}

// export const NotificationBanner: FC<Props> = ({ icon, publication, showCount }) => {
export const NotificationBanner: FC<Props> = ({ publication, showCount }) => {
  const iconClassName = showCount ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';
  return (
    <Card>
      <div className="grid justify-items-left p-5 space-y-2 m-3">
        <div className="text-green-500">{`You've clapped ${publication.stats.totalUpvotes} times for this post!`}</div>
        <div>
          It has received 9885 claps of 44 users in total for 10,500 DAI. It will be matched with 20000 DAI.
        </div>
        <div className="flex justify-between pt-3">
          <div>
            <Claps publication={publication} showCount={showCount} />
          </div>
          <div className="flex justify-between text-gray-500 text-sm items-center my-auto">
            <text className="mr-3">This matching round will end in # days</text>
            <QuestionMarkCircleIcon className={iconClassName} />
          </div>
        </div>
      </div>
    </Card>
  );
};
``;
