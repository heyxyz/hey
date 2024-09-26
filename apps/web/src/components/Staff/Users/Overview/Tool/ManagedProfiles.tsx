import SmallSingleProfile from "@components/Shared/SmallSingleProfile";
import { UsersIcon } from "@heroicons/react/24/outline";
import type { Profile } from "@hey/lens";
import { useProfilesManagedQuery } from "@hey/lens";
import { H5 } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";

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
        <H5>Managed profiles</H5>
      </div>
      <div className="mt-3">
        {loading ? (
          <div>Loading managed profiles...</div>
        ) : (
          <div className="space-y-2">
            {data?.lastLoggedInProfile ? (
              <div>
                <Link href={`/staff/users/${data?.lastLoggedInProfile?.id}`}>
                  <SmallSingleProfile
                    profile={data?.lastLoggedInProfile as Profile}
                  />
                </Link>
                <div className="divider my-5 border-yellow-600 border-dashed" />
              </div>
            ) : null}
            {data?.profilesManaged.items.map((profile) => (
              <div key={profile.id}>
                <Link href={`/staff/users/${profile.id}`}>
                  <SmallSingleProfile profile={profile as Profile} />
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
