import { useQuery } from '@apollo/client';
import SingleNFT from '@components/NFT/SingleNFT';
import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import type { Nft, Profile } from '@generated/types';
import { NftFeedDocument } from '@generated/types';
import { CollectionIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CHAIN_ID, SCROLL_THRESHOLD } from 'src/constants';
import { chain } from 'wagmi';

interface Props {
  profile: Profile;
}

const NFTFeed: FC<Props> = ({ profile }) => {
  // Variables
  const request = {
    chainIds: [CHAIN_ID, chain.mainnet.id],
    ownerAddress: profile?.ownedBy,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useQuery(NftFeedDocument, {
    variables: { request },
    skip: !profile?.ownedBy
  });

  const nfts = data?.nfts?.items;
  const pageInfo = data?.nfts?.pageInfo;
  const hasMore = pageInfo?.next && nfts?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <NFTSShimmer />;
  }

  if (nfts?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile?.handle}</span>
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

  return (
    <InfiniteScroll
      dataLength={nfts?.length ?? 0}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<InfiniteLoader />}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {nfts?.map((nft) => (
          <div key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}>
            <SingleNFT nft={nft as Nft} />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default NFTFeed;
