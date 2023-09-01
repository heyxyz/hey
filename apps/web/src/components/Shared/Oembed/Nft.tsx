import { CursorClickIcon } from '@heroicons/react/outline';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { OG } from '@lenster/types/misc';
import { Button, Card, Tooltip } from '@lenster/ui';
import Link from 'next/link';
import type { FC } from 'react';

const getChainInfo = (
  chain: number
): {
  name: string;
  logo: string;
} => {
  switch (chain) {
    case 7777777:
      return {
        name: 'Zora',
        logo: 'https://zora.co/assets/icon/zora-logo.svg'
      };
    case 1:
      return {
        name: 'Ethereum',
        logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
      };
    case 10:
      return {
        name: 'Optimism',
        logo: 'https://zora.co/assets/icon/optimism-ethereum-op-logo.svg'
      };
    case 8453:
      return {
        name: 'Base',
        logo: 'https://zora.co/assets/icon/base-logo.svg'
      };
    case 424:
      return {
        name: 'PGN Network',
        logo: 'https://zora.co/assets/icon/pgn-logo.svg'
      };
    default:
      return {
        name: 'Ethereum',
        logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
      };
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
        src={`https://remote-image.decentralized-content.com/image?url=${nft.coverImageUrl}&w=1200&q=75`}
        className="max-h-[600px] w-full rounded-t-xl object-cover"
      />
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center space-x-2">
          <Tooltip placement="right" content={getChainInfo(nft.chainId).name}>
            <img src={getChainInfo(nft.chainId).logo} className="h-5 w-5" />
          </Tooltip>
          <div className="text-sm font-bold">{nft.name}</div>
        </div>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => stopEventPropagation(event)}
        >
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
