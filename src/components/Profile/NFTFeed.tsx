import { gql, useQuery } from '@apollo/client';
import SingleNFT from '@components/NFT/SingleNFT';
import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { Nft, Profile } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { CHAIN_ID, IS_MAINNET, PAGINATION_ROOT_MARGIN } from 'src/constants';
import { PAGINATION } from 'src/tracking';
import { chain } from 'wagmi';

const PROFILE_NFT_FEED_QUERY = gql`
  query ProfileNFTFeed($request: NFTsRequest!) {
    nfts(request: $request) {
      items {
        name
        collectionName
        contractAddress
        tokenId
        chainId
        originalContent {
          uri
          animatedUrl
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
`;

interface Props {
  profile: Profile;
}

const NFTFeed: FC<Props> = ({ profile }) => {
  // Variables
  const request = {
    chainIds: [CHAIN_ID, IS_MAINNET ? chain.mainnet.id : chain.kovan.id],
    ownerAddress: profile?.ownedBy,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useQuery(PROFILE_NFT_FEED_QUERY, {
    variables: { request },
    skip: !profile?.ownedBy
  });

  const pageInfo = data?.nfts?.pageInfo;
  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
      Mixpanel.track(PAGINATION.NFT_FEED);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  return (
    <>
      {loading && <NFTSShimmer />}
      {data?.nfts?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              <span className="mr-1 font-bold">@{profile?.handle}</span>
              <span>doesn’t have any NFTs!</span>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load nft feed" error={error} />
      {!error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {data?.nfts?.items?.map((nft: Nft) => (
              <SingleNFT key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`} nft={nft} />
            ))}
          </div>
          {pageInfo?.next && data?.nfts?.items?.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default NFTFeed;
