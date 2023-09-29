import type { Publication } from '@hey/lens';
import type { BasePaintNft } from '@hey/types/nft';
import { type FC } from 'react';
import { create } from 'zustand';

import Metadata from './Metadata';
import MintAction from './MintAction';
import Price from './Price';

interface BasePaintMintState {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export const useBasePaintMintStore = create<BasePaintMintState>((set) => ({
  quantity: 1,
  setQuantity: (quantity) => set({ quantity })
}));

interface MintProps {
  canvas: BasePaintNft;
  publication: Publication;
}

const Mint: FC<MintProps> = ({ canvas, publication }) => {
  return (
    <div className="p-5">
      <div className="mb-4">
        <div className="mb-1 text-xl font-bold">
          Day #{canvas.id}: {canvas.theme}
        </div>
      </div>
      <Metadata canvas={canvas} />
      <Price />
      <MintAction canvas={canvas} publication={publication} />
    </div>
  );
};

export default Mint;
