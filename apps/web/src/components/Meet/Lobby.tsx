import { UserIcon } from '@heroicons/react/outline';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { useEventListener, useHuddle01 } from '@huddle01/react';
import { useDisplayName } from '@huddle01/react/app-utils';
import {
  useAudio,
  useLobby,
  useMeetingMachine,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';

import { BasicIcons } from './BasicIcons';

const Lobby: FC = () => {
  const { query } = useRouter();
  const { initialize, isInitialized } = useHuddle01();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { joinLobby } = useLobby();
  const { joinRoom } = useRoom();
  const { fetchVideoStream, stopVideoStream, stream: camStream } = useVideo();
  const { fetchAudioStream, stopAudioStream } = useAudio();
  const { state } = useMeetingMachine();
  const { setDisplayName } = useDisplayName();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [displayUserName, setDisplayUserName] = useState<string>(
    currentProfile?.handle ?? ''
  );

  useEffect(() => {
    if (query.roomid) {
      initialize(process.env.NEXT_PUBLIC_PROJECT_ID!);
    }
  }, [query.roomid]);

  useEffect(() => {
    if (isInitialized && query.roomid) {
      joinLobby(query.roomid as string);
    }
  }, [isInitialized]);

  useEventListener('lobby:joined', () => {
    fetchVideoStream();
    fetchAudioStream();
    setDisplayName(currentProfile?.handle ?? '');
  });

  useEventListener('lobby:cam-on', () => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  });

  useEffect(() => {
    if (displayUserName) {
      setDisplayName(displayUserName);
    }
  }, [displayUserName]);

  return (
    <main className="bg-lobby flex h-[80vh] flex-col items-center justify-center text-slate-100">
      <div className="flex w-[26.25rem] flex-col items-center justify-center gap-4">
        <div className="relative mx-auto flex w-fit items-center justify-center border-black bg-gray-900 text-center">
          <div className="flex w-[26rem] items-center justify-center rounded ">
            {state.matches('Initialized.JoinedLobby.Cam.On') ? (
              <video ref={videoRef} autoPlay muted className="w-fit" />
            ) : (
              <img
                src="/default-avatar.png"
                alt="avatar"
                className="mb-16 mt-16 h-24 w-24"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-center self-stretch bg-gray-900 p-2">
          <div className="flex w-full flex-row items-center justify-center gap-8">
            {state.matches('Initialized.JoinedLobby.Cam.Off') ? (
              <button onClick={fetchVideoStream}>
                {BasicIcons.inactive['cam']}
              </button>
            ) : (
              <button onClick={stopVideoStream}>
                {BasicIcons.active['cam']}
              </button>
            )}
            {state.matches('Initialized.JoinedLobby.Mic.Muted') ? (
              <button onClick={fetchAudioStream}>
                {BasicIcons.inactive['mic']}
              </button>
            ) : (
              <button onClick={stopAudioStream}>
                {BasicIcons.active['mic']}
              </button>
            )}
          </div>
        </div>
        <div className="flex w-full items-center outline-none">
          <div className="flex w-full flex-col justify-center gap-1 outline-none">
            Set a display name
            <div className="gap- flex w-full items-center rounded-[10px] border border-zinc-800 px-3 text-slate-300 outline-none backdrop-blur-[400px] focus-within:border-slate-600">
              <div className="mr-2">
                <UserIcon className="h-6 w-6 text-slate-100" />
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                className="flex-1 bg-transparent py-3"
                value={displayUserName}
                onChange={(e) => setDisplayUserName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full items-center">
          <button
            className="mt-2 flex w-full items-center justify-center rounded-md bg-[#246BFD] p-2 text-slate-100"
            onClick={async () => {
              joinRoom();
            }}
          >
            Start Meeting
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
