import type { AnyPublication } from '@hey/lens';
import type { BasicNftMetadata } from '@hey/types/nft';
import type { FC } from 'react';

import {
  CursorArrowRaysIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import getZoraChainInfo from '@hey/lib/getZoraChainInfo';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Button, Card, Modal, Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';
import { useState } from 'react';
import useZoraNft from 'src/hooks/zora/useZoraNft';
import urlcat from 'urlcat';

import Mint, { useZoraMintStore } from './Mint';
import NftShimmer from './Shimmer';

interface ZoraNftProps {
  nftMetadata: BasicNftMetadata;
  publication?: AnyPublication;
}

const ZoraNft: FC<ZoraNftProps> = ({ nftMetadata, publication }) => {
  const setQuantity = useZoraMintStore((state) => state.setQuantity);
  const setCanMintOnHey = useZoraMintStore((state) => state.setCanMintOnHey);

  const { address, chain, token } = nftMetadata;
  const [showMintModal, setShowMintModal] = useState(false);

  const {
    data: nft,
    error,
    loading
  } = useZoraNft({
    address,
    chain,
    enabled: Boolean(chain && address),
    token: token
  });

  if (loading) {
    return <NftShimmer />;
  }

  if (!nft) {
    return null;
  }

  if (error) {
    return null;
  }

  const canMint = [
    'ERC1155_COLLECTION_TOKEN',
    'ERC721_DROP',
    'ERC721_SINGLE_EDITION'
  ].includes(nft.contractType);

  const zoraLink = nftMetadata.mintLink;

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <img
        alt={nft.name}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
        src={urlcat('https://remote-image.decentralized-content.com/image', {
          q: 75,
          url: nft.coverImageUrl,
          w: 1200
        })}
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Tooltip
            content={getZoraChainInfo(nft.chainId).name}
            placement="right"
          >
            <img
              alt={getZoraChainInfo(nft.chainId).name}
              className="size-5"
              src={getZoraChainInfo(nft.chainId).logo}
            />
          </Tooltip>
          <div className="text-sm font-bold">{nft.name}</div>
          {nft.contractType === 'ERC1155_COLLECTION' ? (
            <Tooltip content="ERC-1155 Collection" placement="right">
              <RectangleStackIcon className="size-4" />
            </Tooltip>
          ) : null}
        </div>
        {publication ? (
          canMint ? (
            <>
              <Button
                className="text-sm"
                icon={<CursorArrowRaysIcon className="size-4" />}
                onClick={() => {
                  setQuantity(1);
                  setCanMintOnHey(false);
                  setShowMintModal(true);
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_MINT, {
                    from: 'mint_embed',
                    publication_id: publication.id
                  });
                }}
                size="md"
              >
                Mint
              </Button>
              <Modal
                icon={<CursorArrowRaysIcon className="text-brand-500 size-5" />}
                onClose={() => setShowMintModal(false)}
                show={showMintModal}
                title="Mint on Zora"
              >
                <Mint nft={nft} publication={publication} zoraLink={zoraLink} />
              </Modal>
            </>
          ) : (
            <Link href={zoraLink} rel="noopener noreferrer" target="_blank">
              <Button
                className="text-sm"
                icon={<CursorArrowRaysIcon className="size-4" />}
                onClick={() =>
                  Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_LINK, {
                    from: 'mint_embed',
                    publication_id: publication.id
                  })
                }
                size="md"
              >
                {nft.contractType === 'ERC1155_COLLECTION'
                  ? 'Mint all on Zora'
                  : 'Mint on Zora'}
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

export default ZoraNft;
