import { UserIcon } from '@heroicons/react/outline';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { useAppUtils } from '@huddle01/react/app-utils';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  useLobby,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import { clsx } from 'clsx';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMeetPersistStore } from 'src/store/meet';
import { useUpdateEffect } from 'usehooks-ts';

import { BasicIcons } from '../BasicIcons';
import SwitchDeviceMenu from '../SwitchDeviceMenu';

const Lobby: NextPage = () => {
  const { query, push } = useRouter();
  const { initialize, me } = useHuddle01();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { joinLobby, isLobbyJoined } = useLobby();
  const { joinRoom } = useRoom();
  const { fetchVideoStream, stopVideoStream, stream: camStream } = useVideo();
  const { fetchAudioStream, stopAudioStream, stream: micStream } = useAudio();
  const { setDisplayName, changeAvatarUrl } = useAppUtils();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [displayUserName, setDisplayUserName] = useState<string>(
    currentProfile?.handle ?? ''
  );
  const {
    toggleMicMuted,
    toggleCamOff,
    isMicMuted,
    isCamOff,
    videoDevice,
    audioInputDevice
  } = useMeetPersistStore();

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (query.roomid && process.env.NEXT_PUBLIC_PROJECT_ID) {
      initialize(process.env.NEXT_PUBLIC_PROJECT_ID);
    }
  }, [query.roomid]);

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  useEventListener('app:cam-on', async () => {
    console.log('On');
    toggleCamOff(false);
  });

  useEventListener('app:cam-off', async () => {
    console.log('off');
    toggleCamOff(true);
  });

  useEventListener('app:mic-on', async () => {
    toggleMicMuted(false);
  });

  useEventListener('app:mic-off', async () => {
    toggleMicMuted(true);
  });

  useEffect(() => {
    setDisplayName(displayUserName);
  }, [setDisplayName.isCallable]);

  useEffect(() => {
    const profilePicture = currentProfile?.picture;
    console.log('profilePicture', profilePicture);
    if (profilePicture?.__typename == 'MediaSet') {
      const avatarUrl = profilePicture?.original?.url;
      console.log('avatarURL', avatarUrl);
      if (avatarUrl && changeAvatarUrl.isCallable) {
        changeAvatarUrl(avatarUrl);
      }
    } else if (profilePicture?.__typename == 'NftImage') {
      const avatarUrl = profilePicture?.uri;
      console.log('avatarURL', avatarUrl);
      if (avatarUrl && changeAvatarUrl.isCallable) {
        changeAvatarUrl(avatarUrl);
      }
    } else {
      console.log('Not Found');
    }
  }, [changeAvatarUrl.isCallable]);

  useEffect(() => {
    joinLobby(query.roomid as string);
  }, []);

  useUpdateEffect(() => {
    if (!isCamOff) {
      stopVideoStream();
      fetchVideoStream(videoDevice.deviceId);
    }
  }, [videoDevice]);

  useUpdateEffect(() => {
    if (!isMicMuted) {
      stopAudioStream();
      fetchAudioStream(audioInputDevice.deviceId);
    }
  }, [audioInputDevice]);

  useEventListener('room:joined', () => {
    push(`/meet/${query.roomid}`);
  });

  return (
    <main className="bg-lobby flex h-screen flex-col items-center justify-center">
      <div className="flex h-[35vh] w-[35vw] flex-col items-center justify-center gap-4">
        <div
          className={clsx(
            resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
            'relative mx-auto flex w-fit items-center justify-center rounded-lg text-center'
          )}
        >
          <div className="flex h-[35vh] w-[35vw] items-center justify-center rounded-lg ">
            {camStream ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="min-h-full min-w-full self-stretch rounded-lg object-cover"
              />
            ) : (
              <img
                src={me.avatarUrl ? `${me.avatarUrl}` : `/default-avatar.svg`}
                alt="avatar"
                className="mb-16 mt-16 h-24 w-24 rounded-full"
              />
            )}
          </div>
        </div>
        <div
          className={clsx(
            resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
            'flex items-center justify-center self-stretch rounded-lg p-2'
          )}
        >
          <div className="flex w-full flex-row items-center justify-center gap-8">
            {!camStream ? (
              <button
                onClick={() => {
                  fetchVideoStream(videoDevice.deviceId);
                }}
                className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-xl"
              >
                {BasicIcons.inactive['cam']}
              </button>
            ) : (
              <button
                onClick={stopVideoStream}
                className={clsx(
                  resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
                  'flex h-10 w-10 items-center justify-center rounded-xl'
                )}
              >
                {BasicIcons.active['cam']}
              </button>
            )}
            {!micStream ? (
              <button
                onClick={() => {
                  fetchAudioStream(audioInputDevice.deviceId);
                }}
                className="bg-brand-500 flex h-10 w-10 items-center justify-center rounded-xl"
              >
                {BasicIcons.inactive['mic']}
              </button>
            ) : (
              <button
                onClick={() => {
                  stopAudioStream();
                }}
                className={clsx(
                  resolvedTheme == 'dark' ? 'bg-gray-900' : 'bg-brand-100',
                  'flex h-10 w-10 items-center justify-center rounded-xl'
                )}
              >
                {BasicIcons.active['mic']}
              </button>
            )}
            <SwitchDeviceMenu />
          </div>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full flex-col justify-center gap-1">
            Set a display name
            <div
              className={clsx(
                resolvedTheme == 'dark' ? 'text-slate-300' : 'text-gray-900',
                'gap- flex w-full items-center rounded-[10px] border border-zinc-800 pl-3 backdrop-blur-[400px]'
              )}
            >
              <div className="mr-2">
                <UserIcon
                  className={clsx(
                    resolvedTheme == 'dark'
                      ? 'text-slate-100'
                      : 'text-gray-900',
                    'h-6 w-6'
                  )}
                />
              </div>
              <input
                type="text"
                placeholder="Enter your name"
                className="flex-1 rounded-lg border-transparent bg-transparent py-3 outline-none focus-within:outline-none hover:outline-none focus:border-transparent focus:outline-none"
                value={displayUserName}
                onChange={(e) => setDisplayUserName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full items-center">
          <button
            className="bg- bg-brand-500 mt-2 flex w-full items-center justify-center rounded-md p-2 text-slate-100"
            onClick={async () => {
              if (isLobbyJoined) {
                joinRoom();
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
