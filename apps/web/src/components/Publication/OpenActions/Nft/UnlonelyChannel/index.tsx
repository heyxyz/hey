import Video from '@components/Shared/Video';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import type { Publication } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { UnlonelyChannelMetadata } from '@hey/types/nft';
import { Button, Card, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC } from 'react';
import useUnlonelyChannel from 'src/hooks/unlonely/useUnlonelyChannel';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';

interface UnlonelyChannelProps {
  nftMetadata: UnlonelyChannelMetadata;
  publication: Publication;
}

const UnlonelyChannel: FC<UnlonelyChannelProps> = ({
  nftMetadata,
  publication
}) => {
  const { slug } = nftMetadata;

  const {
    data: channel,
    loading,
    error
  } = useUnlonelyChannel({
    slug,
    enabled: Boolean(slug)
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

  const { name, playbackUrl } = channel;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <Video src={playbackUrl} />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip placement="right" content={t`BasePaint`}>
            <img
              src={`${STATIC_IMAGES_URL}/brands/basepaint.jpeg`}
              className="h-5 w-5 rounded-full"
            />
          </Tooltip>
          <div className="text-sm font-bold">{name}</div>
        </div>

        <Link
          href={urlcat('https://www.unlonely.app/channels/:slug', {
            slug: channel.slug
          })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            className="text-sm"
            icon={<CursorArrowRaysIcon className="h-4 w-4" />}
            size="md"
            onClick={() =>
              Leafwatch.track(
                PUBLICATION.OPEN_ACTIONS.BASEPAINT_NFT.OPEN_LINK,
                {
                  publication_id: publication.id,
                  from: 'mint_embed'
                }
              )
            }
          >
            <Trans>Open</Trans>
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default UnlonelyChannel;
