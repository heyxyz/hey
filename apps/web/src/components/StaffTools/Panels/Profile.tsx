import {
  CashIcon,
  HandIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotographIcon
} from '@heroicons/react/outline';
import { ShieldCheckIcon } from '@heroicons/react/solid';
import { APP_NAME } from '@lenster/data/constants';
import type { Profile } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import formatHandle from '@lenster/lib/formatHandle';
import getFollowModule from '@lenster/lib/getFollowModule';
import getProfileAttribute from '@lenster/lib/getProfileAttribute';
import hasPrideLogo from '@lenster/lib/hasPrideLogo';
import { Card } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

import MetaDetails from './MetaDetails';

interface ProfileStaffToolProps {
  profile: Profile;
}

const ProfileStaffTool: FC<ProfileStaffToolProps> = ({ profile }) => {
  return (
    <Card as="aside" className="mt-5 border-yellow-400 !bg-yellow-300/20 p-5">
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">
          <Trans>Staff tool</Trans>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {getProfileAttribute(profile?.attributes, 'app') === APP_NAME && (
          <MetaDetails
            icon={
              <img
                className="h-4 w-4"
                height={16}
                width={16}
                src={hasPrideLogo(profile) ? '/pride.svg' : '/logo.svg'}
                alt="Logo"
              />
            }
            value={formatHandle(profile?.handle)}
          >
            <Trans>{APP_NAME} account</Trans>
          </MetaDetails>
        )}
        <MetaDetails
          icon={<HashtagIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile?.id}
          title={t`Profile ID`}
        >
          {profile?.id}
        </MetaDetails>
        <MetaDetails
          icon={<CashIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile?.ownedBy}
          title={t`Address`}
        >
          {formatAddress(profile?.ownedBy)}
        </MetaDetails>
        {profile?.followNftAddress ? (
          <MetaDetails
            icon={<PhotographIcon className="lt-text-gray-500 h-4 w-4" />}
            value={profile?.followNftAddress}
            title={t`NFT address`}
          >
            {formatAddress(profile?.followNftAddress)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<HandIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile.dispatcher?.canUseRelay ? 'Yes' : 'No'}
          title={t`Can use relay`}
        >
          {profile.dispatcher?.canUseRelay ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<HandIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile.dispatcher?.sponsor ? 'Yes' : 'No'}
          title={t`Gas sponsored`}
        >
          {profile.dispatcher?.sponsor ? 'Yes' : 'No'}
        </MetaDetails>
        <MetaDetails
          icon={<IdentificationIcon className="lt-text-gray-500 h-4 w-4" />}
          value={formatHandle(profile?.handle)}
          title={t`Follow module`}
        >
          {getFollowModule(profile?.followModule?.__typename).description}
        </MetaDetails>
        <MetaDetails
          icon={<LinkIcon className="lt-text-gray-500 h-4 w-4" />}
          value={profile?.metadata}
          title={t`Metadata`}
        >
          <Link href={profile?.metadata ?? ''} target="_blank" rel="noreferrer">
            <Trans>Open</Trans>
          </Link>
        </MetaDetails>
      </div>
    </Card>
  );
};

export default ProfileStaffTool;
