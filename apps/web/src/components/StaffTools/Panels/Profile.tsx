import { Card } from '@components/UI/Card';
import {
  AtSymbolIcon,
  CashIcon,
  HandIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotographIcon
} from '@heroicons/react/outline';
import { ShieldCheckIcon } from '@heroicons/react/solid';
import formatAddress from '@lib/formatAddress';
import formatHandle from '@lib/formatHandle';
import getAttribute from '@lib/getAttribute';
import { getFollowModule } from '@lib/getFollowModule';
import hasPrideLogo from '@lib/hasPrideLogo';
import { APP_NAME } from 'data/constants';
import type { Profile } from 'lens';
import type { FC } from 'react';

import MetaDetails from './MetaDetails';

interface Props {
  profile: Profile;
}

const ProfileStaffTool: FC<Props> = ({ profile }) => {
  return (
    <Card as="aside" className="mt-5 border-yellow-400 !bg-yellow-300 !bg-opacity-20 p-5">
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Staff tool</div>
      </div>
      <div className="mt-3 space-y-1.5">
        {getAttribute(profile?.attributes, 'app') === APP_NAME && (
          <MetaDetails
            icon={
              <img
                className="w-4 h-4"
                height={16}
                width={16}
                src={hasPrideLogo(profile) ? '/pride.svg' : '/logo.svg'}
                alt="Logo"
              />
            }
            value={formatHandle(profile?.handle)}
          >
            {APP_NAME} account
          </MetaDetails>
        )}
        <MetaDetails
          icon={<HashtagIcon className="w-4 h-4 text-gray-500" />}
          value={profile?.id}
          title="Profile ID"
        >
          {profile?.id}
        </MetaDetails>
        <MetaDetails
          icon={<CashIcon className="w-4 h-4 text-gray-500" />}
          value={profile?.ownedBy}
          title="Address"
        >
          {formatAddress(profile?.ownedBy)}
        </MetaDetails>
        <MetaDetails
          icon={<HandIcon className="w-4 h-4 text-gray-500" />}
          value={profile?.dispatcher?.canUseRelay ? 'Yes' : 'No'}
          title="Dispatcher enabled"
        >
          {profile?.dispatcher?.canUseRelay ? 'Yes' : 'No'}
        </MetaDetails>
        {profile?.followNftAddress ? (
          <MetaDetails
            icon={<PhotographIcon className="w-4 h-4 text-gray-500" />}
            value={profile?.ownedBy}
            title="NFT address"
          >
            {formatAddress(profile?.followNftAddress)}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<AtSymbolIcon className="w-4 h-4 text-gray-500" />}
          value={formatHandle(profile?.handle)}
          title="Handle"
        >
          {formatHandle(profile?.handle)}
        </MetaDetails>
        <MetaDetails
          icon={<IdentificationIcon className="w-4 h-4 text-gray-500" />}
          value={formatHandle(profile?.handle)}
          title="Follow module"
        >
          {getFollowModule(profile?.followModule?.__typename).description}
        </MetaDetails>
        <MetaDetails
          icon={<LinkIcon className="w-4 h-4 text-gray-500" />}
          value={profile?.metadata}
          title="Metadata"
        >
          <a href={profile?.metadata} target="_blank" rel="noreferrer">
            Open
          </a>
        </MetaDetails>
      </div>
    </Card>
  );
};

export default ProfileStaffTool;
