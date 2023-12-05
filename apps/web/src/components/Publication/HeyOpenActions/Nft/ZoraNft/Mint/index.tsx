import type { AnyPublication } from '@hey/lens';
import type { ZoraNft } from '@hey/types/nft';
import type { FC } from 'react';

import Markup from '@components/Shared/Markup';
import getMentions from '@hey/lib/getMentions';
import { create } from 'zustand';

import Metadata from './Metadata';
import MintAction from './MintAction';
import MintedBy from './MintedBy';
import Price from './Price';

interface ZoraMintState {
  canMintOnHey: boolean;
  quantity: number;
  setCanMintOnHey: (canMintOnHey: boolean) => void;
  setQuantity: (quantity: number) => void;
}

export const useZoraMintStore = create<ZoraMintState>((set) => ({
  canMintOnHey: false,
  quantity: 1,
  setCanMintOnHey: (canMintOnHey) => set({ canMintOnHey }),
  setQuantity: (quantity) => set({ quantity })
}));

interface MintProps {
  nft: ZoraNft;
  onCompleted?: () => void;
  publication?: AnyPublication;
  zoraLink: string;
}

const Mint: FC<MintProps> = ({ nft, onCompleted, publication, zoraLink }) => {
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
        onCompleted={onCompleted}
        publication={publication}
        zoraLink={zoraLink}
      />
    </div>
  );
};

export default Mint;
