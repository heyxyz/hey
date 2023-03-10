import SingleNft from '@components/Nfts/SingleNft';
import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { CollectionIcon } from '@heroicons/react/outline';
import formatHandle from '@lib/formatHandle';
import { t, Trans } from '@lingui/macro';
import { IS_MAINNET, SCROLL_THRESHOLD } from 'data/constants';
import type { Nft, NfTsRequest, Profile } from 'lens';
import { useNftFeedQuery } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CHAIN_ID } from 'src/constants';
import { mainnet } from 'wagmi/chains';

let hasMore = true;

interface NftFeedProps {
  profile: Profile;
}

const NftFeed: FC<NftFeedProps> = ({ profile }) => {
  // Variables
  const request: NfTsRequest = {
    chainIds: IS_MAINNET ? [CHAIN_ID, mainnet.id] : [CHAIN_ID],
    ownerAddress: profile?.ownedBy,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useNftFeedQuery({
    variables: { request },
    skip: !profile?.ownedBy
  });

  const nfts = data?.nfts?.items;
  const pageInfo = data?.nfts?.pageInfo;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    }).then(({ data }) => {
      hasMore = data?.nfts?.items?.length > 0;
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
            <span className="mr-1 font-bold">@{formatHandle(profile?.handle)}</span>
            <span>
              <Trans>doesn’t have any NFTs!</Trans>
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
            <SingleNft nft={nft as Nft} />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default NftFeed;
