import type { Nft } from 'lens';
import { create } from 'zustand';

export interface Item extends Nft {
  itemId?: string;
  position?: number;
}

interface NftGallery {
  name: string;
  items: Item[];
  alreadySelectedItems: Item[];
  id: string;
  isEdit: boolean;
  toAdd: Item[];
  toRemove: Item[];
}

interface NftGalleryState {
  gallery: NftGallery;
  setGallery: (gallery: NftGallery) => void;
}

export const useNftGalleryStore = create<NftGalleryState>((set) => ({
  gallery: { name: '', items: [], toAdd: [], toRemove: [], isEdit: false, id: '', alreadySelectedItems: [] },
  setGallery: (gallery) => set(() => ({ gallery }))
}));
