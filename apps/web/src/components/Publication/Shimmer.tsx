import Footer from "@components/Shared/Footer";
import PublicationListShimmer from "@components/Shared/Shimmer/PublicationListShimmer";
import PublicationShimmer from "@components/Shared/Shimmer/PublicationShimmer";
import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import SingleProfileShimmer from "@components/Shared/Shimmer/SingleProfileShimmer";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import type { FC } from "react";

interface PublicationPageShimmerProps {
  publicationList?: boolean;
}

const PublicationPageShimmer: FC<PublicationPageShimmerProps> = ({
  publicationList = false
}) => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        {publicationList ? (
          <PublicationListShimmer />
        ) : (
          <>
            <Card>
              <PublicationShimmer />
            </Card>
            <PublicationsShimmer />
          </>
        )}
      </GridItemEight>
      <GridItemFour className="space-y-5">
        <Card className="p-5">
          <SingleProfileShimmer />
        </Card>
        <Card className="space-y-4 p-5">
          <SingleProfileShimmer showFollowUnfollowButton />
          <SingleProfileShimmer showFollowUnfollowButton />
          <SingleProfileShimmer showFollowUnfollowButton />
          <SingleProfileShimmer showFollowUnfollowButton />
          <SingleProfileShimmer showFollowUnfollowButton />
        </Card>
        <Card className="flex justify-between p-5">
          <div className="shimmer h-3 w-1/2 rounded-lg" />
          <div className="shimmer h-3 w-1/4 rounded-lg" />
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  );
};

export default PublicationPageShimmer;
