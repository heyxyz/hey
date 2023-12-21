import type { AnyPublication } from '@hey/lens';
import type { BasePaintCanvasMetadata } from '@hey/types/nft';
import type { FC } from 'react';

import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { BASEPAINT_CONTRACT } from '@hey/data/contracts';
import { PUBLICATION } from '@hey/data/tracking';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Modal, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useState } from 'react';
import useBasePaintCanvas from 'src/hooks/basepaint/useBasePaintCanvas';
import urlcat from 'urlcat';

import Mint, { useBasePaintMintStore } from './Mint';
import NftShimmer from './Shimmer';

interface BasePaintCanvasProps {
  nftMetadata: BasePaintCanvasMetadata;
  publication?: AnyPublication;
}

const BasePaintCanvas: FC<BasePaintCanvasProps> = ({
  nftMetadata,
  publication
}) => {
  const { id } = nftMetadata;
  const [showMintModal, setShowMintModal] = useState(false);
  const setQuantity = useBasePaintMintStore((state) => state.setQuantity);

  const {
    data: canvas,
    error,
    loading
  } = useBasePaintCanvas({
    enabled: Boolean(id),
    id
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!canvas?.bitmap) {
    return null;
  }

  if (error) {
    return null;
  }

  const { bitmap, canContribute, canMint, theme } = canvas;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <img
        alt="BasePaint Canvas"
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
        src={`data://image/gif;base64,${bitmap.gif}`}
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="mr-5 flex flex-wrap items-center gap-2">
          <Tooltip content="BasePaint" placement="right">
            <img
              alt="BasePaint"
              className="size-5 rounded-full"
              src={`${STATIC_IMAGES_URL}/brands/basepaint.jpeg`}
            />
          </Tooltip>
          <div className="text-sm font-bold">
            Day #{canvas.id}: {theme}
          </div>
          <div className="flex items-center space-x-1">
            {canvas.palette.map((color) => (
              <span
                className="inline-block size-4"
                key={color}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        {publication ? (
          canMint ? (
            <>
              <Button
                className="text-sm"
                icon={<CursorArrowRaysIcon className="size-4" />}
                onClick={() => {
                  setQuantity(1);
                  setShowMintModal(true);
                  Leafwatch.track(
                    PUBLICATION.OPEN_ACTIONS.BASEPAINT_NFT.OPEN_MINT,
                    { publication_id: publication.id }
                  );
                }}
                size="md"
              >
                Mint
              </Button>
              <Modal
                icon={<CursorArrowRaysIcon className="text-brand-500 size-5" />}
                onClose={() => setShowMintModal(false)}
                show={showMintModal}
                title="Mint on BasePaint"
              >
                <Mint canvas={canvas} publication={publication} />
              </Modal>
            </>
          ) : canContribute ? (
            <Link
              href={urlcat('https://basepaint.art/mint/:id', { id: canvas.id })}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button
                className="text-sm"
                icon={<CursorArrowRaysIcon className="size-4" />}
                onClick={() =>
                  Leafwatch.track(
                    PUBLICATION.OPEN_ACTIONS.BASEPAINT_NFT.OPEN_LINK,
                    { from: 'mint_embed', publication_id: publication.id }
                  )
                }
                size="md"
              >
                Contribute
              </Button>
            </Link>
          ) : (
            <Link
              href={urlcat('https://opensea.io/assets/base/:contract/:token', {
                contract: BASEPAINT_CONTRACT,
                token: canvas.id
              })}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button
                className="text-sm"
                icon={<CursorArrowRaysIcon className="size-4" />}
                onClick={() =>
                  Leafwatch.track(
                    PUBLICATION.OPEN_ACTIONS.BASEPAINT_NFT.OPEN_OPENSEA_LINK,
                    { from: 'mint_embed', publication_id: publication.id }
                  )
                }
                size="md"
              >
                View on OpenSea
              </Button>
            </Link>
          )
        ) : (
          <div className="h-7" />
        )}
      </div>
    </Card>
  );
};

export default BasePaintCanvas;
