import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { Card, GridItemEight, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import useOpenseaNft from '@hooks/opensea/useOpenseaNft';
import Custom500 from '@pages/500';
import { useEffectOnce } from 'usehooks-ts';
import NftDetails from './Details';
import NftPageShimmer from './Shimmer';
import { useSearchParams } from 'react-router-dom';

const ViewNft = () => {
  const isReady = true;
  const [searchParams, _] = useSearchParams();
  const {
    data: nft,
    loading,
    error
  } = useOpenseaNft({
    chain: parseInt(searchParams.get('chain') as string),
    address: searchParams.get('address') as string,
    token: searchParams.get('token') as string,
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
