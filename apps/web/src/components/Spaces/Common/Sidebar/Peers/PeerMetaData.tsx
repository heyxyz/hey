import { useAppUtils } from '@huddle01/react/app-utils';
import { useAudio, useEventListener, useHuddle01 } from '@huddle01/react/hooks';
import clsx from 'clsx';
import Image from 'next/image';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useSpacesStore } from 'src/store/spaces';

import { NestedPeerListIcons, PeerListIcons } from '../../assets/Icons';
import Dropdown from '../../Dropdown';
import CoHostData from './PeerRole/CoHostData';
import HostData from './PeerRole/HostData';
import ListenersData from './PeerRole/ListenersData';
import SpeakerData from './PeerRole/SpeakerData';

interface PeerMetaDatProps {
  isRequested?: boolean;
  role: 'host' | 'coHost' | 'speaker' | 'listener';
  className?: string;
  isHandRaised?: boolean;
  isMicActive?: boolean;
  name: string;
  src: string;
  onAccept?: () => void;
  onDeny?: () => void;
  peerId: string;
}

interface IAcceptDenyProps {
  onAccept?: () => void;
  onDeny?: () => void;
}

const AcceptDenyGroup: FC<IAcceptDenyProps> = ({ onAccept, onDeny }) => (
  <div className="flex items-center gap-4">
    <div role="presentation" onClick={onAccept}>
      {PeerListIcons.accept}
    </div>
    <div role="presentation" onClick={onDeny}>
      {PeerListIcons.deny}
    </div>
  </div>
);

const PeerMetaData: React.FC<PeerMetaDatProps> = ({
  className,
  isMicActive,
  name,
  src,
  isRequested,
  role,
  onAccept,
  onDeny,
  peerId
}) => {
  const RoleData = {
    host: <HostData />,
    coHost: <CoHostData peerId={peerId} />,
    speaker: <SpeakerData peerId={peerId} />,
    listener: <ListenersData peerId={peerId} />
  } as const;

  const { me } = useHuddle01();
  const { sendData } = useAppUtils();
  const {
    fetchAudioStream,
    stopAudioStream,
    produceAudio,
    stopProducingAudio
  } = useAudio();
  const [isHandRaised, setIsHandRaised] = useState<boolean>(false);
  const setMyHandRaised = useSpacesStore((state) => state.setMyHandRaised);
  const isMyHandRaised = useSpacesStore((state) => state.isMyHandRaised);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);

  useEffect(() => {
    sendData('*', {
      raiseHand: isHandRaised
    });
    setMyHandRaised(isHandRaised);
  }, [isHandRaised]);

  useEffect(() => {
    if (me.meId == peerId) {
      setIsHandRaised(isMyHandRaised);
    }
  }, [isMyHandRaised]);

  useEventListener('app:mic-on', (stream) => {
    if (me.meId == peerId) {
      setIsAudioOn(true);
      if (stream) {
        produceAudio(stream);
      }
    }
  });

  useEventListener('app:mic-off', () => {
    if (me.meId == peerId) {
      setIsAudioOn(false);
      stopProducingAudio();
    }
  });

  return (
    <div
      className={clsx(className, 'flex w-full items-center justify-between')}
    >
      <div className="flex items-center gap-2">
        <Image
          loader={() => src}
          src={src}
          alt="default"
          width={24}
          height={24}
          priority
          quality={100}
          className="rounded-full object-contain"
        />
        <div className="text-xs font-normal text-neutral-500 dark:text-slate-400">
          {name}
        </div>
      </div>
      {isRequested ? (
        <AcceptDenyGroup onDeny={onDeny} onAccept={onAccept} />
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (
                ['host', 'coHost', 'speaker'].includes(role) &&
                peerId === me?.meId
              ) {
                isAudioOn ? stopAudioStream() : fetchAudioStream();
              }
            }}
            className="relative h-4 w-4"
          >
            {isAudioOn || isMicActive
              ? NestedPeerListIcons.active.mic
              : NestedPeerListIcons.inactive.mic}
          </button>

          {me.role === 'host' ||
          (me.role === 'coHost' &&
            (me.meId === peerId || ['speaker', 'listener'].includes(role))) ||
          ((me.role === 'speaker' || me.role === 'listener') &&
            me.meId === peerId) ? (
            <Dropdown triggerChild={NestedPeerListIcons.inactive.more}>
              <div className="absolute -right-10 top-4 w-[10rem] rounded-lg border border-neutral-300 bg-white dark:border-neutral-500 dark:bg-neutral-800">
                {RoleData?.[role]}
              </div>
            </Dropdown>
          ) : (
            <button> {NestedPeerListIcons.inactive.more}</button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(PeerMetaData);
