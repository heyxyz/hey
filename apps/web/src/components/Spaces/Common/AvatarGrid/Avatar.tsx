import { useEventListener, useHuddle01 } from '@huddle01/react/hooks';
import { Image } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import { NestedPeerListIcons } from '../assets/Icons';
import Audio from '../Audio';
import Dropdown from '../Dropdown';
import CoHostData from '../Sidebar/Peers/PeerRole/CoHostData';
import HostData from '../Sidebar/Peers/PeerRole/HostData';
import ListenersData from '../Sidebar/Peers/PeerRole/ListenersData';
import SpeakerData from '../Sidebar/Peers/PeerRole/SpeakerData';
import type { IRoleEnum } from '../SpacesTypes';

type Props = {
  peerId: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role: IRoleEnum;
  avatarUrl: string;
};

const Avatar: FC<Props> = ({ peerId, displayName, mic, role, avatarUrl }) => {
  const { isMyHandRaised, setMyHandRaised, myReaction, setMyReaction } =
    useSpacesStore();

  const { me } = useHuddle01();

  const RoleData = {
    host: <HostData />,
    coHost: <CoHostData peerId={peerId} />,
    speaker: <SpeakerData peerId={peerId} />,
    listener: <ListenersData peerId={peerId} />
  } as const;

  useEventListener('room:data-received', (data) => {
    if (data.fromPeerId === peerId && data.payload['reaction']) {
      setMyReaction(data.payload['reaction']);
      setTimeout(() => {
        setMyReaction('');
      }, 5000);
    }
    if (
      data.fromPeerId === peerId &&
      (data.payload['raiseHand'] == true || data.payload['raiseHand'] == false)
    ) {
      setMyHandRaised(data.payload['raiseHand']);
    }
  });

  useUpdateEffect(() => {
    if (myReaction && peerId === me.meId) {
      setTimeout(() => {
        setMyReaction('');
      }, 5000);
    }
  }, [myReaction]);

  return (
    <div className="relative inline-flex w-16 flex-col items-center justify-start gap-1">
      {mic && <Audio track={mic} />}
      <div className="group relative h-10 w-10">
        <Image
          src={avatarUrl}
          className="h-10 w-10 items-center justify-center rounded-full"
        />
        {me.role === 'host' ||
        (me.role === 'coHost' &&
          (me.meId === peerId || ['speaker', 'listener'].includes(role))) ||
        ((me.role === 'speaker' || me.role === 'listener') &&
          me.meId === peerId) ? (
          <>
            <div className="absolute inset-0 rounded-full group-hover:bg-black group-hover:opacity-50" />
            <Dropdown
              triggerChild={
                <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform opacity-0 group-hover:opacity-100">
                  {NestedPeerListIcons.active.more}
                </button>
              }
              align="end"
            >
              <div className="absolute -left-2 -top-4 w-[10rem] rounded-lg border border-neutral-300 bg-white p-1 dark:border-neutral-500 dark:bg-neutral-800">
                <div className="inline-flex w-full items-center justify-start gap-3 px-2.5 py-1.5">
                  <Image
                    src={avatarUrl}
                    className="flex h-5 w-5 basis-0 items-center justify-start gap-2 rounded-full"
                  />
                  <div className="shrink grow basis-0 text-sm font-medium leading-tight text-neutral-700 dark:text-stone-200">
                    <Trans>{displayName}</Trans>
                  </div>
                </div>
                {RoleData?.[role]}
              </div>
            </Dropdown>
          </>
        ) : null}
      </div>
      <div className="flex flex-col items-center justify-start gap-0.5">
        <div className="text-xs font-normal leading-none text-neutral-700 dark:text-neutral-300">
          <Trans>{displayName}</Trans>
        </div>
      </div>
      <div className="text-xs font-normal leading-none text-neutral-500 dark:text-slate-400">
        <Trans>{role}</Trans>
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
