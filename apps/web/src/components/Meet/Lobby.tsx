import { AdjustmentsIcon, UserIcon } from '@heroicons/react/outline';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { useDisplayName } from '@huddle01/react/app-utils';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  useLobby,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import { Modal } from '@lenster/ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMeetPersistStore } from 'src/store/meet';

import { BasicIcons } from './BasicIcons';
import DropDownMenu from './DropDownMenu';

const Lobby: FC = () => {
  const { query } = useRouter();
  const { initialize, roomState } = useHuddle01();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { joinLobby, isLobbyJoined } = useLobby();
  const { joinRoom } = useRoom();
  const { fetchVideoStream, stopVideoStream, stream: camStream } = useVideo();
  const { fetchAudioStream, stopAudioStream, stream: micStream } = useAudio();
  const { setDisplayName } = useDisplayName();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [displayUserName, setDisplayUserName] = useState<string>(
    currentProfile?.handle ?? ''
  );
  const { isMicMuted, isCamOff, toggleMicMuted, toggleCamOff } =
    useMeetPersistStore();
  const [showSettings, setShowSettings] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  useEffect(() => {
    if (query.roomid) {
      initialize('L-UtmOW84pscUfMWmRGCk2-dwngKPaoK');
    }
  }, [query.roomid]);

  useEffect(() => {
    if (query.roomid && roomState === 'INIT') {
      toggleCamOff(true);
      toggleMicMuted(true);
      joinLobby(query.roomid as string);
      console.log('joinLobby');
    }
  }, [roomState, query.roomid]);

  useEffect(() => {
    console.log('roomState', roomState);
  }, [roomState]);

  useEffect(() => {
    if (isLobbyJoined) {
      async () => {
        await fetchVideoStream();
        await fetchAudioStream();
      };
      if (isJoinMeetingClicked) {
        console.log(isCamOff);
        joinRoom();
      }
    }
  }, [isLobbyJoined]);

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  useEventListener('app:cam-on', async () => {
    toggleCamOff(false);
  });

  useEventListener('app:cam-off', async () => {
    toggleCamOff(true);
  });

  useEventListener('app:mic-on', async () => {
    toggleMicMuted(false);
  });

  useEventListener('app:mic-off', async () => {
    toggleMicMuted(true);
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
            {camStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="minh-w-full min-h-full object-cover"
              />
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
            {!camStream ? (
              <button onClick={fetchVideoStream}>
                {BasicIcons.inactive['cam']}
              </button>
            ) : (
              <button
                onClick={() => {
                  stopVideoStream();
                }}
              >
                {BasicIcons.active['cam']}
              </button>
            )}
            {!micStream ? (
              <button onClick={fetchAudioStream}>
                {BasicIcons.inactive['mic']}
              </button>
            ) : (
              <button
                onClick={() => {
                  stopAudioStream();
                }}
              >
                {BasicIcons.active['mic']}
              </button>
            )}
            <button onClick={() => setShowSettings(!showSettings)}>
              <AdjustmentsIcon className="h-6 w-6 text-[#845EEE]" />
            </button>
            <Modal show={showSettings} onClose={() => setShowSettings(false)}>
              <div className="rounded-xl bg-gray-900 p-5">
                <div className="flex items-center gap-2 self-stretch text-slate-500">
                  {BasicIcons.active['cam']}
                  <div className="flex h-[2.75rem] items-center justify-between self-stretch">
                    <DropDownMenu deviceType={'video'} />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 self-stretch text-slate-500">
                  {BasicIcons.active['mic']}
                  <div className="flex h-[2.75rem] items-center justify-between self-stretch">
                    <DropDownMenu deviceType={'audioInput'} />
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 self-stretch text-slate-500">
                  {BasicIcons.speaker}
                  <div className="flex h-[2.75rem] items-center justify-between self-stretch">
                    <DropDownMenu deviceType={'audioOutput'} />
                  </div>
                </div>
              </div>
            </Modal>
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
            className="bg- mt-2 flex w-full items-center justify-center rounded-md bg-[#845EEE] p-2 text-slate-100"
            onClick={async () => {
              setIsJoinMeetingClicked(true);
              if (roomState === 'LOBBY') {
                joinRoom();
              } else {
                await joinLobby(query.roomid as string);
              }
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
