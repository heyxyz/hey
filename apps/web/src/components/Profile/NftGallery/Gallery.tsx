import { Button } from '@components/UI/Button';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { Nft, NftGallery, Profile } from 'lens';
import type { FC } from 'react';
import React, { Fragment, useState } from 'react';

import NftCard from './NftCard';
import ReArrange from './ReArrange';

interface Props {
  profile: Profile;
  galleries: NftGallery[];
}

const Gallery: FC<Props> = ({ profile, galleries }) => {
  const [isRearrange, setIsRearrange] = useState(false);

  const nfts = galleries[0].items;

  return (
    <>
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
      {isRearrange ? (
        <ReArrange nfts={nfts as Nft[]} />
      ) : (
        <div className="grid gap-5 py-5 md:grid-cols-3">
          {nfts?.map((nft) => (
            <div
              key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}
              className="break-inside flex w-full items-center overflow-hidden text-white"
            >
              <NftCard nft={nft as Nft} linkToDetail={true} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Gallery;
