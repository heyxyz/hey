import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer';
import { Button } from '@components/UI/Button';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Menu, Transition } from '@headlessui/react';
import { CollectionIcon, DotsVerticalIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import clsx from 'clsx';
import { IS_MAINNET } from 'data/constants';
import type { Nft, Profile } from 'lens';
import { useNftFeedQuery } from 'lens';
import type { FC } from 'react';
import React, { Fragment, useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { mainnet } from 'wagmi';

import Gallery from './Gallery';
import NoGallery from './NoGallery';
import ReArrange from './ReArrange';

interface Props {
  profile: Profile;
}

const NftGallery: FC<Props> = ({ profile }) => {
  const [isRearrange, setIsRearrange] = useState(false);

  // Variables
  const request = {
    chainIds: IS_MAINNET ? [CHAIN_ID, mainnet.id] : [CHAIN_ID],
    ownerAddress: profile?.ownedBy,
    limit: 50
  };

  const { data, loading, error } = useNftFeedQuery({
    variables: { request },
    skip: !profile?.ownedBy
  });

  const nfts = data?.nfts?.items;

  if (loading) {
    return <NFTSShimmer />;
  }

  if (nfts?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
            <span>doesn’t have any NFTs!</span>
          </div>
        }
        icon={<CollectionIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load nft feed" error={error} />;
  }

  return (
    <div className="space-y-4">
      <NoGallery profile={profile} />
      <div className="flex items-center justify-between">
        <h6 className="mx-2 text-lg font-medium">
          {isRearrange ? 'Arrange gallery' : `${profile.name}'s gallery`}
        </h6>
        {isRearrange ? (
          <div className="flex items-center space-x-2">
            <Button onClick={() => setIsRearrange(false)} size="sm" variant="secondary">
              Cancel
            </Button>
            <Button onClick={() => setIsRearrange(false)} size="sm">
              Save
            </Button>
          </div>
        ) : (
          <Menu as="div" className="relative">
            <Menu.Button className="rounded-md p-1 hover:bg-gray-300 hover:bg-opacity-20">
              <DotsVerticalIcon className="h-4 w-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 z-[5] mt-1 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700/80 dark:bg-gray-900"
              >
                <Menu.Item
                  as="label"
                  className={({ active }) =>
                    clsx(
                      { 'dropdown-active': active },
                      'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
                    )
                  }
                >
                  Rename
                </Menu.Item>
                <Menu.Item
                  as="label"
                  className={({ active }) =>
                    clsx(
                      { 'dropdown-active': active },
                      'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
                    )
                  }
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  as="label"
                  onClick={() => setIsRearrange(true)}
                  className={({ active }) =>
                    clsx(
                      { 'dropdown-active': active },
                      'menu-item flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
                    )
                  }
                >
                  Rearrrange
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        )}
      </div>
      {isRearrange ? <ReArrange nfts={nfts as Nft[]} /> : <Gallery nfts={nfts as Nft[]} />}
    </div>
  );
};

export default NftGallery;
