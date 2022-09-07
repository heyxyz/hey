import Markup from '@components/Shared/Markup';
import UserProfile from '@components/Shared/UserProfile';
import { Profile } from '@generated/types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { FC } from 'react';
import { useAppStore } from 'src/store/app';

dayjs.extend(relativeTime);

interface Props {
  txn: any;
}

const QueuedPublication: FC<Props> = ({ txn }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <article className="p-5">
      <div className="pb-4">
        <UserProfile profile={currentProfile as Profile} />
      </div>
      <div className="ml-[53px] break-words">
        <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
          <Markup>{txn?.content}</Markup>
        </div>
      </div>
    </article>
  );
};

export default QueuedPublication;
