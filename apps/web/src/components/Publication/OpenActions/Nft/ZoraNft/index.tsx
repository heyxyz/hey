import {
  CursorArrowRaysIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline';
import { REWARDS_ADDRESS } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import type { Publication } from '@hey/lens';
import getZoraChainIsMainnet from '@hey/lib/nft/getZoraChainIsMainnet';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { BasicNftMetadata } from '@hey/types/nft';
import { Button, Card, Modal, Tooltip } from '@hey/ui';
import getZoraChainInfo from '@lib/getZoraChainInfo';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC, useState } from 'react';
import useZoraNft from 'src/hooks/zora/useZoraNft';
import urlcat from 'urlcat';

import Mint, { useZoraMintStore } from './Mint';
import NftShimmer from './Shimmer';

interface ZoraNftProps {
  nftMetadata: BasicNftMetadata;
  publication: Publication;
}

const ZoraNft: FC<ZoraNftProps> = ({ nftMetadata, publication }) => {
  const { chain, address, token } = nftMetadata;
  const [showMintModal, setShowMintModal] = useState(false);
  const { setQuantity, setCanMintOnHey } = useZoraMintStore();

  const {
    data: nft,
    loading,
    error
  } = useZoraNft({
    chain,
    address,
    token: token,
    enabled: Boolean(chain && address)
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
    'ERC721_DROP',
    'ERC721_SINGLE_EDITION',
    'ERC1155_COLLECTION_TOKEN'
  ].includes(nft.contractType);

  const network = getZoraChainIsMainnet(chain) ? '' : 'testnet.';
  const zoraLink = urlcat(`https://${network}zora.co/collect/:chain::address`, {
    chain,
    address,
    referrer: REWARDS_ADDRESS
  });

  return (
    <Card
      className="mt-3"
      forceRounded
      onClick={(event) => stopEventPropagation(event)}
    >
      <img
        src={urlcat('https://remote-image.decentralized-content.com/image', {
          url: nft.coverImageUrl,
          w: 1200,
          q: 75
        })}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
      />
      <div className="flex items-center justify-between border-t px-3 py-2 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Tooltip
            placement="right"
            content={getZoraChainInfo(nft.chainId).name}
          >
            <img src={getZoraChainInfo(nft.chainId).logo} className="h-5 w-5" />
          </Tooltip>
          <div className="text-sm font-bold">{nft.name}</div>
          {nft.contractType === 'ERC1155_COLLECTION' ? (
            <Tooltip placement="right" content={t`ERC-1155 Collection`}>
              <RectangleStackIcon className="h-4 w-4" />
            </Tooltip>
          ) : null}
        </div>
        {canMint ? (
          <>
            <Button
              className="text-sm"
              icon={<CursorArrowRaysIcon className="h-4 w-4" />}
              size="md"
              onClick={() => {
                setQuantity(1);
                setCanMintOnHey(false);
                setShowMintModal(true);
                Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_MINT, {
                  publication_id: publication.id,
                  from: 'mint_embed'
                });
              }}
            >
              <Trans>Mint</Trans>
            </Button>
            <Modal
              title={t`Mint on Zora`}
              show={showMintModal}
              icon={<CursorArrowRaysIcon className="text-brand h-5 w-5" />}
              onClose={() => setShowMintModal(false)}
            >
              <Mint nft={nft} zoraLink={zoraLink} publication={publication} />
            </Modal>
          </>
        ) : (
          <Link href={zoraLink} target="_blank" rel="noopener noreferrer">
            <Button
              className="text-sm"
              icon={<CursorArrowRaysIcon className="h-4 w-4" />}
              size="md"
              onClick={() =>
                Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_LINK, {
                  publication_id: publication.id,
                  from: 'mint_embed'
                })
              }
            >
              {nft.contractType === 'ERC1155_COLLECTION' ? (
                <Trans>Mint all on Zora</Trans>
              ) : (
                <Trans>Mint on Zora</Trans>
              )}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ZoraNft;
