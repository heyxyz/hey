import SingleNFT from '@components/NFT/SingleNFT';
import { EmptyState } from '@components/UI/EmptyState';
import { CollectionIcon, XIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { Nft } from 'lens';
import React from 'react';
import { useNftGalleryStore } from 'src/store/nft-gallery';

const ReviewSelection = () => {
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  const onRemoveItem = (item: Nft) => {
    const id = `${item.chainId}_${item.contractAddress}_${item.tokenId}`;
    const index = gallery.items.findIndex((n) => n.id === id);
    const nfts = gallery.items;
    nfts.splice(index, 1);
    setGallery({ name: gallery.name, items: nfts });
  };

  if (!gallery.items.length) {
    return (
      <div className="p-10">
        <EmptyState
          hideCard
          message={t`No collectables selected!`}
          icon={<CollectionIcon className="text-brand h-8 w-8" />}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
      {gallery.items?.map((item) => (
        <div key={`${item.chainId}_${item.contractAddress}_${item.tokenId}`}>
          <div className="relative rounded-xl">
            <button
              onClick={() => onRemoveItem(item)}
              className="bg-brand-500 absolute right-2 top-2 rounded-full"
            >
              <XIcon className="h-6 w-6 rounded-full bg-white p-1 text-black" />
            </button>
            <SingleNFT nft={item as Nft} linkToDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSelection;
