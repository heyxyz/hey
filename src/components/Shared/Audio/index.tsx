import type { LensterPublication } from '@generated/lenstertypes';
import type { Attribute } from '@generated/types';
import getTimeFromSeconds from '@lib/formatSeconds';
import getAttributeFromTrait from '@lib/getAttributeFromTrait';
import getThumbnailUrl from '@lib/getThumbnailUrl';
import type { ChangeEvent, FC } from 'react';
import { useId } from 'react';
import { useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';
import React from 'react';
import { usePublicationStore } from 'src/store/publication';
import { object, string } from 'zod';

import CoverImage from './CoverImage';

const getAudioPlayerOptions = (ref: HTMLDivElement) => ({
  container: ref,
  waveColor: '#C7C7C7',
  progressColor: '#8b5cf6',
  cursorColor: '#8b5cf6',
  cursorWidth: 1.5,
  barWidth: 2.5,
  barGap: 2.5,
  barRadius: 3,
  hideScrollbar: true,
  responsive: true,
  height: 40,
  normalize: true,
  partialRender: true
});

interface Props {
  src: string;
  isNew?: boolean;
  publication?: LensterPublication;
  txn: any;
}

export const AudioPublicationSchema = object({
  title: string().trim().min(1, { message: 'Invalid audio title' }),
  author: string().trim().min(1, { message: 'Invalid author name' }),
  cover: string().trim().min(1, { message: 'Invalid cover image' })
});

const Audio: FC<Props> = ({ src, isNew = false, publication, txn }) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState('00:00');
  const audioPublication = usePublicationStore((state) => state.audioPublication);
  const setAudioPublication = usePublicationStore((state) => state.setAudioPublication);

  const id = useId();
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer>();

  const createPlayer = useCallback(async () => {
    const WaveSurfer = (await import('wavesurfer.js')).default;
    if (waveformRef.current) {
      const options = getAudioPlayerOptions(waveformRef.current);
      waveSurfer.current = WaveSurfer.create(options);
      if (src) {
        waveSurfer.current?.load(src);
      }
      waveSurfer.current.on('ready', () => {
        setDuration(getTimeFromSeconds(waveSurfer.current?.getDuration().toString()));
      });
    }
  }, [src]);

  useEffect(() => {
    createPlayer();
    return () => {
      if (waveSurfer.current) {
        waveSurfer.current.destroy();
        setAudioPublication({ author: '', cover: '', title: '', coverMimeType: '' });
      }
    };
  }, [src, createPlayer, setAudioPublication]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    waveSurfer.current?.playPause();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioPublication({ ...audioPublication, [e.target.name]: e.target.value });
  };

  return (
    <div className="border w-full overflow-hidden border-gray-200 dark:border-gray-800 rounded-xl">
      <div className="flex flex-1 space-x-2">
        <CoverImage
          isNew={isNew && !txn}
          cover={isNew ? (txn ? txn.cover : audioPublication.cover) : getThumbnailUrl(publication)}
          setCover={(url, mimeType) =>
            setAudioPublication({ ...audioPublication, cover: url, coverMimeType: mimeType })
          }
        />
        <div className="flex py-5 px-3 flex-col justify-between w-full">
          <div className="flex justify-between">
            <div className="flex items-center space-x-3 w-full">
              <div>
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="p-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-full"
                >
                  {playing ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 pl-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="w-full pr-3">
                {isNew && !txn ? (
                  <div className="flex flex-col w-full">
                    <input
                      className="border-none w-full text-lg leading-5 dark:text-white bg-transparent outline-none placeholder-gray-800 dark:placeholder-gray-200"
                      placeholder="Add title..."
                      name="title"
                      value={audioPublication.title}
                      autoComplete="off"
                      onChange={handleChange}
                    />
                    <input
                      className="border-none w-full dark:text-gray-300 text-gray-600 bg-transparent outline-none"
                      placeholder="Add author..."
                      name="author"
                      value={audioPublication.author}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="text-lg leading-5 truncate">{publication?.metadata.name ?? txn.title}</h5>
                    <h6 className="opacity-50 leading-5">
                      {txn?.author ??
                        getAttributeFromTrait(publication?.metadata.attributes as Attribute[], 'author') ??
                        publication?.profile.name}
                    </h6>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm opacity-60">{duration}</div>
          </div>
          <div id={id} className="w-full" ref={waveformRef} />
        </div>
      </div>
    </div>
  );
};

export default Audio;
