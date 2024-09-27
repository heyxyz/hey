import MetaTags from "@components/Common/MetaTags";
import NewPost from "@components/Composer/NewPost";
import Cover from "@components/Shared/Cover";
import { Leafwatch } from "@helpers/leafwatch";
import profileThemeFonts from "@helpers/profileThemeFonts";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  APP_NAME,
  HANDLE_PREFIX,
  STATIC_IMAGES_URL
} from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PAGEVIEW } from "@hey/data/tracking";
import getProfileDetails from "@hey/helpers/api/getProfileDetails";
import getProfile from "@hey/helpers/getProfile";
import type { Profile } from "@hey/lens";
import { useProfileQuery } from "@hey/lens";
import { EmptyState, GridItemEight, GridItemFour, GridLayout } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import { useFlag } from "@unleash/proxy-client-react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ProfileFeedType } from "src/enums";
import Custom404 from "src/pages/404";
import Custom500 from "src/pages/500";
import { useProfileThemeStore } from "src/store/non-persisted/useProfileThemeStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import Details from "./Details";
import Feed from "./Feed";
import FeedType from "./FeedType";
import ProfilePageShimmer from "./Shimmer";
import Stats from "./Stats";
import SuspendedDetails from "./SuspendedDetails";

const ViewProfile: NextPage = () => {
  const {
    isReady,
    pathname,
    query: { handle, id, source, type }
  } = useRouter();
  const { currentProfile } = useProfileStore();
  const { theme, setTheme } = useProfileThemeStore();
  const isStaff = useFlag(FeatureFlag.Staff);

  useEffect(() => {
    if (isReady) {
      Leafwatch.track(PAGEVIEW, {
        page: "profile",
        subpage: pathname
          .replace("/u/[handle]", "")
          .replace("/profile/[id]", ""),
        ...(source ? { source } : {})
      });
    }
  }, [handle, id]);

  const lowerCaseProfileFeedType = [
    ProfileFeedType.Feed.toLowerCase(),
    ProfileFeedType.Replies.toLowerCase(),
    ProfileFeedType.Media.toLowerCase(),
    ProfileFeedType.Collects.toLowerCase(),
    ProfileFeedType.Stats.toLowerCase()
  ];

  const feedType = type
    ? lowerCaseProfileFeedType.includes(type as string)
      ? type.toString().toUpperCase()
      : ProfileFeedType.Feed
    : ProfileFeedType.Feed;

  const {
    data,
    error,
    loading: profileLoading
  } = useProfileQuery({
    skip: id ? !id : !handle,
    variables: {
      request: {
        ...(id
          ? { forProfileId: id }
          : { forHandle: `${HANDLE_PREFIX}${handle}` })
      }
    }
  });

  const profile = data?.profile as Profile;

  const { data: profileDetails, isLoading: profileDetailsLoading } = useQuery({
    enabled: Boolean(profile?.id),
    queryFn: () => getProfileDetails(profile?.id),
    queryKey: ["getProfileDetails", profile?.id]
  });

  useEffect(() => {
    setTheme(profileDetails?.theme || null);
  }, [profileDetails?.theme]);

  if (!isReady || profileLoading) {
    return <ProfilePageShimmer />;
  }

  if (!data?.profile) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  const isSuspended = isStaff ? false : profileDetails?.isSuspended;

  return (
    <>
      <MetaTags
        creator={getProfile(profile).displayName}
        description={profile.metadata?.bio}
        title={`${getProfile(profile).displayName} (${
          getProfile(profile).slugWithPrefix
        }) • ${APP_NAME}`}
      />
      <Cover
        cover={
          isSuspended
            ? `${STATIC_IMAGES_URL}/patterns/2.svg`
            : profile?.metadata?.coverPicture?.optimized?.uri ||
              `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout>
        <GridItemFour className={profileThemeFonts(theme?.overviewFontStyle)}>
          {isSuspended ? (
            <SuspendedDetails profile={profile as Profile} />
          ) : (
            <Details
              isSuspended={profileDetails?.isSuspended || false}
              profile={profile as Profile}
            />
          )}
        </GridItemFour>
        <GridItemEight className="space-y-5">
          {isSuspended ? (
            <EmptyState
              icon={<NoSymbolIcon className="size-8" />}
              message="Profile Suspended"
            />
          ) : (
            <>
              <FeedType feedType={feedType as ProfileFeedType} />
              {currentProfile?.id === profile?.id ? <NewPost /> : null}
              {feedType === ProfileFeedType.Feed ||
              feedType === ProfileFeedType.Replies ||
              feedType === ProfileFeedType.Media ||
              feedType === ProfileFeedType.Collects ? (
                <Feed
                  handle={getProfile(profile).slugWithPrefix}
                  profileDetailsLoading={profileDetailsLoading}
                  profileId={profile.id}
                  type={feedType}
                />
              ) : feedType === ProfileFeedType.Stats ? (
                <Stats profileId={profile.id} />
              ) : null}
            </>
          )}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
