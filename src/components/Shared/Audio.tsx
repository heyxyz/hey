import { Spinner } from '@components/UI/Spinner';
import { PhotographIcon } from '@heroicons/react/outline';
import getTimeFromSeconds from '@lib/formatSeconds';
import getIPFSLink from '@lib/getIPFSLink';
import uploadMediaToIPFS from '@lib/uploadMediaToIPFS';
import clsx from 'clsx';
import type { ChangeEvent, Dispatch, FC } from 'react';
import { useId } from 'react';
import { useCallback, useEffect } from 'react';
import { useRef, useState } from 'react';
import React from 'react';
import toast from 'react-hot-toast';
import { ERROR_MESSAGE } from 'src/constants';

interface Props {
  src: string;
  isEdit?: boolean;
}

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

type ThumbnailProps = { isEdit: boolean; cover: string; setCover: Dispatch<string> };

const Thumbnail: FC<ThumbnailProps> = ({ isEdit = false, cover, setCover }) => {
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
        setCover(getIPFSLink(attachment[0].item));
      } catch (error) {
        onError(error);
      }
    }
  };

  return (
    <div className="relative flex-none overflow-hidden group">
      <img src={cover} className="object-cover w-36 h-36 border" draggable={false} alt="cover" />
      {isEdit && (
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

const Audio: FC<Props> = ({ src, isEdit = false }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [cover, setCover] = useState('');
  const [duration, setDuration] = useState('00:00');

  const waveSurfer = useRef<WaveSurfer>();
  const id = useId();

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
      }
    };
  }, [src, createPlayer]);

  const handlePlayPause = () => {
    setPlaying(!playing);
    waveSurfer.current?.playPause();
  };
  console.log('🚀 ~ file: Audio.tsx ~ line 122 ~ handlePlayPause ~ waveSurfer', waveSurfer);

  return (
    <div className="border w-full overflow-hidden border-gray-200 dark:border-gray-800 rounded-xl">
      <div className="flex flex-1 space-x-2">
        <Thumbnail isEdit={isEdit} cover={cover} setCover={setCover} />
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
                {isEdit ? (
                  <div className="flex flex-col w-full">
                    <input
                      className="border-none w-full dark:text-white bg-transparent outline-none placeholder-gray-800 dark:placeholder-gray-200"
                      placeholder="Add title..."
                    />
                    <input
                      className="border-none w-full dark:text-gray-300 bg-transparent text-sm outline-none"
                      placeholder="Add author..."
                    />
                  </div>
                ) : (
                  <>
                    <h5>Title</h5>
                    <h6>Author</h6>
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
