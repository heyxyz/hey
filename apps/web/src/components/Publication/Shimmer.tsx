import Footer from '@components/Shared/Footer';
import PublicationShimmer from '@components/Shared/Shimmer/PublicationShimmer';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { Card, GridItemSix, GridItemThree, GridLayout } from '@lenster/ui';
import type { FC } from 'react';

const PublicationPageShimmer: FC = () => {
  return (
    <GridLayout>
      <GridItemSix className="space-y-5">
        <Card>
          <PublicationShimmer />
        </Card>
        <PublicationsShimmer />
      </GridItemSix>
      <GridItemThree className="space-y-5">
        <Card className="p-5">
          <UserProfileShimmer />
        </Card>
        <Card className="space-y-4 p-5">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </Card>
        <Card className="flex justify-between p-5">
          <div className="shimmer h-3 w-1/2 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </Card>
        <Footer />
      </GridItemThree>
    </GridLayout>
  );
};

export default PublicationPageShimmer;
