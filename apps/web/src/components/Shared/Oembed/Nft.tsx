import { CursorClickIcon } from '@heroicons/react/outline';
import type { OG } from '@lenster/types/misc';
import { Button, Card } from '@lenster/ui';
import { Chain } from '@lenster/zora';
import Link from 'next/link';
import type { FC } from 'react';

const getChainLogo = (chain: string) => {
  switch (chain) {
    case Chain.ZoraMainnet:
      return 'https://zora.co/assets/icon/zora-logo.svg';
    case Chain.Mainnet:
      return 'https://zora.co/assets/icon/ethereum-eth-logo.svg';
    case Chain.OptimismMainnet:
      return 'https://zora.co/assets/icon/optimism-ethereum-op-logo.svg';
    case Chain.BaseMainnet:
      return 'https://zora.co/assets/icon/base-logo.svg';
    case Chain.PgnMainnet:
      return 'https://zora.co/assets/icon/pgn-logo.svg';
    default:
      return 'https://zora.co/assets/icon/ethereum-eth-logo.svg';
  }
};

interface NftProps {
  og: OG;
}

const Nft: FC<NftProps> = ({ og }) => {
  const { nft, url } = og;

  if (!nft) {
    return null;
  }

  return (
    <Card className="mt-3" forceRounded>
      <img
        src={`https://remote-image.decentralized-content.com/image?url=${nft.image?.url?.replace(
          'ipfs://',
          'https://ipfs.decentralized-content.com/ipfs/'
        )}&w=1200&q=75`}
        className="w-full rounded-t-xl object-cover"
      />
      <div className="p-5">
        <div className="mb-1 flex items-center space-x-2">
          <div className="text-lg font-bold">{nft.name}</div>
          <img src={getChainLogo(nft.networkInfo.chain)} className="h-5 w-5" />
        </div>
        {nft.collectionName ? (
          <div className="mb-2 font-bold">{nft.collectionName}</div>
        ) : null}
        {nft.description ? (
          <div className="mb-3 line-clamp-3 text-sm">{nft.description}</div>
        ) : null}
        <Link href={url} target="_blank" rel="noopener noreferrer">
          <Button
            className="text-sm"
            icon={<CursorClickIcon className="h-4 w-4" />}
            size="md"
          >
            Mint
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default Nft;
