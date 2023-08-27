import {
  useEventListener,
  useHuddle01,
  useLobby,
  useRoom
} from '@huddle01/react/hooks';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useAppStore } from 'src/store/app';
import { useSpacesStore } from 'src/store/spaces';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesButton from '../Common/SpacesButton';
import PreviewSpacesHeader from './PreviewSpacesHeader';

const PreviewSpaces: FC = () => {
  const setShowSpacesLobby = useSpacesStore(
    (state) => state.setShowSpacesLobby
  );
  const setShowSpacesWindow = useSpacesStore(
    (state) => state.setShowSpacesWindow
  );
  const { space, lensAccessToken } = useSpacesStore();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { initialize, roomState } = useHuddle01();
  const { joinLobby, previewPeers } = useLobby();
  const { joinRoom, isRoomJoined } = useRoom();

  useEffectOnce(() => {
    initialize('TxG-OolMwGeCoZPzX660e65wwuU2MP83');
  });

  useEventListener('app:initialized', () => {
    joinLobby(space.id, lensAccessToken);
  });

  useUpdateEffect(() => {
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

  useEffect(() => {
    console.log({ previewPeers });
  }, [previewPeers]);

  return (
    <div className="fixed inset-0 z-10 grid place-items-center bg-zinc-900/80 text-center">
      <div className="overflow-hidden rounded-lg bg-neutral-100 dark:bg-black">
        <PreviewSpacesHeader />
        <AvatarGrid />
        <div className="border-t border-neutral-300 py-4 text-center text-sm text-neutral-500 dark:border-neutral-800">
          <Trans>Your mic will be off at the start</Trans>
        </div>
        <div className="pb-3">
          <SpacesButton
            onClick={() => {
              joinRoom();
            }}
          >
            <Trans>
              {currentProfile?.ownedBy === space.host
                ? 'Start spaces'
                : 'Start listening'}
            </Trans>
          </SpacesButton>
        </div>
      </div>
    </div>
  );
};

export default PreviewSpaces;
