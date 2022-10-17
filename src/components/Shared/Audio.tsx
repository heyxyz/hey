import { Spinner } from '@components/UI/Spinner';
import type { LensterPublication } from '@generated/lenstertypes';
import type { Attribute } from '@generated/types';
import { PhotographIcon } from '@heroicons/react/outline';
import getTimeFromSeconds from '@lib/formatSeconds';
import getAttributeFromTrait from '@lib/getAttributeFromTrait';
import getIPFSLink from '@lib/getIPFSLink';
import getThumbnailUrl from '@lib/getThumbnailUrl';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import clsx from 'clsx';
import type { ChangeEvent, FC } from 'react';
import { useId } from 'react';
import { useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';
import React from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from 'src/constants';
import { usePublicationStore } from 'src/store/publication';

const getAudioPlayerOptions = (ref: HTMLDivElement) => ({
  container: ref,
  waveColor: '#C7C7C7',
  progressColor: '#8b5cf6',
  cursorColor: '#8b5cf6',
  cursorWidth: 1.5,
  barWidth: 1.5,
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

type ThumbnailProps = { isNew: boolean; cover: string; setCover: (url: string, mimeType: string) => void };

const Thumbnail: FC<ThumbnailProps> = ({ isNew = false, cover, setCover }) => {
  const [loading, setLoading] = useState(false);

  const onError = (error: any) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const onPfpUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true);
        const attachment = await uploadMediaToIPFS(e.target.files);
        setCover(attachment[0].item, attachment[0].type);
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="relative flex-none overflow-hidden group">
      <img src={getIPFSLink(cover)} className="object-cover w-36 h-36 border" draggable={false} alt="cover" />
      {isNew && (
        <label
          className={clsx(
            'absolute top-0 grid w-36 h-36 bg-gray-100 dark:bg-gray-900 cursor-pointer place-items-center group-hover:visible backdrop-blur-lg',
            {
              visible: loading && !cover,
              invisible: cover
            }
          )}
        >
          {loading && !cover ? (
            <Spinner size="sm" />
          ) : (
            <div className="text-sm dark:text-white flex flex-col opacity-60 items-center">
              <PhotographIcon className="w-5 h-5" />
              <span>Add cover</span>
            </div>
          )}
          <input
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            onChange={onPfpUpload}
          />
        </label>
      )}
    </div>
  );
};

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
        <Thumbnail
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
                  className="p-2.5 bg-gray-500 text-white rounded-full"
                >
                  {playing ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5 pl-0.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="w-full pr-3">
                {isNew && !txn ? (
                  <div className="flex flex-col w-full">
                    <input
                      className="border-none w-full dark:text-white bg-transparent outline-none placeholder-gray-800 dark:placeholder-gray-200"
                      placeholder="Add title..."
                      name="title"
                      value={audioPublication.title}
                      onChange={handleChange}
                    />
                    <input
                      className="border-none w-full dark:text-gray-300 text-gray-600 bg-transparent text-sm outline-none"
                      placeholder="Add author..."
                      name="author"
                      value={audioPublication.author}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <>
                    <h5>{publication?.metadata.name ?? txn.title}</h5>
                    <h6 className="text-sm opacity-70">
                      {txn?.author ??
                        getAttributeFromTrait(publication?.metadata.attributes as Attribute[], 'author')}
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
