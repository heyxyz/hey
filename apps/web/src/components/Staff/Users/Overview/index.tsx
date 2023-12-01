import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import ProfileStaffTool from '@components/Staff/Users/Overview/Tool';
import { UserIcon } from '@heroicons/react/24/outline';
import { APP_NAME, HANDLE_PREFIX } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { useProfileQuery } from '@hey/lens';
import {
  Card,
  EmptyState,
  ErrorMessage,
  GridItemEight,
  GridItemFour,
  GridLayout
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Custom404 from 'src/pages/404';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import StaffSidebar from '../../Sidebar';

const Overview: NextPage = () => {
  const {
    query: { handle, id },
    isReady
  } = useRouter();
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, {
      page: 'staff-tools',
      subpage: 'user-overview'
    });
  });

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: {
        ...(id
          ? { forProfileId: id }
          : { forHandle: `${HANDLE_PREFIX}${handle}` })
      }
    },
    skip: id ? !id : !handle || !isReady
  });
  const profile = data?.profile as Profile;

  if (!currentProfile || !staffMode) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Staff Tools • User Overview • ${APP_NAME}`} />
      <GridItemFour>
        <StaffSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Card className="border-yellow-400 !bg-yellow-300/20 p-5">
          {loading ? (
            <Loader message="Loading profile" />
          ) : !profile ? (
            <EmptyState
              message="No profile found"
              hideCard
              icon={<UserIcon className="text-brand-500 h-8 w-8" />}
            />
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <ProfileStaffTool profile={profile} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Overview;
