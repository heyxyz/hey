import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { MicrophoneIcon, PlusCircleIcon } from '@heroicons/react/outline';
import type { Profile, Publication } from '@lenster/lens';
import { useProfileQuery, useProfilesQuery } from '@lenster/lens';
import getPublicationAttribute from '@lenster/lib/getPublicationAttribute';
import { Button, Modal } from '@lenster/ui';
import { type FC, useState } from 'react';
import { Space } from 'src/types';

import Wrapper from '../Wrapper';
import SpacePlayer from './SpacePlayer';
import UserProfile from '@components/Shared/UserProfile';

interface SpaceUserProps {
  profileId: string;
}

const SpaceUser: FC<SpaceUserProps> = ({ profileId }) => {
  const { data, loading, error } = useProfileQuery({
    variables: { request: { profileId } },
    skip: !profileId || profileId === 'Guest'
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data?.profile) {
    return null;
  }

  return (
    <div>
      <UserProfile profile={data?.profile as Profile} />
    </div>
  );
};

export default SpaceUser;
