import type { AudioHTMLAttributes, DetailedHTMLProps, FC } from 'react';
import React, { useEffect, useRef } from 'react';

interface IAudioProps {
  track?: MediaStreamTrack;
}

const Audio: FC<
  IAudioProps &
    DetailedHTMLProps<AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement>
> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

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

  return <audio ref={audioRef}>Audio</audio>;
};

export default Audio;
