import { useHuddle01, usePeers } from '@huddle01/react/hooks';
import { Plural, t } from '@lingui/macro';
import type { FC } from 'react';
import React from 'react';
import { useSpacesStore } from 'src/store/spaces';

import Avatar from './Avatar';

const AvatarGrid: FC = () => {
  const { peers } = usePeers();
  const { me } = useHuddle01();
  const showSpacesWindow = useSpacesStore((state) => state.showSpacesWindow);
  const listenersCount =
    Object.values(peers).filter(({ role }) => role === 'listener').length +
    (me.role === 'listener' ? 1 : 0);

  return (
    <div className="min-w-[24rem]">
      <div className="pb-6">
        <div className="inline-flex grid min-h-[8rem] grid-cols-5 items-center justify-between gap-5 self-stretch">
          {showSpacesWindow && me.role !== 'listener' && (
            <Avatar
              key={me.meId}
              peerId={me.meId}
              displayName={me.displayName}
              role={me.role}
              avatarUrl={me.avatarUrl}
            />
          )}
          {Object.values(peers)
            .filter(({ role }) => role !== 'listener')
            .map(({ peerId, displayName, role, avatarUrl, mic }) => (
              <Avatar
                key={peerId}
                peerId={peerId}
                displayName={displayName}
                role={role}
                avatarUrl={avatarUrl}
                mic={mic}
              />
            ))}
        </div>
        <div className="py-4 text-sm font-normal leading-none text-slate-400">
          <Plural
            value={listenersCount}
            zero={t`No listeners`}
            one={t`Listener - ${listenersCount}`}
            other={t`Listeners - ${listenersCount}`}
          />
        </div>
        <div className="inline-flex grid min-h-[8rem] grid-cols-5 items-center justify-between gap-5 self-stretch ">
          {showSpacesWindow && me.role === 'listener' && (
            <Avatar
              key={me.meId}
              peerId={me.meId}
              displayName={me.displayName}
              role={me.role}
              avatarUrl={me.avatarUrl}
            />
          )}
          {Object.values(peers)
            .filter(({ role }) => role === 'listener')
            .map(({ peerId, displayName, role, avatarUrl, mic }) => (
              <Avatar
                key={peerId}
                peerId={peerId}
                displayName={displayName}
                role={role}
                avatarUrl={avatarUrl}
                mic={mic}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AvatarGrid;
