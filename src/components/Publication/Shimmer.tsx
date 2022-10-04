import Footer from '@components/Shared/Footer';
import PublicationShimmer from '@components/Shared/Shimmer/PublicationShimmer';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { FC } from 'react';

const PublicationPageShimmer: FC = () => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        <Card>
          <PublicationShimmer />
        </Card>
        <PublicationsShimmer />
      </GridItemEight>
      <GridItemFour className="space-y-5">
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
          <div className="w-1/2 h-3 rounded-lg shimmer" />
          <div className="w-1/4 h-3 rounded-lg shimmer" />
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default PublicationPageShimmer;
