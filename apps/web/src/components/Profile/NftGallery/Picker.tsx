import SingleNFT from '@components/NFT/SingleNFT';
import NftPickerShimmer from '@components/Shared/Shimmer/NftPickerShimmer';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { CheckIcon, CollectionIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import { t, Trans } from '@lingui/macro';
import clsx from 'clsx';
import { IS_MAINNET, SCROLL_THRESHOLD } from 'data/constants';
import type { Nft, NfTsRequest } from 'lens';
import { useNftFeedQuery } from 'lens';
import type { FC } from 'react';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import type { Item } from 'src/store/nft-gallery';
import { useNftGalleryStore } from 'src/store/nft-gallery';
import { mainnet } from 'wagmi/chains';

const Picker: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const gallery = useNftGalleryStore((state) => state.gallery);
  console.log('🚀 ~ file: Picker.tsx:25 ~ gallery', gallery);
  const setGallery = useNftGalleryStore((state) => state.setGallery);

  // Variables
  const request: NfTsRequest = {
    chainIds: IS_MAINNET ? [CHAIN_ID, mainnet.id] : [CHAIN_ID],
    ownerAddress: currentProfile?.ownedBy,
    limit: 12
  };

  const { data, loading, fetchMore, error } = useNftFeedQuery({
    variables: { request },
    skip: !currentProfile?.ownedBy
  });

  const nfts = data?.nfts?.items;
  const pageInfo = data?.nfts?.pageInfo;
  const hasMore = Boolean(pageInfo?.next);

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <NftPickerShimmer />;
  }

  if (nfts?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{formatHandle(currentProfile?.handle)}</span>
            <span>
              <Trans>doesn't have any NFTs!</Trans>
            </span>
          </div>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load nft feed`} error={error} />;
  }

  const onSelectItem = (item: Nft) => {
    const id = `${item.chainId}_${item.contractAddress}_${item.tokenId}`;
    const nft = {
      itemId: id,
      ...item
    };
    const index = gallery.items.findIndex((n) => n.itemId === id);
    if (index !== -1) {
      // remove selection from gallery items
      const alreadyExistsIndex = gallery.alreadySelectedItems.findIndex((i) => i.itemId === id);
      let toRemove: Item[] = [];
      // if exists
      if (alreadyExistsIndex >= 0) {
        toRemove = [...gallery.toRemove, nft];
      }

      const nfts = [...gallery.items];
      nfts.splice(index, 1);

      const sanitizeRemoveDuplicates = toRemove?.filter(
        (value, index, self) => index === self.findIndex((t) => t.itemId === value.itemId)
      );
      setGallery({
        ...gallery,
        name: gallery.name,
        items: nfts,
        toRemove: sanitizeRemoveDuplicates,
        toAdd: gallery.toAdd
      });
    } else {
      // add selection to gallery items
      const alreadyExistsIndex = gallery.alreadySelectedItems.findIndex((i) => i.itemId === id);
      let toAdd: Item[] = [];
      // if not exists
      if (alreadyExistsIndex < 0) {
        toAdd = [...gallery.toAdd, nft];
      }
      const sanitizeAddDuplicates = toAdd?.filter(
        (value, index, self) => index === self.findIndex((t) => t.itemId === value.itemId)
      );
      setGallery({
        ...gallery,
        name: gallery.name,
        items: [...gallery.items, nft],
        toAdd: sanitizeAddDuplicates,
        toRemove: gallery.toRemove
      });
    }
  };

  const selectedItems = gallery.items.map((n) => {
    return n.itemId;
  });

  return (
    <div className="m-4 space-y-4">
      <InfiniteScroll
        dataLength={nfts?.length ?? 0}
        scrollThreshold={SCROLL_THRESHOLD}
        scrollableTarget="scrollableNftGalleryDiv"
        hasMore={hasMore}
        next={loadMore}
        loader={<InfiniteLoader />}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {nfts?.map((nft, i) => {
            const id = `${nft.chainId}_${nft.contractAddress}_${nft.tokenId}`;
            const isSelected = selectedItems.includes(id);
            return (
              <div
                key={`${id}_${i}`}
                className={clsx(
                  'relative rounded-xl border-2',
                  isSelected ? 'border-brand-500' : 'border-transparent'
                )}
              >
                {isSelected && (
                  <button className="bg-brand-500 absolute right-2 top-2 rounded-full">
                    <CheckIcon className="h-5 w-5 p-1 text-white" />
                  </button>
                )}
                <button className="w-full text-left" onClick={() => onSelectItem(nft as Nft)}>
                  <SingleNFT nft={nft as Nft} linkToDetail={false} />
                </button>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Picker;
