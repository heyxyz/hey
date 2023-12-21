import type { AnyPublication } from '@hey/lens';
import type { UnlonelyChannelMetadata } from '@hey/types/nft';
import type { FC } from 'react';

import Video from '@components/Shared/Video';
import {
  CursorArrowRaysIcon,
  SignalIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import useUnlonelyChannel from 'src/hooks/unlonely/useUnlonelyChannel';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';

interface UnlonelyChannelProps {
  nftMetadata: UnlonelyChannelMetadata;
  publication?: AnyPublication;
}

const UnlonelyChannel: FC<UnlonelyChannelProps> = ({
  nftMetadata,
  publication
}) => {
  const { slug } = nftMetadata;

  const {
    data: channel,
    error,
    loading
  } = useUnlonelyChannel({
    enabled: Boolean(slug),
    slug
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!channel) {
    return null;
  }

  if (error) {
    return null;
  }

  const { isLive, name, playbackUrl } = channel;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <Video
        className="[&>div>div]:rounded-b-none [&>div>div]:border-0"
        src={playbackUrl}
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip content="Unlonely Channel" placement="right">
            <img
              alt="Unlonely"
              className="size-5 rounded-full"
              src={`${STATIC_IMAGES_URL}/brands/unlonely.png`}
            />
          </Tooltip>
          <div className="text-sm font-bold">{name}</div>
          <div
            className={cn(
              isLive ? 'bg-red-500' : 'bg-gray-500',
              'flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-white'
            )}
          >
            {isLive ? (
              <SignalIcon className="size-3 animate-pulse" />
            ) : (
              <SignalSlashIcon className="size-3" />
            )}
            <span>{isLive ? 'Live' : 'Offline'}</span>
          </div>
        </div>
        {publication ? (
          <Link
            href={urlcat('https://www.unlonely.app/channels/:slug', {
              slug: channel.slug
            })}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              className="text-sm"
              icon={<CursorArrowRaysIcon className="size-4" />}
              onClick={() =>
                Leafwatch.track(
                  PUBLICATION.OPEN_ACTIONS.UNLONELY_CHANNEL.OPEN_LINK,
                  { from: 'mint_embed', publication_id: publication.id }
                )
              }
              size="md"
            >
              Open
            </Button>
          </Link>
        ) : (
          <div className="h-7" />
        )}
      </div>
    </Card>
  );
};

export default UnlonelyChannel;
