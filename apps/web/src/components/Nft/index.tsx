import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridLayout } from '@hey/ui';
import { useParams } from 'react-router-dom';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import useOpenseaNft from '@/hooks/opensea/useOpenseaNft';
import { Leafwatch } from '@/lib/leafwatch';
import Custom500 from '@/pages/500';

import NftDetails from './Details';
import NftPageShimmer from './Shimmer';

const ViewNft = () => {
  const isReady = true;
  const { chain, address, token } = useParams();
  const {
    data: nft,
    loading,
    error
  } = useOpenseaNft({
    chain: parseInt(chain as string),
    address: address as string,
    token: token as string,
    enabled: isReady
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
            width={500}
            height={500}
            className="h-full w-full rounded-xl"
            src={nft?.image_url.replace('w=500', 'w=1500')}
            alt="nft"
            draggable={false}
          />
        </Card>
      </GridItemEight>
      <NftDetails nft={nft} />
    </GridLayout>
  );
};

export default ViewNft;
