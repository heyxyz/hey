import MetaTags from '@components/Common/MetaTags';
import Slug from '@components/Shared/Slug';
import UserProfile from '@components/Shared/UserProfile';
import { APP_NAME } from '@lenster/data/constants';
import { FeatureFlag } from '@lenster/data/feature-flags';
import { PAGEVIEW } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import isFeatureEnabled from '@lenster/lib/isFeatureEnabled';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useNftMetadata from 'src/hooks/useNftMetadata';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

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
      <GridItemFour className="space-y-4">
        <Card className="p-4">
          <h1>{nft?.name}</h1>
          <Slug className="text-xs" slug="Subscapes" />
        </Card>
        {nft?.description ? (
          <Card className="max-h-60 overflow-y-auto p-4">
            <h1 className="mb-2">Description</h1>
            <p className="text-sm opacity-60">{nft.description}</p>
          </Card>
        ) : null}
        <Card className="p-4">
          <h1 className="mb-2">Owner</h1>
          <UserProfile profile={currentProfile as Profile} showUserPreview />
        </Card>
        <Card className="divide-y p-4 dark:divide-gray-700">
          <div className="py-3">
            <div className="text-sm opacity-50">Contract address</div>
            <div className="truncate">{nft.contract}</div>
          </div>
          <div className="pt-3">
            <div className="text-sm opacity-50">Token ID</div>
            <div className="truncate">{nft.identifier}</div>
          </div>
        </Card>
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewNft;
