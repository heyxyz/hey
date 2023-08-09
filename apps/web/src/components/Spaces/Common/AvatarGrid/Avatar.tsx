import { Image } from '@lenster/ui';
import React from 'react';

import type { IRoleEnum } from '../SpacesTypes';

type Props = {
  peerId: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role: IRoleEnum;
  avatarUrl: string;
};

const Avatar = (props: Props) => {
  return (
    <div className="inline-flex w-16 flex-col items-center justify-start gap-1">
      <Image
        src={props.avatarUrl}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-500"
      />
      <div className="flex flex-col items-center justify-start gap-0.5">
        <div className="text-xs font-normal leading-none text-neutral-300">
          {props.displayName}
        </div>
      </div>
      <div className="text-xs font-normal leading-none text-slate-400">
        {props.role}
      </div>
    </div>
  );
};

export default Avatar;
