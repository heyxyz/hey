import React, { useEffect, useRef } from 'react';
import { useMeetPersistStore } from 'src/store/meet';
import { useUpdateEffect } from 'usehooks-ts';

interface IAudioProps {
  track?: MediaStreamTrack;
}

type HTMLAudioElementWithSetSinkId = HTMLAudioElement & {
  setSinkId: (id: string) => void;
};

const Audio: React.FC<
  IAudioProps &
    React.DetailedHTMLProps<
      React.AudioHTMLAttributes<HTMLAudioElementWithSetSinkId>,
      HTMLAudioElementWithSetSinkId
    >
> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  const { audioOutputDevice } = useMeetPersistStore();

  useEffect(() => {
    const audioObj = audioRef.current;

    if (audioObj && track) {
      audioObj.srcObject = getStream(track);
      audioObj.onloadedmetadata = async () => {
        console.warn('audioCard() | Metadata loaded...');
        try {
          await audioObj.play();
        } catch (error) {
          console.error(error);
        }
      };
      audioObj.onerror = () => {
        console.error('audioCard() | Error is hapenning...');
      };
    }
  }, []);

  useUpdateEffect(() => {
    const audioObj = audioRef.current as HTMLAudioElementWithSetSinkId;
    if (audioObj && audioOutputDevice) {
      audioObj.setSinkId(audioOutputDevice.deviceId);
    }
  }, [audioOutputDevice]);

  return <audio ref={audioRef}>Audio</audio>;
};

export default Audio;
