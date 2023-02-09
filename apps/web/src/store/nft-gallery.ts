import type { Nft } from 'lens';
import { create } from 'zustand';

export interface Item extends Nft {
  itemId?: string;
  newOrder?: number;
}

interface NftGallery {
  name: string;
  items: Item[];
  alreadySelectedItems: Item[];
  id: string;
  isEdit: boolean;
  toAdd: Item[];
  toRemove: Item[];
  reArrangedItems: Item[];
}

interface NftGalleryState {
  gallery: NftGallery;
  setGallery: (gallery: NftGallery) => void;
}

export const GALLERY_DEFAULTS = {
  name: '',
  items: [],
  toAdd: [],
  toRemove: [],
  isEdit: false,
  id: '',
  alreadySelectedItems: [],
  reArrangedItems: []
};

export const useNftGalleryStore = create<NftGalleryState>((set) => ({
  gallery: GALLERY_DEFAULTS,
  setGallery: (gallery) => set(() => ({ gallery }))
}));
