import { CursorClickIcon } from '@heroicons/react/outline';
import { FeatureFlag } from '@lenster/data/feature-flags';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { ZoraNftMetadata } from '@lenster/types/zora-nft';
import { Button, Card, Modal, Tooltip } from '@lenster/ui';
import getZoraChainInfo from '@lib/getZoraChainInfo';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC, useState } from 'react';
import useZoraNft from 'src/hooks/zora/useZoraNft';

import Mint from './Mint';
import NftShimmer from './Shimmer';

const allowedToMint = ['ERC721_SINGLE_EDITION', 'ERC1155_COLLECTION_TOKEN'];

interface NftProps {
  nftMetadata: ZoraNftMetadata;
}

const Nft: FC<NftProps> = ({ nftMetadata }) => {
  const { chain, address, token } = nftMetadata;
  const [showMintModal, setShowMintModal] = useState(false);
  const isZoraMintEnabled = isFeatureEnabled(FeatureFlag.ZoraMint);

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

  const canMint = allowedToMint.includes(nft.contractType);

  return (
    <Card className="mt-3" forceRounded>
      <img
        src={`https://remote-image.decentralized-content.com/image?url=${nft.coverImageUrl}&w=1200&q=75`}
        className="h-[400px] max-h-[400px] w-full rounded-t-xl object-cover"
      />
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-2">
          <Tooltip
            placement="right"
            content={getZoraChainInfo(nft.chainId).name}
          >
            <img src={getZoraChainInfo(nft.chainId).logo} className="h-5 w-5" />
          </Tooltip>
          <div className="text-sm font-bold">{nft.name}</div>
        </div>
        {isZoraMintEnabled && canMint && nft.contractStandard === 'ERC721' ? (
          <>
            <Button
              className="text-sm"
              icon={<CursorClickIcon className="h-4 w-4" />}
              size="md"
              onClick={() => setShowMintModal(true)}
            >
              <Trans>Mint</Trans>
            </Button>
            <Modal
              title="Mint"
              show={showMintModal}
              onClose={() => setShowMintModal(false)}
            >
              <Mint nft={nft} />
            </Modal>
          </>
        ) : (
          <Link
            href={`https://zora.co/collect/${chain}:${address}${
              token ? `/${token}` : ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => stopEventPropagation(event)}
          >
            <Button
              className="text-sm"
              icon={<CursorClickIcon className="h-4 w-4" />}
              size="md"
            >
              {nft.contractType === 'ERC1155_COLLECTION' ? (
                <Trans>Mint All</Trans>
              ) : (
                <Trans>Mint</Trans>
              )}
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};

export default Nft;
