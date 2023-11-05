import Markup from '@components/Shared/Markup';
import type { AnyPublication } from '@hey/lens';
import getMentions from '@hey/lib/getMentions';
import type { ZoraNft } from '@hey/types/nft';
import { type FC, memo } from 'react';
import { create } from 'zustand';

import Metadata from './Metadata';
import MintAction from './MintAction';
import MintedBy from './MintedBy';
import Price from './Price';

interface ZoraMintState {
  quantity: number;
  setQuantity: (quantity: number) => void;
  canMintOnHey: boolean;
  setCanMintOnHey: (canMintOnHey: boolean) => void;
}

export const useZoraMintStore = create<ZoraMintState>((set) => ({
  quantity: 1,
  setQuantity: (quantity) => set({ quantity }),
  canMintOnHey: false,
  setCanMintOnHey: (canMintOnHey) => set({ canMintOnHey })
}));

interface MintProps {
  nft: ZoraNft;
  zoraLink: string;
  publication?: AnyPublication;
  onCompleted?: () => void;
}

const Mint: FC<MintProps> = ({ nft, zoraLink, publication, onCompleted }) => {
  return (
    <div className="p-5">
      <div className="mb-4">
        <div className="mb-1 text-xl font-bold">{nft.name}</div>
        <MintedBy address={nft.creator} />
        <Markup
          className="ld-text-gray-500 line-clamp-4"
          mentions={getMentions(nft.description)}
        >
          {nft.description}
        </Markup>
      </div>
      <Metadata nft={nft} zoraLink={zoraLink} />
      <Price nft={nft} />
      <MintAction
        nft={nft}
        zoraLink={zoraLink}
        publication={publication}
        onCompleted={onCompleted}
      />
    </div>
  );
};

export default memo(Mint);
