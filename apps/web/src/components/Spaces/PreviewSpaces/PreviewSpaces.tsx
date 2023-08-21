import {
  useEventListener,
  useHuddle01,
  useLobby,
  useRoom
} from '@huddle01/react/hooks';
import React from 'react';
import { useAppStore } from 'src/store/app';
import { useSpacesStore } from 'src/store/spaces';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesButton from '../Common/SpacesButton';
import PreviewSpacesHeader from './PreviewSpacesHeader';

const PreviewSpaces = () => {
  const setShowSpacesLobby = useSpacesStore(
    (state) => state.setShowSpacesLobby
  );
  const setShowSpacesWindow = useSpacesStore(
    (state) => state.setShowSpacesWindow
  );
  const { space, lensAccessToken } = useSpacesStore();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { initialize, roomState } = useHuddle01();
  const { joinLobby } = useLobby();
  const { joinRoom, isRoomJoined } = useRoom();

  useEffectOnce(() => {
    initialize('TxG-OolMwGeCoZPzX660e65wwuU2MP83');
  });

  useEventListener('app:initialized', () => {
    joinLobby(space.id, lensAccessToken);
  });

  useUpdateEffect(() => {
    console.log('roomState', roomState);
    if (roomState === 'INIT') {
      joinLobby(space.id, lensAccessToken);
    }
  }, [roomState]);

  useUpdateEffect(() => {
    if (isRoomJoined) {
      setShowSpacesLobby(false);
      setShowSpacesWindow(true);
    }
  }, [isRoomJoined]);

  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-zinc-900/80 text-center">
      <div className="overflow-hidden rounded-lg bg-black">
        <PreviewSpacesHeader />
        <div className=" px-5 py-6 pb-0">
          <AvatarGrid />
        </div>
        <div className="mx-auto py-4 text-center text-sm leading-tight text-neutral-500">
          Your mic will be off at the start
        </div>
        <div className="pb-3">
          <SpacesButton
            onClick={() => {
              joinRoom();
            }}
          >
            {currentProfile?.ownedBy === space.host
              ? 'Start spaces'
              : 'Start listening'}
          </SpacesButton>
        </div>
      </div>
    </div>
  );
};

export default PreviewSpaces;
