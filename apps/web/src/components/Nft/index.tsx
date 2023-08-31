import MetaTags from '@components/Common/MetaTags';
import { APP_NAME } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { PAGEVIEW } from '@lenster/data/tracking';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { Card, GridItemEight, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useNftMetadata from 'src/hooks/opensea/useNftMetadata';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import NftDetails from './Details';

const ViewNft: NextPage = () => {
  const {
    query: { chain, address, token },
    isReady
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isNftDetailEnabled = isFeatureEnabled(FeatureFlag.NftDetail);
  const {
    data: nft,
    loading,
    error
  } = useNftMetadata({
    chain: parseInt(chain as string),
    address: address as string,
    token: token as string,
    enabled: isReady
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'nft' });
  });

  if (loading) {
    return null;
  }

  if (!isNftDetailEnabled || !currentProfile) {
    return <Custom404 />;
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
            src={nft?.image_url}
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
