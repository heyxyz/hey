import type { Profile } from '@hey/lens';
import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import NewPost from '@components/Composer/Post/New';
import {
  APP_NAME,
  HANDLE_PREFIX,
  IS_MAINNET,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { useProfileQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import { ProfileFeedType } from 'src/enums';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import Achievements from './Achievements';
import Cover from './Cover';
import Details from './Details';
import Feed from './Feed';
import FeedType from './FeedType';
import ProfilePageShimmer from './Shimmer';

const ViewProfile: NextPage = () => {
  const {
    isReady,
    query: { handle, id, type }
  } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'profile' });
  });

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

  const { data, error, loading } = useProfileQuery({
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

  if (!isReady || loading) {
    return <ProfilePageShimmer />;
  }

  if (!data?.profile) {
    return <Custom404 />;
  }

  if (error) {
    return <Custom500 />;
  }

  return (
    <>
      <MetaTags
        title={`${getProfile(profile).displayName} (${
          getProfile(profile).slugWithPrefix
        }) • ${APP_NAME}`}
      />
      <Cover
        cover={
          profile?.metadata?.coverPicture?.optimized?.uri ||
          `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <GridLayout className="pt-6">
        <GridItemFour>
          <Details profile={profile as Profile} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <FeedType feedType={feedType} />
          {currentProfile?.id === profile?.id ? <NewPost /> : null}
          {feedType === ProfileFeedType.Feed ||
          feedType === ProfileFeedType.Replies ||
          feedType === ProfileFeedType.Media ||
          feedType === ProfileFeedType.Collects ? (
            <Feed profile={profile as Profile} type={feedType} />
          ) : null}
          {feedType === ProfileFeedType.Stats && IS_MAINNET ? (
            <Achievements profile={profile as Profile} />
          ) : null}
        </GridItemEight>
      </GridLayout>
    </>
  );
};

export default ViewProfile;
