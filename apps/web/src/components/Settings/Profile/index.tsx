import MetaTags from '@components/Common/MetaTags';
import { PageLoading } from '@components/UI/PageLoading';
import { PhotographIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { APP_NAME } from 'data/constants';
import { useProfileSettingsQuery } from 'lens';
import type { NextPage } from 'next';
import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';

import SettingsSidebar from '../Sidebar';
import NftPicture from './NftPicture';
import Picture from './Picture';
import ProfileSettingsForm from './Profile';

const ProfileSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [settingsType, setSettingsType] = useState<'NFT' | 'AVATAR'>('AVATAR');

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'settings', subpage: 'profile' });
  }, []);

  const { data, loading, error } = useProfileSettingsQuery({
    variables: { request: { profileId: currentProfile?.id } },
    skip: !currentProfile?.id,
    onCompleted: (data) => {
      const picture = data?.profile?.picture;
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
    return <Custom404 />;
  }

  const profile = data?.profile;

  interface TypeButtonProps {
    name: string;
    icon: ReactNode;
    type: 'NFT' | 'AVATAR';
  }

  const TypeButton: FC<TypeButtonProps> = ({ name, icon, type }) => (
    <button
      type="button"
      onClick={() => setSettingsType(type)}
      className={clsx(
        {
          'text-brand bg-brand-100 bg-opacity-100 font-bold dark:bg-opacity-20': settingsType === type
        },
        'text-brand hover:bg-brand-100 flex items-center space-x-2 rounded-lg px-4 py-2 hover:bg-opacity-100 dark:hover:bg-opacity-20 sm:px-3 sm:py-1'
      )}
    >
      {icon}
      <div className="hidden sm:block">{name}</div>
    </button>
  );

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
            <TypeButton icon={<PhotographIcon className="h-5 w-5" />} type="AVATAR" name="Upload avatar" />
            <TypeButton icon={<PhotographIcon className="h-5 w-5" />} type="NFT" name="NFT Avatar" />
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
