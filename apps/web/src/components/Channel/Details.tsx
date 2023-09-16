import Join from '@components/Shared/Channel/Join';
import Markup from '@components/Shared/Markup';
import Slug from '@components/Shared/Slug';
import { ClockIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import { STATIC_IMAGES_URL } from '@lenster/data/constants';
import formatHandle from '@lenster/lib/formatHandle';
import type { Channel } from '@lenster/types/lenster';
import { Image, LightBox, Tooltip } from '@lenster/ui';
import { formatDate } from '@lib/formatTime';
import { t } from '@lingui/macro';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { create } from 'zustand';

import Members from './Members';

// Member count state
interface ChannelMemberCountState {
  membersCount: number;
  setMembersCount: (membersCount: number) => void;
}

export const useChannelMemberCountStore = create<ChannelMemberCountState>(
  (set) => ({
    membersCount: 0,
    setMembersCount: (membersCount) => set({ membersCount })
  })
);

interface DetailsProps {
  channel: Channel;
}

const Details: FC<DetailsProps> = ({ channel }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactNode;
    icon: ReactNode;
  }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div className="text-md truncate">{children}</div>
    </div>
  );

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="relative h-32 w-32 sm:h-52 sm:w-52">
        <Image
          onClick={() => setExpandedImage(channel.avatar)}
          src={channel.avatar}
          className="h-32 w-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52"
          height={128}
          width={128}
          alt={channel.slug}
        />
        <LightBox
          show={Boolean(expandedImage)}
          url={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate" data-testid="profile-name">
            {channel.name}
          </div>
          {channel.featured ? (
            <Tooltip content={t`Featured`}>
              <FireIcon className="h-6 w-6 text-yellow-500" />
            </Tooltip>
          ) : null}
        </div>
        <Slug
          className="text-sm sm:text-base"
          prefix="c/"
          slug={channel.slug}
        />
      </div>
      <div
        className="markup linkify text-md mr-0 break-words sm:mr-10"
        data-testid="profile-bio"
      >
        <Markup>{channel.description}</Markup>
      </div>
      <div className="space-y-5">
        <Members />
        {currentProfile ? <Join channel={channel} /> : null}
        <div className="divider w-full" />
        <div className="space-y-2">
          {channel.instagram ? (
            <MetaDetails
              icon={
                <img
                  src="/logo.svg"
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="Lenster Logo"
                />
              }
            >
              <Link href={`/u/${formatHandle(channel.lens)}`}>
                <Slug slug={formatHandle(channel.lens)} />
              </Link>
            </MetaDetails>
          ) : null}
          {channel.x ? (
            <MetaDetails
              icon={
                <img
                  src={`${STATIC_IMAGES_URL}/brands/${
                    resolvedTheme === 'dark' ? 'x-dark.png' : 'x-light.png'
                  }`}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="X Logo"
                />
              }
            >
              <Link
                href={`https://x.com/${channel.x}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {channel.x}
              </Link>
            </MetaDetails>
          ) : null}
          {channel.instagram ? (
            <MetaDetails
              icon={
                <img
                  src={`${STATIC_IMAGES_URL}/brands/instagram.png`}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="Instagram Logo"
                />
              }
            >
              <Link
                href={`https://instagram.com/${channel.instagram}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {channel.instagram}
              </Link>
            </MetaDetails>
          ) : null}
          {channel.discord ? (
            <MetaDetails
              icon={
                <img
                  src={`${STATIC_IMAGES_URL}/brands/discord.png`}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="Discord Logo"
                />
              }
            >
              <Link
                href={channel.discord}
                target="_blank"
                rel="noreferrer noopener"
              >
                Discord
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<ClockIcon className="h-4 w-4" />}>
            {formatDate(new Date(channel.created_at))}
          </MetaDetails>
        </div>
      </div>
    </div>
  );
};

export default Details;
