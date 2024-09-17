import type { FC } from "react";

import Footer from "@components/Shared/Footer";
import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import PublicationListShimmer from "@components/Shared/Shimmer/PublicationListShimmer";
import PublicationShimmer from "@components/Shared/Shimmer/PublicationShimmer";
import PublicationsShimmer from "@components/Shared/Shimmer/PublicationsShimmer";
import UserProfileShimmer from "@components/Shared/Shimmer/UserProfileShimmer";
import { Card, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";

interface PublicationPageShimmerProps {
  profileList?: boolean;
  publicationList?: boolean;
}

const PublicationPageShimmer: FC<PublicationPageShimmerProps> = ({
  profileList = false,
  publicationList = false
}) => {
  return (
    <GridLayout>
      <GridItemEight className="space-y-5">
        {profileList ? (
          <ProfileListShimmer />
        ) : publicationList ? (
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
          <UserProfileShimmer />
        </Card>
        <Card className="space-y-4 p-5">
          <UserProfileShimmer showFollowUnfollowButton />
          <UserProfileShimmer showFollowUnfollowButton />
          <UserProfileShimmer showFollowUnfollowButton />
          <UserProfileShimmer showFollowUnfollowButton />
          <UserProfileShimmer showFollowUnfollowButton />
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
