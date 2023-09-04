import {
  useEventListener,
  useHuddle01,
  useLobby,
  useRoom
} from '@huddle01/react/hooks';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { SpacesEvents } from 'src/enums';
import { useAppStore } from 'src/store/app';
import { useSpacesStore } from 'src/store/spaces';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';

import AvatarGrid from '../Common/AvatarGrid/AvatarGrid';
import SpacesButton from '../Common/SpacesButton';
import PreviewSpacesHeader from './PreviewSpacesHeader';

const PreviewSpaces: FC = () => {
  const { setShowSpacesLobby, setShowSpacesWindow } = useSpacesStore();
  const { space, lensAccessToken } = useSpacesStore();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { initialize, roomState } = useHuddle01();
  const { joinLobby, previewPeers } = useLobby();
  const { joinRoom, isRoomJoined } = useRoom();

  useEffectOnce(() => {
    initialize('TxG-OolMwGeCoZPzX660e65wwuU2MP83');
  });

  useEventListener(SpacesEvents.APP_INITIALIZED, () => {
    joinLobby(space.id, lensAccessToken);
  });

  useEffect(() => {
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
    <div className="fixed inset-0 z-10 grid place-items-center bg-gray-900/80 text-center">
      <div className="overflow-hidden rounded-lg bg-gray-100 dark:bg-black">
        <PreviewSpacesHeader />
        <AvatarGrid isLobbyPreview={previewPeers.length ? true : false} />
        <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-500 dark:border-gray-800">
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
