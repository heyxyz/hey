import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useProfilesManagedQuery } from '@hey/lens';
import Link from 'next/link';

interface ManagedProfilesProps {
  address: string;
}

const ManagedProfiles: FC<ManagedProfilesProps> = ({ address }) => {
  const { data, loading } = useProfilesManagedQuery({
    variables: {
      lastLoggedInProfileRequest: { for: address },
      profilesManagedRequest: { for: address }
    }
  });

  return (
    <>
      <div className="mt-5 flex items-center space-x-2 text-yellow-600">
        <UsersIcon className="size-5" />
        <div className="text-lg font-bold">Managed profiles</div>
      </div>
      <div className="mt-3">
        {loading ? (
          <div>Loading managed profiles...</div>
        ) : (
          <div className="space-y-2">
            {data?.lastLoggedInProfile ? (
              <div>
                <Link href={`/staff/users/${data?.lastLoggedInProfile?.id}`}>
                  <SmallUserProfile
                    profile={data?.lastLoggedInProfile as Profile}
                  />
                </Link>
                <div className="divider my-5 border-dashed border-yellow-600" />
              </div>
            ) : null}
            {data?.profilesManaged.items.map((profile) => (
              <div key={profile.id}>
                <Link href={`/staff/users/${profile.id}`}>
                  <SmallUserProfile profile={profile as Profile} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ManagedProfiles;
