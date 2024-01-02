import type { AnyPublication } from '@hey/lens';
import type { SoundReleaseMetadata } from '@hey/types/nft';
import type { APITypes } from 'plyr-react';

import Player from '@components/Shared/Audio/Player';
import {
  CursorArrowRaysIcon,
  PauseIcon,
  PlayIcon
} from '@heroicons/react/24/solid';
import { REWARDS_ADDRESS, STATIC_IMAGES_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import humanize from '@hey/lib/humanize';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Image, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { type FC, useRef, useState } from 'react';
import useSoundRelease from 'src/hooks/sound/useSoundRelease';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';

interface SoundReleaseProps {
  nftMetadata: SoundReleaseMetadata;
  publication?: AnyPublication;
}

const SoundRelease: FC<SoundReleaseProps> = ({ nftMetadata, publication }) => {
  const { handle, mintLink, slug } = nftMetadata;
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<APITypes>(null);

  const {
    data: release,
    error,
    loading
  } = useSoundRelease({
    enabled: Boolean(handle && slug),
    handle,
    slug
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!release) {
    return null;
  }

  if (error) {
    return null;
  }

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

  const { artist, coverImage, numSold, title, track } = release;
  const peaks = track.normalizedPeaks?.reduce(
    (acc: number[], curr: number, index) => {
      if (index % 10 === 0) {
        acc.push(curr / 2);
      }

      return acc;
    },
    []
  );

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <div
        className="rounded-t-xl dark:border-gray-700"
        onClick={stopEventPropagation}
        style={{
          backgroundColor: coverImage.dominantColor,
          backgroundImage: `url(${coverImage.url})`
        }}
      >
        <div className="!rounded-t-xl backdrop-blur-2xl backdrop-brightness-50">
          <div className="flex p-5">
            <Image
              alt={`sound-release-cover-${coverImage.url}`}
              className="size-40 rounded-xl object-cover"
              draggable={false}
              height={160}
              src={coverImage.url}
              width={160}
            />
            <div className="flex w-full flex-col justify-between truncate px-3">
              <div className="mt-3 flex justify-between md:mt-7">
                <div className="flex w-full items-center space-x-2.5 truncate">
                  <button onClick={handlePlayPause} type="button">
                    {playing && !playerRef.current?.plyr.paused ? (
                      <PauseIcon className="size-[50px] text-gray-100 hover:text-white" />
                    ) : (
                      <PlayIcon className="size-[50px] text-gray-100 hover:text-white" />
                    )}
                  </button>
                  <div className="w-full space-y-1 truncate pr-3">
                    <h5 className="truncate text-lg text-white">{title}</h5>
                    <h6 className="flex items-center space-x-2 truncate text-white/70">
                      <img
                        alt="Artist"
                        className="size-4 rounded-full"
                        height={16}
                        src={artist.user.avatar.url}
                        width={16}
                      />
                      <div>{artist.name}</div>
                      <span>•</span>
                      <b className="text-sm">{humanize(numSold)} Mints</b>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="md:pb-3">
                <Player playerRef={playerRef} src={track.audio.audio256k.url} />
              </div>
            </div>
          </div>
          <div className="flex items-end space-x-1">
            {peaks?.map((peak, index) => (
              <div
                className="w-2 rounded-t-lg bg-gray-100/50"
                key={`peak-${index}`}
                style={{
                  height: `${peak}px`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip content="Sound Release" placement="right">
            <img
              alt="Sound"
              className="size-5 rounded-full"
              src={`${STATIC_IMAGES_URL}/brands/sound.png`}
            />
          </Tooltip>
          <div className="text-sm font-bold">{title}</div>
        </div>
        <Link
          href={urlcat(mintLink, {
            referral: REWARDS_ADDRESS,
            referral_source: 'link'
          })}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="size-4" />}
            onClick={() =>
              Leafwatch.track(
                PUBLICATION.OPEN_ACTIONS.SOUND_RELEASE.OPEN_LINK,
                {
                  from: 'mint_embed',
                  publication_id: publication?.id
                }
              )
            }
            size="md"
          >
            Open
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default SoundRelease;
