import SingleNft from '@components/Nft/SingleNft';
import { CollectionIcon, XIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { Nft } from 'lens';
import type { NftGalleryItem } from 'src/store/nft-gallery';
import { useNftGalleryStore } from 'src/store/nft-gallery';
import { EmptyState } from 'ui';

const ReviewSelection = () => {
  const gallery = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  const onRemoveItem = (item: Nft) => {
    const id = `${item.chainId}_${item.contractAddress}_${item.tokenId}`;
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
      name: gallery.name,
      items: nfts,
      toRemove: sanitizeRemoveDuplicates,
      toAdd: gallery.toAdd
    });
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
            <SingleNft nft={item as Nft} linkToDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSelection;
