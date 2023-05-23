import Slug from '@components/Shared/Slug';
import { Trans } from '@lingui/macro';
import { POLYGONSCAN_URL } from 'data/constants';
import type { Profile, RecipientDataOutput } from 'lens';
import { useProfilesQuery } from 'lens';
import formatAddress from 'lib/formatAddress';
import formatHandle from 'lib/formatHandle';
import getAvatar from 'lib/getAvatar';
import getStampFyiURL from 'lib/getStampFyiURL';
import Link from 'next/link';
import type { FC } from 'react';

interface SplitsProps {
  recipients: RecipientDataOutput[];
}

const Splits: FC<SplitsProps> = ({ recipients }) => {
  const { data: recipientProfilesData, loading } = useProfilesQuery({
    variables: { request: { ownedBy: recipients?.map((r) => r.recipient) } },
    skip: !recipients?.length
  });

  if (recipients.length === 0) {
    return null;
  }

  const getProfileByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items;
    if (profiles) {
      return profiles.find((p) => p.ownedBy === address);
    }
  };

  return (
    <div className="space-y-2 pt-3">
      <div className="mb-2 font-bold">
        <Trans>Fee recipients</Trans>
      </div>
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
                    <Link href={`/u/${formatHandle(profile?.handle)}`}>
                      <Slug slug={formatHandle(profile?.handle)} prefix="@" />
                    </Link>
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
