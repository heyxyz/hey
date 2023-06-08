import Footer from '@components/Shared/Footer';
import { getLensAccessToken, getLensMessage, getMessage } from '@huddle01/auth';
import { useHuddle01 } from '@huddle01/react';
import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom
} from '@huddle01/react/hooks';
import { GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

const Spaces: NextPage = () => {
  const [accessToken, setAccessToken] = useState('');
  const { initialize, isInitialized } = useHuddle01();
  const { state, send } = useMeetingMachine();
  const { joinLobby, isLobbyJoined } = useLobby();
  const {
    fetchAudioStream,
    stopProducingAudio,
    produceAudio,
    stream: micStream
  } = useAudio();
  const { joinRoom, leaveRoom } = useRoom();
  const { peerIds } = usePeers();
  const { address } = useAccount();
  const message = getMessage(address as `0x${string}`);

  const { signMessage } = useSignMessage({
    onSuccess: async (data) => {
      const token = await getLensAccessToken(data, address as string);
      console.log('data', token);
      setAccessToken(token.accessToken);
    }
  });

  useEffect(() => {
    initialize('KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR');
  }, []);

  useEffect(() => {
    if (isInitialized && accessToken) {
      joinLobby('xuv-ajbu-hrw', accessToken);
    }
  }, [isInitialized, accessToken]);

  useEffect(() => {
    if (fetchAudioStream.isCallable) {
      fetchAudioStream();
    }
  }, [isLobbyJoined]);

  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <div>{isInitialized ? 'Initialized!' : 'Please initialize'}</div>
        <h2 className="text-2xl">Room State</h2>
        <h3 className="break-words">{JSON.stringify(state.value)}</h3>

        <h2 className="text-2xl">Me Id</h2>
        <div className="break-words">
          {JSON.stringify(state.context.peerId)}
        </div>
        <h2 className="text-2xl">DisplayName</h2>
        <div className="break-words">
          {JSON.stringify(state.context.displayName)}
        </div>
        <h2 className="text-2xl">Peers</h2>
        <div className="break-words">{JSON.stringify(peerIds)}</div>
        <h2 className="text-2xl">Consumers</h2>
        <div className="break-words">
          {JSON.stringify(state.context.consumers)}
        </div>

        <button
          onClick={async () => {
            const msg = await getLensMessage(address as string);
            signMessage({ message: msg.message });
          }}
        >
          Sign Message
        </button>
        <br />
        {accessToken ? (
          <>
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
          </>
        ) : null}
      </GridItemEight>
      <GridItemFour>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default Spaces;
