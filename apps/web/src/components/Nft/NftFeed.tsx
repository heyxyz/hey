import SingleNft from '@components/Nft/SingleNft';
import NftsShimmer from '@components/Shared/Shimmer/NftsShimmer';
import { ErrorMessage } from 'ui';
import { CollectionIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import { IS_MAINNET } from 'data/constants';
import type { Nft, NfTsRequest, Profile } from 'lens';
import { useNftFeedQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { CHAIN_ID } from 'src/constants';
import { EmptyState } from 'ui';
import formatHandle from 'utils/formatHandle';
import { mainnet } from 'wagmi/chains';

interface NftFeedProps {
  profile: Profile;
}

const NftFeed: FC<NftFeedProps> = ({ profile }) => {
  const [hasMore, setHasMore] = useState(true);

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

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      }).then(({ data }) => {
        setHasMore(data?.nfts?.items?.length > 0);
      });
    }
  });

  if (loading) {
    return <NftsShimmer />;
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {nfts?.map((nft) => (
        <div key={`${nft?.chainId}_${nft?.contractAddress}_${nft?.tokenId}`}>
          <SingleNft nft={nft as Nft} />
        </div>
      ))}
      {hasMore && <span ref={observe} />}
    </div>
  );
};

export default NftFeed;
