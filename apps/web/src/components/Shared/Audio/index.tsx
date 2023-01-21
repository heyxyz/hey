import { PauseIcon, PlayIcon } from '@heroicons/react/solid';
import { Analytics } from '@lib/analytics';
import getAttributeFromTrait from '@lib/getAttributeFromTrait';
import getThumbnailUrl from '@lib/getThumbnailUrl';
import { t } from '@lingui/macro';
import type { Attribute, Publication } from 'lens';
import type { APITypes } from 'plyr-react';
import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { PUBLICATION } from 'src/tracking';
import { object, string } from 'zod';

import CoverImage from './CoverImage';
import Player from './Player';

interface Props {
  src: string;
  isNew?: boolean;
  publication?: Publication;
  txn: any;
  expandCover: (url: string) => void;
}

export const AudioPublicationSchema = object({
  title: string()
    .trim()
    .min(1, { message: t`Invalid audio title` }),
  author: string()
    .trim()
    .min(1, { message: t`Invalid author name` }),
  cover: string()
    .trim()
    .min(1, { message: t`Invalid cover image` })
});

const Audio: FC<Props> = ({ src, isNew = false, publication, txn, expandCover }) => {
  const [playing, setPlaying] = useState(false);
  const audioPublication = usePublicationStore((state) => state.audioPublication);
  const setAudioPublication = usePublicationStore((state) => state.setAudioPublication);
  const playerRef = useRef<APITypes>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handlePlayPause = () => {
    if (!playerRef.current) {
      return;
    }
    if (playerRef.current?.plyr.paused && !playing) {
      setPlaying(true);
      Analytics.track(PUBLICATION.ATTACHEMENT.AUDIO.PLAY);

      return playerRef.current?.plyr.play();
    }
    setPlaying(false);
    playerRef.current?.plyr.pause();
    Analytics.track(PUBLICATION.ATTACHEMENT.AUDIO.PAUSE);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioPublication({ ...audioPublication, [e.target.name]: e.target.value });
  };

  return (
    <div className="border px-3.5 pt-3.5 md:p-0 bg-brand-500 overflow-hidden dark:border-gray-700 rounded-xl">
      <div className="flex flex-wrap md:flex-nowrap md:space-x-2">
        <CoverImage
          isNew={isNew && !txn}
          cover={isNew ? (txn ? txn.cover : audioPublication.cover) : getThumbnailUrl(publication)}
          setCover={(url, mimeType) =>
            setAudioPublication({ ...audioPublication, cover: url, coverMimeType: mimeType })
          }
          imageRef={imageRef}
          expandCover={expandCover}
        />
        <div className="flex py-1 md:px-3 flex-col justify-between w-full truncate">
          <div className="flex justify-between mt-3 md:mt-7">
            <div className="flex items-center space-x-2.5 w-full truncate">
              <button type="button" onClick={handlePlayPause}>
                {playing && !playerRef.current?.plyr.paused ? (
                  <PauseIcon className="w-[50px] h-[50px] text-gray-100 hover:text-white" />
                ) : (
                  <PlayIcon className="w-[50px] h-[50px] text-gray-100 hover:text-white" />
                )}
              </button>
              <div className="w-full pr-3 truncate">
                {isNew && !txn ? (
                  <div className="flex flex-col w-full">
                    <input
                      className="border-none text-lg text-white placeholder-white bg-transparent outline-none"
                      placeholder={t`Add title`}
                      name="title"
                      value={audioPublication.title}
                      autoComplete="off"
                      onChange={handleChange}
                    />
                    <input
                      className="border-none text-white/70 placeholder-white/70 bg-transparent outline-none"
                      placeholder={t`Add author`}
                      name="author"
                      value={audioPublication.author}
                      onChange={handleChange}
                      autoComplete="off"
                    />
                  </div>
                ) : (
                  <>
                    <h5 className="text-lg text-white truncate">{publication?.metadata.name ?? txn.title}</h5>
                    <h6 className="text-white/70 truncate">
                      {txn?.author ??
                        getAttributeFromTrait(publication?.metadata.attributes as Attribute[], 'author') ??
                        publication?.profile.name}
                    </h6>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="md:pb-3">
            <Player src={src} playerRef={playerRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Audio;
