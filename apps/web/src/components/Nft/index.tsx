import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import useOpenseaNft from 'src/hooks/opensea/useOpenseaNft';
import Custom500 from 'src/pages/500';
import { useEffectOnce } from 'usehooks-ts';

import NftDetails from './Details';
import NftPageShimmer from './Shimmer';

const ViewNft: NextPage = () => {
  const {
    isReady,
    query: { address, chain, token }
  } = useRouter();
  const {
    data: nft,
    error,
    loading
  } = useOpenseaNft({
    address: address as string,
    chain: parseInt(chain as string),
    enabled: isReady,
    token: token as string
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'nft' });
  });

  if (loading) {
    return <NftPageShimmer />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <GridLayout className="pt-6">
      <MetaTags title={`${nft.name} • ${APP_NAME}`} />
      <GridItemEight className="space-y-5">
        <Card>
          <img
            alt="nft"
            className="h-full w-full rounded-xl"
            draggable={false}
            height={500}
            src={nft?.image_url.replace('w=500', 'w=1500')}
            width={500}
          />
        </Card>
      </GridItemEight>
      <NftDetails nft={nft} />
    </GridLayout>
  );
};

export default ViewNft;
