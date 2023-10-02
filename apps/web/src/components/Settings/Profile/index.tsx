import MetaTags from '@components/Common/MetaTags';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { CubeIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import { useProfileSettingsQuery } from '@hey/lens';
import {
  Card,
  GridItemEight,
  GridItemFour,
  GridLayout,
  PageLoading,
  TabButton
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import NftPicture from './NftPicture';
import Picture from './Picture';
import ProfileSettingsForm from './Profile';

const ProfileSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [settingsType, setSettingsType] = useState<'NFT' | 'AVATAR'>('AVATAR');

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'profile' });
  });

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
    onCompleted: ({ profile }) => {
      const picture = profile?.picture;
      setSettingsType(picture?.hasOwnProperty('uri') ? 'NFT' : 'AVATAR');
    }
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
        <Card className="space-y-5 p-5">
          <div className="flex items-center space-x-2">
            <TabButton
              name="Upload avatar"
              icon={<PhotoIcon className="h-5 w-5" />}
              active={settingsType === 'AVATAR'}
              onClick={() => setSettingsType('AVATAR')}
            />
            <TabButton
              name="NFT avatar"
              icon={<CubeIcon className="h-5 w-5" />}
              active={settingsType === 'NFT'}
              onClick={() => setSettingsType('NFT')}
            />
          </div>
          {settingsType === 'NFT' ? (
            <NftPicture profile={profile as any} />
          ) : (
            <Picture profile={profile as any} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileSettings;
