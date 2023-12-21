import type { AnyPublication } from '@hey/lens';
import type { UnlonelyNfcMetadata } from '@hey/types/nft';
import type { FC } from 'react';

import Video from '@components/Shared/Video';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import useUnlonelyNfc from 'src/hooks/unlonely/useUnlonelyNfc';
import urlcat from 'urlcat';

import NftShimmer from './Shimmer';

interface UnlonelyNfcProps {
  nftMetadata: UnlonelyNfcMetadata;
  publication?: AnyPublication;
}

const UnlonelyNfc: FC<UnlonelyNfcProps> = ({ nftMetadata, publication }) => {
  const { id } = nftMetadata;

  const {
    data: nfc,
    error,
    loading
  } = useUnlonelyNfc({
    enabled: Boolean(id),
    id
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!nfc) {
    return null;
  }

  if (error) {
    return null;
  }

  const { title, videoLink, videoThumbnail } = nfc;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <Video
        className="[&>div>div]:rounded-b-none [&>div>div]:border-0"
        poster={videoThumbnail}
        src={videoLink}
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip content="Unlonely Nfc" placement="right">
            <img
              alt="Unlonely"
              className="size-5 rounded-full"
              src={`${STATIC_IMAGES_URL}/brands/unlonely.png`}
            />
          </Tooltip>
          <div className="text-sm font-bold">{title}</div>
        </div>
        {publication ? (
          <Link
            href={urlcat('https://www.unlonely.app/nfc/:id', {
              id: nfc.id
            })}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              className="text-sm"
              icon={<CursorArrowRaysIcon className="size-4" />}
              onClick={() =>
                Leafwatch.track(
                  PUBLICATION.OPEN_ACTIONS.UNLONELY_NFC.OPEN_LINK,
                  {
                    from: 'mint_embed',
                    publication_id: publication.id
                  }
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

export default UnlonelyNfc;
