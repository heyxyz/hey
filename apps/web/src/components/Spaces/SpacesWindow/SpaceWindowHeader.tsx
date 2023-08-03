import Slug from '@components/Shared/Slug';
import React from 'react';

import Icons from '../Common/assets/Icons';

type Props = {};

const SpaceWindowHeader = (props: Props) => {
  return (
    <div className="border-b border-neutral-700 pb-3">
      {/* Nav */}
      <div>
        <div className="flex items-center justify-between">
          <div>{Icons.chevronUp}</div>
          <div className="flex items-center gap-3">
            <div>{Icons.share}</div>
            <div>{Icons.more}</div>
            <div className="text-sm text-violet-500">Leave</div>
          </div>
        </div>
        <div className="my-1 text-base font-medium leading-normal text-zinc-200">
          My first spaces with Lenster
        </div>
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 rounded-full bg-violet-500" />
          <Slug slug="@johndoe" className="text-sm font-normal" />
          <div>{Icons.verified}</div>
        </div>
      </div>
    </div>
  );
};

export default SpaceWindowHeader;
