import type { AudioHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import React, { useEffect, useRef } from 'react';
import { useSpacesStore } from 'src/store/spaces';
import { useUpdateEffect } from 'usehooks-ts';

interface IAudioProps {
  track?: MediaStreamTrack;
}

type HTMLAudioElementWithSetSinkId = HTMLAudioElement & {
  setSinkId: (id: string) => void;
};

const Audio: FC<
  IAudioProps &
    DetailedHTMLProps<
      AudioHTMLAttributes<HTMLAudioElementWithSetSinkId>,
      HTMLAudioElement
    >
> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeSpeakerDevice = useSpacesStore(
    (state) => state.activeSpeakerDevice
  );

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

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
  }, [track]);

  useUpdateEffect(() => {
    const audioObj = audioRef.current as HTMLAudioElementWithSetSinkId;
    if (audioObj && activeSpeakerDevice) {
      audioObj.setSinkId(activeSpeakerDevice.deviceId);
    }
  }, [activeSpeakerDevice]);

  return <audio ref={audioRef}>Audio</audio>;
};

export default Audio;
