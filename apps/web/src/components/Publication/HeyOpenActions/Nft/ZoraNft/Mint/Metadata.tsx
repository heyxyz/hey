import type { ZoraNft } from '@hey/types/nft';
import type { FC } from 'react';

import {
  ArrowTopRightOnSquareIcon,
  PuzzlePieceIcon,
  ShoppingBagIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import humanize from '@hey/lib/humanize';
import { Leafwatch } from '@lib/leafwatch';
import Link from 'next/link';

interface MetadataProps {
  nft: ZoraNft;
  zoraLink: string;
}

const Metadata: FC<MetadataProps> = ({ nft, zoraLink }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center space-x-2">
        <PuzzlePieceIcon className="ld-text-gray-500 size-4" />
        <div className="space-x-1.5">
          <span>Type:</span>
          <b>{nft.contractStandard === 'ERC721' ? 'ERC-721' : 'ERC-1155'}</b>
        </div>
      </div>
      {nft.totalMinted > 0 ? (
        <div className="flex items-center space-x-2">
          <UsersIcon className="ld-text-gray-500 size-4" />
          <b>{humanize(nft.totalMinted)} minted</b>
        </div>
      ) : null}
      {!nft.isOpenEdition ? (
        <div className="flex items-center space-x-2">
          <ShoppingBagIcon className="ld-text-gray-500 size-4" />
          <b>{humanize(nft.remainingSupply)} remaining</b>
        </div>
      ) : null}
      <Link
        className="flex items-center space-x-2"
        href={zoraLink}
        onClick={() => {
          Leafwatch.track(PUBLICATION.OPEN_ACTIONS.ZORA_NFT.OPEN_LINK, {
            from: 'mint_modal_link'
          });
        }}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ArrowTopRightOnSquareIcon className="ld-text-gray-500 size-4" />
        <b>Open in Zora</b>
      </Link>
    </div>
  );
};

export default Metadata;
