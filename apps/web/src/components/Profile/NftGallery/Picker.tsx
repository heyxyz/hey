import SingleNFT from '@components/NFT/SingleNFT';
import { Input } from '@components/UI/Input';
import { Tab } from '@headlessui/react';
import { CheckIcon, SearchIcon, XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import type { Nft } from 'lens';
import { useNftFeedQuery } from 'lens';
import type { ChangeEvent, FC } from 'react';
import React, { useState } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { mainnet } from 'wagmi/chains';

const tabs = [{ name: 'Recent' }, { name: 'Floor price' }, { name: 'A-Z' }];

const Picker: FC = () => {
  const [searchText, setSearchText] = useState('');
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data } = useNftFeedQuery({
    variables: {
      request: { chainIds: [CHAIN_ID, mainnet.id], ownerAddress: currentProfile?.ownedBy, limit: 50 }
    },
    skip: !currentProfile?.ownedBy
  });

  const nfts = data?.nfts?.items;

  const handleSearch = (evt: ChangeEvent<HTMLInputElement>) => {
    const keyword = evt.target.value;
    setSearchText(keyword);
  };

  return (
    <div className="m-5 space-y-4">
      <Input
        type="text"
        className="py-2 px-3 text-sm"
        placeholder="Search"
        value={searchText}
        iconLeft={<SearchIcon />}
        iconRight={
          <XIcon
            className={clsx('cursor-pointer', searchText ? 'visible' : 'invisible')}
            onClick={() => {
              setSearchText('');
            }}
          />
        }
        onChange={handleSearch}
      />
      <Tab.Group>
        <Tab.List className="space-x-2">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className={clsx(
                'Recent' === tab.name ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand',
                'bg-brand-100 border-brand-300 dark:border-brand-500 rounded-full border px-3 py-1.5 text-xs dark:bg-opacity-20 sm:px-4'
              )}
            >
              <span className="flex items-center space-x-2">
                <span className="hidden sm:block">{tab.name}</span>
              </span>
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {nfts?.map((nft) => (
          <div key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}>
            <div className="border-brand-500 relative rounded-xl border-2">
              <button className="bg-brand-500 absolute right-2 top-2 rounded-full">
                <CheckIcon className="h-5 w-5 p-1 text-white" />
              </button>
              <SingleNFT nft={nft as Nft} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Picker;
