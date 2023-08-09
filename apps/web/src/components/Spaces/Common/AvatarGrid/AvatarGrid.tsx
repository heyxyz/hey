import { useHuddle01, usePeers } from '@huddle01/react/hooks';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import Avatar from './Avatar';

type Props = {};

const AvatarGrid = (props: Props) => {
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const showSpacesWindow = useSpacesStore((state) => state.showSpacesWindow);
  const listenersCount = Object.values(peers).filter(
    ({ role }) => role === 'listener'
  ).length;

  return (
    <div className="min-w-[28rem]">
      <div className="border-b border-neutral-800 pb-6">
        <div className="inline-flex grid min-h-[6rem] grid-cols-5 items-center justify-between gap-5 self-stretch">
          {showSpacesWindow && me.role !== 'listener' && (
            <Avatar
              key={me?.meId}
              peerId={me?.meId}
              displayName={me?.displayName}
              role={me?.role}
              avatarUrl={me?.avatarUrl}
            />
          )}
          {Object.values(peers)
            .filter(({ role }) => role !== 'listener')
            .map(({ peerId, displayName, role, avatarUrl }) => (
              <Avatar
                key={peerId}
                peerId={peerId}
                displayName={displayName}
                role={role}
                avatarUrl={avatarUrl}
              />
            ))}
        </div>
        <div className="py-4 text-sm font-normal leading-none text-slate-400">
          {listenersCount > 0
            ? `Listeners - ${listenersCount}`
            : 'No listeners'}
        </div>
        <div className="inline-flex grid min-h-[4rem] grid-cols-5 items-center justify-between gap-5 self-stretch ">
          {showSpacesWindow && me.role === 'listener' && (
            <Avatar
              key={me?.meId}
              peerId={me?.meId}
              displayName={me?.displayName}
              role={me?.role}
              avatarUrl={me?.avatarUrl}
            />
          )}
          {Object.values(peers)
            .filter(({ role }) => role === 'listener')
            .map(({ peerId, displayName, role, avatarUrl }) => (
              <Avatar
                key={peerId}
                peerId={peerId}
                displayName={displayName}
                role={role}
                avatarUrl={avatarUrl}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarGrid;
