import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@lenster/lens';
import { useProfileQuery } from '@lenster/lens';
import { type FC } from 'react';

interface SpaceUserProps {
  profileId: string;
}

const SpaceUser: FC<SpaceUserProps> = ({ profileId }) => {
  const { data, loading } = useProfileQuery({
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
