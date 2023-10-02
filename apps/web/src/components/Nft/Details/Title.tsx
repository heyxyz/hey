import Slug from '@components/Shared/Slug';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import type { OpenSeaNft } from '@hey/types/opensea-nft';
import { Card } from '@hey/ui';
import type { FC } from 'react';
import useOpenseaCollection from 'src/hooks/opensea/useOpenseaCollection';

interface NftTitleProps {
  nft: OpenSeaNft;
}

const NftTitle: FC<NftTitleProps> = ({ nft }) => {
  const { data: collection, loading } = useOpenseaCollection({
    slug: nft.collection,
    enabled: Boolean(nft.collection)
  });

  return (
    <Card className="p-5">
      <h1 className="font-bold">{nft?.name}</h1>
      {loading ? (
        <div className="shimmer mt-2 h-3 w-48 rounded-lg" />
      ) : (
        <div>
          <Slug className="text-sm" slug={collection.name} />
          {collection.safelist_request_status === 'verified' ? (
            <CheckCircleIcon className="text-brand ml-1 inline-block h-4 w-4" />
          ) : null}
        </div>
      )}
    </Card>
  );
};

export default NftTitle;
