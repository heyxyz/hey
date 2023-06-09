import { getLensAccessToken, getLensMessage } from '@huddle01/auth';
import { useDisplayName } from '@huddle01/react/app-utils';
import {
  useAudio,
  useHuddle01,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom
} from '@huddle01/react/hooks';
import type { Profile, Publication } from '@lenster/lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useEffectOnce, useUpdateEffect } from 'usehooks-ts';
import { useAccount, useSignMessage } from 'wagmi';
import { Audio } from '@huddle01/react/components';

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
    const getAccessToken = async () => {
      const msg = await getLensMessage(address as string);
      signMessage({ message: msg.message });
    };

    // getAccessToken();
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
      {accessToken ? (
        <>
          <div className="text-xl font-bold">{metadata.content}</div>
          <button disabled={!joinRoom.isCallable} onClick={joinRoom}>
            Join
          </button>
          <br />
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
                <SpaceUser key={peer.peerId} profileId={peer.displayName} />
              </>
            ))}
        </>
      ) : null}
      <div className="grid grid-cols-4 gap-4">
        <SpaceUser profileId="0x0d" />
        <SpaceUser profileId="0x01" />
        <SpaceUser profileId="0x02" />
        <SpaceUser profileId="0x03" />
        <SpaceUser profileId="0x15" />
        <SpaceUser profileId="0x16" />
        <SpaceUser profileId="0x17" />
        <SpaceUser profileId="0x18" />
        <SpaceUser profileId="0x19" />
        <SpaceUser profileId="0x20" />
        <SpaceUser profileId="0x21" />
        <SpaceUser profileId="0x22" />
        <SpaceUser profileId="0x23" />
        <SpaceUser profileId="0x24" />
        <SpaceUser profileId="0x25" />
        <SpaceUser profileId="0x26" />
      </div>
    </div>
  );
};

export default SpacePlayer;
