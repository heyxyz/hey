import { AdjustmentsIcon } from '@heroicons/react/outline';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  usePeers,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import { Modal } from '@lenster/ui';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useMeetPersistStore } from 'src/store/meet';

import AudioElem from './Audio';
import { BasicIcons } from './BasicIcons';
import DropDownMenu from './DropDownMenu';
import VideoElem from './Video';

const Meet: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { leaveRoom } = useRoom();
  const { roomState } = useHuddle01();
  const {
    produceAudio,
    stopProducingAudio,
    stream: micStream,
    fetchAudioStream,
    stopAudioStream
  } = useAudio();
  const {
    produceVideo,
    stopProducingVideo,
    stream: camStream,
    fetchVideoStream,
    stopVideoStream
  } = useVideo();
  const { isMicMuted, isCamOff, toggleMicMuted, toggleCamOff } =
    useMeetPersistStore();
  const { peers } = usePeers();
  const [showSettings, setShowSettings] = useState(false);

  useEventListener('app:cam-on', async (stream) => {
    toggleCamOff(false);
    produceVideo(stream);
  });

  useEventListener('app:cam-off', async () => {
    toggleCamOff(true);
    stopProducingVideo();
  });

  useEventListener('app:mic-on', async (stream) => {
    toggleMicMuted(false);
    produceAudio(stream);
  });

  useEventListener('app:mic-off', async () => {
    toggleMicMuted(true);
    stopProducingAudio();
  });

  useEffect(() => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  }, [camStream]);

  useEffect(() => {
    console.log('isCamOff', isCamOff);
    if (!isCamOff) {
      fetchVideoStream();
    }
  }, [isCamOff]);

  useEffect(() => {
    console.log('Peers', { peers });
  }, [peers]);

  return (
    <>
      <div className="m-5 flex h-[80vh] items-center justify-center self-stretch">
        {Object.values(peers).length == 0 ? (
          <div className="flex w-[60vw] items-center justify-center self-stretch">
            {!isCamOff ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                className="min-h-full min-w-full rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-[80vh] w-[80vw] items-center justify-center rounded-lg bg-gray-900">
                <img
                  src="/default-avatar.png"
                  alt="avatar"
                  className="mb-16 mt-16 h-32 w-32"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-[80vh] grid-cols-2 items-center justify-center gap-10 rounded-lg">
            <div className="flex h-[50vh] w-[40vw] flex-shrink-0 items-center justify-center rounded-lg bg-gray-900">
              {!isCamOff ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <img
                  src="/default-avatar.png"
                  alt="avatar"
                  className="mb-16 mt-16 h-32 w-32"
                />
              )}
            </div>

            {Object.values(peers).map(({ cam, peerId, mic }) => (
              <div
                key={peerId}
                className={`flex h-[50vh] w-[40vw] flex-shrink-0 items-center justify-center rounded-lg ${
                  cam ? 'bg-transparent' : 'bg-gray-900'
                }`}
              >
                {cam ? (
                  <VideoElem track={cam} key={peerId} />
                ) : (
                  <img
                    key={peerId}
                    src="/default-avatar.png"
                    alt="avatar"
                    className="mb-16 mt-16 h-32 w-32"
                  />
                )}
                {mic && <AudioElem track={mic} key={peerId} />}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center self-stretch p-2">
        <div className="flex w-full flex-row items-center justify-center gap-8">
          {isCamOff ? (
            <button
              onClick={() => {
                fetchVideoStream();
              }}
              className="h-10 w-10 rounded-xl"
            >
              {BasicIcons.inactive['cam']}
            </button>
          ) : (
            <button
              onClick={stopVideoStream}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800"
            >
              {BasicIcons.active['cam']}
            </button>
          )}
          {isMicMuted ? (
            <button
              onClick={() => {
                fetchAudioStream();
              }}
              className="h-10 w-10 rounded-xl"
            >
              {BasicIcons.inactive['mic']}
            </button>
          ) : (
            <button
              onClick={stopAudioStream}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800"
            >
              {BasicIcons.active['mic']}
            </button>
          )}
          <button
            onClick={leaveRoom}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800"
          >
            {BasicIcons.close}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800"
          >
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
    </>
  );
};

export default Meet;
