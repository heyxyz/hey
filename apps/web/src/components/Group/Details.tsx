'use client';

import Markup from '@components/Shared/Markup';
import Slug from '@components/Shared/Slug';
import { ClockIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import getMentions from '@hey/lib/getMentions';
import type { Group } from '@hey/types/hey';
import { Image, LightBox, Tooltip } from '@hey/ui';
import { formatDate } from '@lib/formatTime';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import urlcat from 'urlcat';

interface DetailsProps {
  group: Group;
}

const Details: FC<DetailsProps> = ({ group }) => {
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
          onClick={() => setExpandedImage(group.avatar)}
          src={group.avatar}
          className="h-32 w-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52"
          height={128}
          width={128}
          alt={group.slug}
        />
        <LightBox
          show={Boolean(expandedImage)}
          url={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate">{group.name}</div>
          {group.featured ? (
            <Tooltip content="Featured">
              <FireIcon className="h-6 w-6 text-yellow-500" />
            </Tooltip>
          ) : null}
        </div>
        <Slug className="text-sm sm:text-base" prefix="g/" slug={group.slug} />
      </div>
      <div className="markup linkify text-md mr-0 break-words sm:mr-10">
        <Markup mentions={getMentions(group.description)}>
          {group.description}
        </Markup>
      </div>
      <div className="space-y-5">
        <div className="divider w-full" />
        <div className="space-y-2">
          {group.lens ? (
            <MetaDetails
              icon={
                <img
                  src="/logo.png"
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt={`${APP_NAME} Logo`}
                />
              }
            >
              <Link href={`/u/${group.lens}`}>
                <Slug slug={group.lens} prefix="@" />
              </Link>
            </MetaDetails>
          ) : null}
          {group.x ? (
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
                href={urlcat('https://x.com/:username', {
                  username: group.x
                })}
                target="_blank"
                rel="noreferrer noopener"
              >
                {group.x}
              </Link>
            </MetaDetails>
          ) : null}
          {group.instagram ? (
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
                href={urlcat('https://instagram.com/:username', {
                  username: group.instagram
                })}
                target="_blank"
                rel="noreferrer noopener"
              >
                {group.instagram}
              </Link>
            </MetaDetails>
          ) : null}
          {group.discord ? (
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
                href={group.discord}
                target="_blank"
                rel="noreferrer noopener"
              >
                Discord
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<ClockIcon className="h-4 w-4" />}>
            {formatDate(new Date(group.createdAt))}
          </MetaDetails>
        </div>
      </div>
    </div>
  );
};

export default Details;
