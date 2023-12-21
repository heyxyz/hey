import type { AnyPublication, Profile } from '@hey/lens';
import type { APITypes } from 'plyr-react';
import type { ChangeEvent, FC } from 'react';

import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import getProfile from '@hey/lib/getProfile';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Leafwatch } from '@lib/leafwatch';
import { useRef, useState } from 'react';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';
import { object, string } from 'zod';

import CoverImage from './CoverImage';
import Player from './Player';

export const AudioPublicationSchema = object({
  artist: string().trim().min(1, { message: 'Invalid artist name' }),
  cover: string().trim().min(1, { message: 'Invalid cover image' }),
  title: string().trim().min(1, { message: 'Invalid audio title' })
});

interface AudioProps {
  artist?: string;
  expandCover: (url: string) => void;
  isNew?: boolean;
  poster: string;
  publication?: AnyPublication;
  src: string;
  title?: string;
}

const Audio: FC<AudioProps> = ({
  artist,
  expandCover,
  isNew = false,
  poster,
  publication,
  src,
  title
}) => {
  const audioPublication = usePublicationStore(
    (state) => state.audioPublication
  );
  const setAudioPublication = usePublicationStore(
    (state) => state.setAudioPublication
  );

  const [newPreviewUri, setNewPreviewUri] = useState<null | string>(null);
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handlePlayPause = () => {
    if (!playerRef.current) {
      return;
    }
    if (playerRef.current?.plyr.paused && !playing) {
      setPlaying(true);
      Leafwatch.track(PUBLICATION.ATTACHMENT.AUDIO.PLAY, {
        publication_id: publication?.id
      });

      return playerRef.current?.plyr.play();
    }
    setPlaying(false);
    playerRef.current?.plyr.pause();
    Leafwatch.track(PUBLICATION.ATTACHMENT.AUDIO.PAUSE, {
      publication_id: publication?.id
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioPublication({
      ...audioPublication,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div
      className="bg-brand-500 overflow-hidden rounded-xl border px-3.5 pt-3.5 md:p-0 dark:border-gray-700"
      onClick={stopEventPropagation}
    >
      <div className="flex flex-wrap md:flex-nowrap md:space-x-2">
        <CoverImage
          cover={isNew ? (newPreviewUri as string) : poster}
          expandCover={expandCover}
          imageRef={imageRef}
          isNew={isNew}
          setCover={(previewUri, url) => {
            setNewPreviewUri(previewUri);
            setAudioPublication({ ...audioPublication, cover: url });
          }}
        />
        <div className="flex w-full flex-col justify-between truncate py-1 md:px-3">
          <div className="mt-3 flex justify-between md:mt-7">
            <div className="flex w-full items-center space-x-2.5 truncate">
              <button onClick={handlePlayPause} type="button">
                {playing && !playerRef.current?.plyr.paused ? (
                  <PauseIcon className="size-[50px] text-gray-100 hover:text-white" />
                ) : (
                  <PlayIcon className="size-[50px] text-gray-100 hover:text-white" />
                )}
              </button>
              <div className="w-full truncate pr-3">
                {isNew ? (
                  <div className="flex w-full flex-col space-y-1">
                    <input
                      autoComplete="off"
                      className="border-none bg-transparent p-0 text-lg text-white placeholder:text-white focus:ring-0"
                      name="title"
                      onChange={handleChange}
                      placeholder="Add title"
                      value={audioPublication.title}
                    />
                    <input
                      autoComplete="off"
                      className="border-none bg-transparent p-0 text-white/70 placeholder:text-white/70 focus:ring-0"
                      name="artist"
                      onChange={handleChange}
                      placeholder="Add artist"
                      value={audioPublication.artist}
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="truncate text-lg text-white">{title}</h5>
                    <h6 className="truncate text-white/70">
                      {artist ||
                        getProfile(publication?.by as Profile).displayName}
                    </h6>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="md:pb-3">
            <Player playerRef={playerRef} src={src} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
