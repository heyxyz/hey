import { DotsVerticalIcon } from '@heroicons/react/outline';
import { useEventListener, useHuddle01 } from '@huddle01/react/hooks';
import { Image } from '@lenster/ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { SpacesEvents } from 'src/enums';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

import Audio from '../Audio';
import Dropdown from '../Dropdown';
import CoHostData from '../Sidebar/Peers/PeerRole/CoHostData';
import HostData from '../Sidebar/Peers/PeerRole/HostData';
import ListenersData from '../Sidebar/Peers/PeerRole/ListenersData';
import SpeakerData from '../Sidebar/Peers/PeerRole/SpeakerData';
import type { RoleEnum } from '../SpacesTypes';

interface AvatarProps {
  peerId?: string;
  displayName: string;
  mic?: MediaStreamTrack | null;
  role?: RoleEnum;
  avatarUrl: string;
}

const Avatar: FC<AvatarProps> = ({
  peerId,
  displayName,
  mic,
  role,
  avatarUrl
}) => {
  const { isMyHandRaised, setMyHandRaised, myReaction, setMyReaction } =
    useSpacesStore();
  const [reaction, setReaction] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const { me } = useHuddle01();

  const shouldShowDropdown =
    me.role === 'host' ||
    (me.role === 'coHost' &&
      role !== undefined &&
      (me.meId === peerId || ['speaker', 'listener'].includes(role))) ||
    ((me.role === 'speaker' || me.role === 'listener') && me.meId === peerId);

  const RoleData = {
    host: <HostData />,
    coHost: peerId ? <CoHostData peerId={peerId} /> : null,
    speaker: peerId ? <SpeakerData peerId={peerId} /> : null,
    listener: peerId ? <ListenersData peerId={peerId} /> : null
  } as const;

  useEventListener(SpacesEvents.ROOM_DATA_RECEIVED, (data) => {
    if (data.fromPeerId === peerId && data.payload['reaction']) {
      setReaction(data.payload['reaction']);
      setTimeout(() => {
        setReaction('');
      }, 5000);
    }
    if (data.fromPeerId === peerId) {
      setIsHandRaised(data.payload['raiseHand']);
    }
  });

  useUpdateEffect(() => {
    if (peerId === me.meId) {
      setIsHandRaised(isMyHandRaised);
    }
  }, [isMyHandRaised]);

  useUpdateEffect(() => {
    if (myReaction && peerId === me.meId) {
      setReaction(myReaction);
      setTimeout(() => {
        setReaction('');
      }, 5000);
    }
  }, [myReaction]);

  return (
    <div className="relative inline-flex w-16 flex-col items-center justify-start gap-1">
      {mic && <Audio track={mic} />}
      <div className="group relative h-10 w-10">
        <Image src={avatarUrl} className="h-10 w-10 rounded-full" />
        {shouldShowDropdown && isMenuOpen ? (
          <>
            <div className="absolute inset-0 rounded-full group-hover:bg-black group-hover:opacity-50" />
            <Dropdown
              triggerChild={
                <DotsVerticalIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-50 opacity-0 group-hover:opacity-100" />
              }
            >
              <div className="absolute -left-4 -top-5 w-40 rounded-lg border border-gray-300 bg-white p-1 dark:border-gray-500 dark:bg-gray-800">
                <div className="inline-flex w-full items-center justify-start gap-3 px-2 py-1.5">
                  <Image
                    src={avatarUrl}
                    className="h-5 w-5 gap-2 rounded-full"
                  />
                  <div className="text-sm font-medium leading-tight text-gray-700 dark:text-gray-200">
                    {displayName}
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)}>
                  {role ? RoleData?.[role] : null}
                </button>
              </div>
            </Dropdown>
          </>
        ) : null}
      </div>
      <div className="text-xs font-normal text-gray-700 dark:text-gray-300">
        {displayName}
      </div>
      <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
        {role}
      </div>
      <div className="absolute left-1/2 top-1 -translate-x-1/2 text-2xl">
        {reaction}
      </div>
      {isHandRaised && (
        <div className="bg-brand-500 absolute -top-2 right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-800 text-sm">
          ✋
        </div>
      )}
    </div>
  );
};

export default Avatar;
