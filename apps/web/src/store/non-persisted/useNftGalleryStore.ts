import type { Nft } from '@hey/lens';

import { create } from 'zustand';

export interface NftGalleryItem extends Nft {
  itemId?: string;
  newOrder?: number;
}

interface NftGallery {
  alreadySelectedItems: NftGalleryItem[];
  id: string;
  isEdit: boolean;
  items: NftGalleryItem[];
  name: string;
  reArrangedItems: NftGalleryItem[];
  toAdd: NftGalleryItem[];
  toRemove: NftGalleryItem[];
}

interface NftGalleryState {
  gallery: NftGallery;
  setGallery: (gallery: NftGallery) => void;
}

export const GALLERY_DEFAULTS = {
  alreadySelectedItems: [],
  id: '',
  isEdit: false,
  items: [],
  name: '',
  reArrangedItems: [],
  toAdd: [],
  toRemove: []
};

export const useNftGalleryStore = create<NftGalleryState>((set) => ({
  gallery: GALLERY_DEFAULTS,
  setGallery: (gallery) => set(() => ({ gallery }))
}));
