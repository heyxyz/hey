import type { Profile, RecipientDataOutput } from '@good/lens';
import type { FC } from 'react';

import Slug from '@components/Shared/Slug';
import {
  APP_NAME,
  POLYGONSCAN_URL,
  REWARDS_ADDRESS
} from '@good/data/constants';
import formatAddress from '@good/helpers/formatAddress';
import getAvatar from '@good/helpers/getAvatar';
import getProfile from '@good/helpers/getProfile';
import getStampFyiURL from '@good/helpers/getStampFyiURL';
import { useProfilesQuery } from '@good/lens';
import { Image } from '@good/ui';
import Link from 'next/link';

interface SplitsProps {
  recipients: RecipientDataOutput[];
}

const Splits: FC<SplitsProps> = ({ recipients }) => {
  const { data: recipientProfilesData, loading } = useProfilesQuery({
    skip: !recipients?.length,
    variables: {
      request: { where: { ownedBy: recipients?.map((r) => r.recipient) } }
    }
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

        if (address === REWARDS_ADDRESS) {
          return (
            <div key={address}>
              <div className="divider mb-2 mt-3" />
              <div className="flex items-center justify-between text-sm">
                <div className="ld-text-gray-500 flex w-full items-center space-x-2">
                  <img alt="Good" className="size-4" src="/logo.png" />
                  <b>{APP_NAME} Fees</b>
                </div>
                <div className="font-bold">{split}%</div>
              </div>
            </div>
          );
        }

        return (
          <div
            className="flex items-center justify-between text-sm"
            key={address}
          >
            <div className="flex w-full items-center space-x-2">
              {loading ? (
                <>
                  <div className="shimmer size-5 rounded-full" />
                  <div className="shimmer h-3 w-1/4 rounded-full" />
                </>
              ) : (
                <>
                  <Image
                    alt="Avatar"
                    className="size-5 rounded-full border bg-gray-200 dark:border-gray-700"
                    src={profile ? getAvatar(profile) : getStampFyiURL(address)}
                  />
                  {profile ? (
                    <Link href={getProfile(profile).link}>
                      <Slug slug={getProfile(profile).slugWithPrefix} />
                    </Link>
                  ) : (
                    <Link
                      href={`${POLYGONSCAN_URL}/address/${address}`}
                      rel="noreferrer noopener"
                      target="_blank"
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
