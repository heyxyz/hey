import MetaTags from '@components/Common/MetaTags';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import { PhotographIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import { APP_NAME } from 'data/constants';
import { useProfileSettingsQuery } from 'lens';
import type { NextPage } from 'next';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';
import NFTPicture from './NFTPicture';
import Picture from './Picture';
import Profile from './Profile';

const ProfileSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [settingsType, setSettingsType] = useState<'NFT' | 'AVATAR'>('AVATAR');

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
    return <PageLoading message="Loading settings" />;
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
          'text-brand bg-brand-100 dark:bg-opacity-20 bg-opacity-100 font-bold': settingsType === type
        },
        'flex items-center space-x-2 rounded-lg px-4 sm:px-3 py-2 sm:py-1 text-brand hover:bg-brand-100 dark:hover:bg-opacity-20 hover:bg-opacity-100'
      )}
    >
      {icon}
      <div className="hidden sm:block">{name}</div>
    </button>
  );

  return (
    <GridLayout>
      <MetaTags title={`Profile settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight className="space-y-5">
        <Profile profile={profile as any} />
        <Card className="space-y-5 p-5">
          <div className="flex items-center space-x-2">
            <TypeButton icon={<PhotographIcon className="w-5 h-5" />} type="AVATAR" name="Upload avatar" />
            <TypeButton icon={<PhotographIcon className="w-5 h-5" />} type="NFT" name="NFT Avatar" />
          </div>
          {settingsType === 'NFT' ? (
            <NFTPicture profile={profile as any} />
          ) : (
            <Picture profile={profile as any} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default ProfileSettings;
