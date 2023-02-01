import type { Nft } from 'lens';
import { create } from 'zustand';

interface Item extends Nft {
  id: string;
}

interface NftGallery {
  name: string;
  items: Item[];
}

interface NftGalleryState {
  gallery: NftGallery;
  setGallery: (gallery: NftGallery) => void;
}

export const useNftGalleryStore = create<NftGalleryState>((set) => ({
  gallery: { name: '', items: [] },
  setGallery: (gallery) => set(() => ({ gallery }))
}));
