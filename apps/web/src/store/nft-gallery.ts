import type { Nft } from '@lenster/lens';
import { create } from 'zustand';

export interface NftGalleryItem extends Nft {
  itemId?: string;
  newOrder?: number;
}

interface NftGallery {
  name: string;
  items: NftGalleryItem[];
  alreadySelectedItems: NftGalleryItem[];
  id: string;
  isEdit: boolean;
  toAdd: NftGalleryItem[];
  toRemove: NftGalleryItem[];
  reArrangedItems: NftGalleryItem[];
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
