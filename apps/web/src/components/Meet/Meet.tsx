import { useEventListener } from '@huddle01/react';
import { Video } from '@huddle01/react/components';
import {
  useAudio,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo
} from '@huddle01/react/hooks';
import type { FC } from 'react';
import { useRef } from 'react';

import { BasicIcons } from './BasicIcons';

const Meet: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state } = useMeetingMachine();
  const { leaveRoom } = useRoom();
  const { produceAudio, stopProducingAudio, stream: micStream } = useAudio();
  const { produceVideo, stopProducingVideo, stream: camStream } = useVideo();
  const { peers } = usePeers();

  useEventListener('room:joined', () => {
    if (camStream && videoRef.current) {
      videoRef.current.srcObject = camStream;
    }
  });

  return (
    <div>
      {Object.values(peers).length == 0 ? (
        <div className="m-5 flex h-[80vh] items-center justify-center self-stretch">
          {!state.matches('Initialized.JoinedLobby.Cam.On') ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-[60%] rounded-lg"
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
          {videoRef.current ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="h-96 w-[35rem] flex-shrink-0"
            />
          ) : (
            <div className="flex h-[50vh] w-[40vw] flex-shrink-0 items-center justify-center rounded-lg bg-gray-900">
              <img
                src="/default-avatar.png"
                alt="avatar"
                className="mb-16 mt-16 h-32 w-32"
              />
            </div>
          )}
          {Object.values(peers).map((peer) =>
            peer.cam ? (
              <Video
                track={peer.cam}
                key={peer.peerId}
                peerId={peer.peerId}
                className="h-96 w-[35rem] flex-shrink-0"
              />
            ) : (
              <div
                key={peer.peerId}
                className="flex h-[50vh] w-[40vw] flex-shrink-0 items-center justify-center rounded-lg bg-gray-900"
              >
                <img
                  key={peer.peerId}
                  src="/default-avatar.png"
                  alt="avatar"
                  className="mb-16 mt-16 h-32 w-32"
                />
              </div>
            )
          )}
        </div>
      )}
      <div className="flex items-center justify-center self-stretch p-2">
        <div className="flex w-full flex-row items-center justify-center gap-8">
          {state.matches('Initialized.JoinedRoom.Cam.On') ? (
            <button
              onClick={() => {
                produceVideo(camStream);
              }}
              className="h-10 w-10 rounded-xl"
            >
              {BasicIcons.inactive['cam']}
            </button>
          ) : (
            <button
              onClick={stopProducingVideo}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-800"
            >
              {BasicIcons.active['cam']}
            </button>
          )}
          {state.matches('Initialized.JoinedRoom.Mic.Unmuted') ? (
            <button
              onClick={() => {
                produceAudio(micStream);
              }}
              className="h-10 w-10 rounded-xl"
            >
              {BasicIcons.inactive['mic']}
            </button>
          ) : (
            <button
              onClick={stopProducingAudio}
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
        </div>
      </div>
    </div>
  );
};

export default Meet;
