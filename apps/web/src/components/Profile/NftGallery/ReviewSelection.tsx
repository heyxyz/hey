import type { Nft } from '@hey/lens';
import type { NftGalleryItem } from 'src/store/non-persisted/useNftGalleryStore';

import SingleNft from '@components/Shared/SingleNft';
import { RectangleStackIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { EmptyState } from '@hey/ui';
import { useNftGalleryStore } from 'src/store/non-persisted/useNftGalleryStore';

const ReviewSelection = () => {
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  const onRemoveItem = (item: Nft) => {
    const id = `${item.contract.chainId}_${item.contract.address}_${item.tokenId}`;
    const index = gallery.items.findIndex((n) => n.itemId === id);

    const nft = {
      itemId: id,
      ...item
    };

    // remove selection from gallery items
    const alreadyExistsIndex = gallery.alreadySelectedItems.findIndex((i) => {
      return i.itemId === id;
    });
    let toRemove: NftGalleryItem[] = [];
    // if exists
    if (alreadyExistsIndex >= 0) {
      toRemove = [...gallery.toRemove, nft];
    }

    const nfts = [...gallery.items];
    nfts.splice(index, 1);

    const sanitizeRemoveDuplicates = toRemove?.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.itemId === value.itemId)
    );

    setGallery({
      ...gallery,
      items: nfts,
      name: gallery.name,
      toAdd: gallery.toAdd,
      toRemove: sanitizeRemoveDuplicates
    });
  };

  if (!gallery.items.length) {
    return (
      <div className="p-10">
        <EmptyState
          hideCard
          icon={<RectangleStackIcon className="text-brand-500 h-8 w-8" />}
          message="No collectables selected!"
        />
      </div>
    );
  }

  return (
    <div className="grid h-[68vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-3">
      {gallery.items?.map((item) => (
        <div
          key={`${item.contract.chainId}_${item.contract.address}_${item.tokenId}`}
        >
          <div className="relative rounded-xl">
            <button
              className="bg-brand-500 absolute right-2 top-2 rounded-full"
              onClick={() => onRemoveItem(item)}
            >
              <XMarkIcon className="h-6 w-6 rounded-full bg-white p-1 text-black" />
            </button>
            <SingleNft linkToDetail={false} nft={item as Nft} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSelection;
