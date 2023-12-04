import type { Nft, NftGallery } from '@hey/lens';
import type { FC } from 'react';
import type { NftGalleryItem } from 'src/store/non-persisted/useNftGalleryStore';

import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import {
  ArrowsPointingOutIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Errors } from '@hey/data/errors';
import {
  NftGalleriesDocument,
  useDeleteNftGalleryMutation,
  useNftGalleriesLazyQuery,
  useUpdateNftGalleryOrderMutation
} from '@hey/lens';
import { useApolloClient } from '@hey/lens/apollo';
import { Button } from '@hey/ui';
import cn from '@hey/ui/cn';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  GALLERY_DEFAULTS,
  useNftGalleryStore
} from 'src/store/non-persisted/useNftGalleryStore';
import useProfileStore from 'src/store/persisted/useProfileStore';

import Create from './Create';
import NftCard from './NftCard';
import ReArrange from './ReArrange';

interface GalleryProps {
  galleries: NftGallery[];
}

const Gallery: FC<GalleryProps> = ({ galleries }) => {
  const [isRearrange, setIsRearrange] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const galleryStore = useNftGalleryStore((state) => state.gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  const { cache } = useApolloClient();
  const gallery = galleries[0];
  const nfts = gallery.items;

  const [fetchNftGalleries] = useNftGalleriesLazyQuery();
  const [orderGallery] = useUpdateNftGalleryOrderMutation();
  const [deleteNftGallery] = useDeleteNftGalleryMutation({
    onCompleted: () => {
      toast.success('Gallery deleted');
      setGallery(GALLERY_DEFAULTS);
    }
  });

  const onDelete = () => {
    try {
      if (confirm('Are you sure you want to delete?')) {
        const normalizedId = cache.identify({
          __typename: 'NftGallery',
          id: gallery.id
        });
        cache.evict({ id: normalizedId });
        cache.gc();
        deleteNftGallery({
          variables: { request: { galleryId: gallery.id } }
        });
      }
    } catch (error: any) {
      toast.error(error?.messaage ?? Errors.SomethingWentWrong);
    }
  };

  const setItemsToGallery = (items: NftGalleryItem[]) => {
    setGallery({
      ...gallery,
      alreadySelectedItems: items,
      isEdit: true,
      items,
      reArrangedItems: [],
      toAdd: [],
      toRemove: []
    });
  };

  const onClickRearrange = () => {
    const items = nfts.map((nft) => {
      return {
        ...nft,
        itemId: `${nft.contract.chainId}_${nft.contract.address}_${nft.tokenId}`
      };
    });
    setIsRearrange(true);
    setItemsToGallery(items);
  };

  const onClickEditGallery = () => {
    setShowCreateModal(true);
    const items = nfts.map((nft) => {
      return {
        ...nft,
        itemId: `${nft.contract.chainId}_${nft.contract.address}_${nft.tokenId}`
      };
    });
    setItemsToGallery(items);
  };

  const onSaveRearrange = async () => {
    try {
      const updates = galleryStore.reArrangedItems?.map(
        ({ contract, newOrder, tokenId }, i) => {
          return { contract, newOrder: newOrder ?? i, tokenId };
        }
      );

      await orderGallery({
        variables: {
          request: { galleryId: galleryStore.id, updates }
        }
      });

      const { data } = await fetchNftGalleries({
        variables: { request: { for: currentProfile?.id } }
      });

      cache.modify({
        fields: {
          nftGalleries: () => {
            cache.updateQuery({ query: NftGalleriesDocument }, () => ({
              data: data?.nftGalleries
            }));
          }
        }
      });
      setIsRearrange(false);
    } catch (error: any) {
      toast.error(error?.messaage ?? Errors.SomethingWentWrong);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h6 className="line-clamp-1 text-lg font-medium">
          {isRearrange ? 'Arrange gallery' : gallery.name}
        </h6>
        {galleryStore?.isEdit ? (
          <Create
            setShowModal={setShowCreateModal}
            showModal={showCreateModal}
          />
        ) : null}
        {isRearrange ? (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setIsRearrange(false)}
              size="sm"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={onSaveRearrange} size="sm">
              Save
            </Button>
          </div>
        ) : currentProfile && currentProfile?.id === gallery.owner ? (
          <Menu as="div" className="relative">
            <Menu.Button className="rounded-md p-1 hover:bg-gray-300/20">
              <EllipsisVerticalIcon className="h-4 w-4" />
            </Menu.Button>
            <MenuTransition>
              <Menu.Items
                className="absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700/80 dark:bg-gray-900"
                static
              >
                <Menu.Item
                  as="div"
                  className={({ active }) =>
                    cn(
                      { 'dropdown-active': active },
                      'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
                    )
                  }
                  onClick={onClickEditGallery}
                >
                  <div className="flex items-center space-x-2">
                    <PencilSquareIcon className="h-4 w-4" />
                    <div>Edit</div>
                  </div>
                </Menu.Item>
                <Menu.Item
                  as="div"
                  className={({ active }) =>
                    cn(
                      { 'dropdown-active': active },
                      'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
                    )
                  }
                  onClick={onClickRearrange}
                >
                  <div className="flex items-center space-x-2">
                    <ArrowsPointingOutIcon className="h-4 w-4" />
                    <div>Rearrrange</div>
                  </div>
                </Menu.Item>
                <Menu.Item
                  as="div"
                  className={({ active }) =>
                    cn(
                      { 'dropdown-active': active },
                      'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm'
                    )
                  }
                  onClick={onDelete}
                >
                  <div className="flex items-center space-x-2">
                    <TrashIcon className="h-4 w-4" />
                    <div>Delete</div>
                  </div>
                </Menu.Item>
              </Menu.Items>
            </MenuTransition>
          </Menu>
        ) : null}
      </div>
      {isRearrange ? (
        <ReArrange />
      ) : (
        <div className="grid gap-5 md:grid-cols-3">
          {nfts?.map((nft) => (
            <div
              className="break-inside flex w-full items-center overflow-hidden text-white"
              key={`${nft?.contract.address}_${nft?.contract.chainId}_${nft?.tokenId}`}
            >
              <NftCard linkToDetail nft={nft as Nft} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Gallery;
