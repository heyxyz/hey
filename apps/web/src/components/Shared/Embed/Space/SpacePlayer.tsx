import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { PencilAltIcon, PlusCircleIcon } from '@heroicons/react/outline';
import { getLensAccessToken, getLensMessage } from '@huddle01/auth';
import { useDisplayName } from '@huddle01/react/app-utils';
import { Audio } from '@huddle01/react/components';
import {
  useAudio,
  useHuddle01,
  useLobby,
  usePeers,
  useRoom
} from '@huddle01/react/hooks';
import type { Profile, Publication } from '@lenster/lens';
import { Button } from '@lenster/ui';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { useAccount, useSignMessage } from 'wagmi';

import SpaceUser from './SpaceUser';

interface SpacePlayerProps {
  publication: Publication;
  space: {
    id: string;
    host: Profile;
  };
}

const SpacePlayer: FC<SpacePlayerProps> = ({ publication, space }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [accessToken, setAccessToken] = useState('');
  const { initialize, isInitialized } = useHuddle01();
  const { joinLobby, isLobbyJoined } = useLobby();
  const {
    fetchAudioStream,
    stopProducingAudio,
    produceAudio,
    stream: micStream
  } = useAudio();
  const { joinRoom, leaveRoom, isRoomJoined } = useRoom();
  const { setDisplayName } = useDisplayName();
  const { peers } = usePeers();
  const { address } = useAccount();
  const { metadata } = publication;

  const { signMessage } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getLensAccessToken(data, address as string);
      setAccessToken(token.accessToken);
    }
  });

  useEffectOnce(() => {
    initialize('KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR');
  });

  useUpdateEffect(() => {
    if (isInitialized && accessToken) {
      joinLobby(space.id, accessToken);
    }
  }, [isInitialized, accessToken]);

  useUpdateEffect(() => {
    if (fetchAudioStream.isCallable) {
      fetchAudioStream();
    }
  }, [isLobbyJoined]);

  useUpdateEffect(() => {
    if (isRoomJoined) {
      setDisplayName(currentProfile?.id);
    }
  }, [isRoomJoined]);

  return (
    <div className="p-5">
      <SmallUserProfile profile={space.host} smallAvatar />
      <div className="mt-2 space-y-3">
        <b className="text-lg">{metadata.content}</b>
        {accessToken ? (
          isRoomJoined ? (
            <div>
              <button disabled={!leaveRoom.isCallable} onClick={leaveRoom}>
                Leave
              </button>
              <br />
              <button
                disabled={!produceAudio.isCallable}
                onClick={() => produceAudio(micStream)}
              >
                Talk
              </button>
              <br />
              <button
                disabled={!stopProducingAudio.isCallable}
                onClick={stopProducingAudio}
              >
                Mute
              </button>
              <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
                {Object.values(peers)
                  .filter((peer) => peer.displayName !== 'Guest')
                  .map((peer) => (
                    <>
                      {peer.mic ? (
                        <Audio
                          key={peer.peerId}
                          peerId={peer.peerId}
                          track={peer.mic}
                        />
                      ) : null}
                      <SpaceUser
                        key={peer.peerId}
                        profileId={peer.displayName}
                      />
                    </>
                  ))}
              </div>
            </div>
          ) : (
            <Button
              className="flex w-full justify-center"
              icon={<PlusCircleIcon className="h-5 w-5" />}
              onClick={joinRoom}
              disabled={!joinRoom.isCallable}
            >
              Join Space
            </Button>
          )
        ) : (
          <Button
            className="flex w-full justify-center"
            icon={<PencilAltIcon className="h-5 w-5" />}
            onClick={async () => {
              const msg = await getLensMessage(address as string);
              signMessage({ message: msg.message });
            }}
          >
            Sign to continue
          </Button>
        )}
      </div>
    </div>
  );
};

export default SpacePlayer;
