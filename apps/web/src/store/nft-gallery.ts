import type { Nft } from 'lens';
import { create } from 'zustand';

export interface Item extends Nft {
  itemId?: string;
  newOrder?: number;
}

export interface ReArrangedItem {
  tokenId: string;
  contractAddress: string;
  chainId: string;
  newOrder: number;
}

interface NftGallery {
  name: string;
  items: Item[];
  alreadySelectedItems: Item[];
  id: string;
  isEdit: boolean;
  toAdd: Item[];
  toRemove: Item[];
  reArrangedItems: ReArrangedItem[];
}

interface NftGalleryState {
  gallery: NftGallery;
  setGallery: (gallery: NftGallery) => void;
}

export const useNftGalleryStore = create<NftGalleryState>((set) => ({
  gallery: {
    name: '',
    items: [],
    toAdd: [],
    toRemove: [],
    isEdit: false,
    id: '',
    alreadySelectedItems: [],
    reArrangedItems: []
  },
  setGallery: (gallery) => set(() => ({ gallery }))
}));
