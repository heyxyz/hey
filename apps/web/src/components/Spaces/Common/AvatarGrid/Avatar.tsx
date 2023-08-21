import { useEventListener, useHuddle01 } from '@huddle01/react/hooks';
import { Image } from '@lenster/ui';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import Audio from '../Audio';
import type { IRoleEnum } from '../SpacesTypes';

type Props = {
  peerId: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role: IRoleEnum;
  avatarUrl: string;
};

const Avatar = (props: Props) => {
  const { isMyHandRaised, setMyHandRaised, myReaction, setMyReaction } =
    useSpacesStore();

  const { me } = useHuddle01();

  useEventListener('room:data-received', (data) => {
    if (data.fromPeerId === props.peerId && data.payload['reaction']) {
      setMyReaction(data.payload['reaction']);
      setTimeout(() => {
        setMyReaction('');
      }, 5000);
    }
    if (
      data.fromPeerId === props.peerId &&
      (data.payload['raiseHand'] == true || data.payload['raiseHand'] == false)
    ) {
      setMyHandRaised(data.payload['raiseHand']);
    }
  });

  useUpdateEffect(() => {
    if (myReaction && props.peerId === me.meId) {
      setTimeout(() => {
        setMyReaction('');
      }, 5000);
    }
  }, [myReaction]);

  return (
    <div className="relative inline-flex w-16 flex-col items-center justify-start gap-1">
      {props.mic && <Audio track={props.mic} />}
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
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 text-2xl">
        {myReaction}
      </div>
      {isMyHandRaised && (
        <div className="bg-brand-500 absolute -top-2 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-neutral-800 text-sm">
          ✋
        </div>
      )}
    </div>
  );
};

export default Avatar;
