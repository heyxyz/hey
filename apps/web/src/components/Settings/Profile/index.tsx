import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@lenster/data/constants';
import { PAGEVIEW } from '@lenster/data/tracking';
import { useProfileQuery } from '@lenster/lens';
import {
  GridItemEight,
  GridItemFour,
  GridLayout,
  PageLoading
} from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import ProfileSettingsForm from './Profile';

const ProfileSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'profile' });
  });

  const { data, loading, error } = useProfileQuery({
    variables: { request: { forProfileId: currentProfile?.id } },
    skip: !currentProfile?.id
  });

  if (error) {
    return <Custom500 />;
  }

  if (loading) {
    return <PageLoading message={t`Loading settings`} />;
  }

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  const profile = data?.profile;

  return (
    <GridLayout>
      <MetaTags title={t`Profile settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <ProfileSettingsForm profile={profile as any} />
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileSettings;
