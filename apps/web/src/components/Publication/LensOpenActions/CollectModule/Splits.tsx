import Slug from '@components/Shared/Slug';
import { POLYGONSCAN_URL } from '@hey/data/constants';
import type { Profile, RecipientDataOutput } from '@hey/lens';
import { useProfilesQuery } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import getStampFyiURL from '@hey/lib/getStampFyiURL';
import Link from 'next/link';
import type { FC } from 'react';

interface SplitsProps {
  recipients: RecipientDataOutput[];
}

const Splits: FC<SplitsProps> = ({ recipients }) => {
  const { data: recipientProfilesData, loading } = useProfilesQuery({
    variables: {
      request: { where: { ownedBy: recipients?.map((r) => r.recipient) } }
    },
    skip: !recipients?.length
  });

  if (recipients.length === 0) {
    return null;
  }

  const getProfileByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items;
    if (profiles) {
      return profiles.find((p) => p.ownedBy.address === address);
    }
  };

  return (
    <div className="space-y-2 pt-3">
      <div className="mb-2 font-bold">Fee recipients</div>
      {recipients.map((recipient) => {
        const { recipient: address, split } = recipient;
        const profile = getProfileByAddress(address) as Profile;

        return (
          <div
            key={address}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex w-full items-center space-x-2">
              {loading ? (
                <>
                  <div className="shimmer h-5 w-5 rounded-full" />
                  <div className="shimmer h-3 w-1/4 rounded-full" />
                </>
              ) : (
                <>
                  <img
                    className="h-5 w-5 rounded-full border bg-gray-200 dark:border-gray-700"
                    src={profile ? getAvatar(profile) : getStampFyiURL(address)}
                    alt="Avatar"
                  />
                  {profile ? (
                    profile.handle ? (
                      <Link
                        href={
                          profile.handle
                            ? `/u/${formatHandle(profile.handle)}`
                            : `/profile/${profile.id}`
                        }
                      >
                        <Slug
                          slug={formatHandle(profile.handle) as string}
                          prefix="@"
                        />
                      </Link>
                    ) : (
                      <Slug slug={profile.id} prefix="#" />
                    )
                  ) : (
                    <Link
                      href={`${POLYGONSCAN_URL}/address/${address}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {formatAddress(address, 6)}
                    </Link>
                  )}
                </>
              )}
            </div>
            <div className="font-bold">{split}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default Splits;
