import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { CollectionIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import type { Nft, Profile } from 'lens';
import { useNftFeedQuery } from 'lens';
import type { FC } from 'react';
import React from 'react';
import { CHAIN_ID } from 'src/constants';
import { mainnet } from 'wagmi/chains';

import Gallery from './Gallery';

interface Props {
  profile: Profile;
}

const NFTGallery: FC<Props> = ({ profile }) => {
  // Variables
  const request = {
    chainIds: [CHAIN_ID, mainnet.id],
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
        icon={<CollectionIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load nft feed" error={error} />;
  }

  return <Gallery nfts={nfts as Nft[]} />;
};

export default NFTGallery;
