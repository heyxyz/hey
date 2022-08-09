import { Card, CardBody } from '@components/UI/Card';
import { Profile } from '@generated/types';
import {
  AtSymbolIcon,
  BeakerIcon,
  CashIcon,
  HashtagIcon,
  IdentificationIcon,
  LinkIcon,
  PhotographIcon
} from '@heroicons/react/outline';
import formatAddress from '@lib/formatAddress';
import getAttribute from '@lib/getAttribute';
import { getFollowModule } from '@lib/getFollowModule';
import hasPrideLogo from '@lib/hasPrideLogo';
import isBeta from '@lib/isBeta';
import React, { FC, ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import toast from 'react-hot-toast';
import { APP_NAME } from 'src/constants';

interface Props {
  profile: Profile;
}

const ProfileMod: FC<Props> = ({ profile }) => {
  const MetaDetails = ({
    children,
    title,
    value,
    icon
  }: {
    children: ReactNode;
    title?: string;
    value: string;
    icon: ReactNode;
  }) => (
    <CopyToClipboard
      text={value}
      onCopy={() => {
        toast.success('Copied to clipboard!');
      }}
    >
      <div className="flex gap-2 items-center font-bold cursor-pointer linkify">
        {icon}
        {title ? <div className="text-sm text-gray-500">{title}:</div> : null}
        <div>{children}</div>
      </div>
    </CopyToClipboard>
  );

  return (
    <Card className="mt-5 border-yellow-400 !bg-yellow-300 !bg-opacity-20">
      <CardBody>
        <div className="text-lg font-bold">Details</div>
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
              value={profile?.handle}
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
            value={profile?.handle}
            title="Handle"
          >
            {profile?.handle}
          </MetaDetails>
          <MetaDetails
            icon={<IdentificationIcon className="w-4 h-4 text-gray-500" />}
            value={profile?.handle}
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
          <MetaDetails icon={<BeakerIcon className="w-4 h-4 text-gray-500" />} value={profile?.handle}>
            {isBeta(profile) ? 'Beta user' : 'Non-beta user'}
          </MetaDetails>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileMod;
