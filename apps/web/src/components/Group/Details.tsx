import type { Group } from '@hey/types/hey';
import type { FC, ReactNode } from 'react';

import Markup from '@components/Shared/Markup';
import Slug from '@components/Shared/Slug';
import { ClockIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';
import { APP_NAME, STATIC_IMAGES_URL } from '@hey/data/constants';
import formatDate from '@hey/lib/datetime/formatDate';
import getMentions from '@hey/lib/getMentions';
import { Image, LightBox, Tooltip } from '@hey/ui';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import urlcat from 'urlcat';

interface DetailsProps {
  group: Group;
}

const Details: FC<DetailsProps> = ({ group }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);
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
      <div className="relative size-32 sm:size-52">
        <Image
          alt={group.slug}
          className="size-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(group.avatar)}
          src={group.avatar}
          width={128}
        />
        <LightBox
          onClose={() => setExpandedImage(null)}
          show={Boolean(expandedImage)}
          url={expandedImage}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate">{group.name}</div>
          {group.featured ? (
            <Tooltip content="Featured">
              <FireIcon className="size-6 text-yellow-500" />
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
                  alt={`${APP_NAME} Logo`}
                  className="size-4"
                  height={16}
                  src="/logo.png"
                  width={16}
                />
              }
            >
              <Link href={`/u/${group.lens}`}>
                <Slug prefix="@" slug={group.lens} />
              </Link>
            </MetaDetails>
          ) : null}
          {group.x ? (
            <MetaDetails
              icon={
                <img
                  alt="X Logo"
                  className="size-4"
                  height={16}
                  src={`${STATIC_IMAGES_URL}/brands/${
                    resolvedTheme === 'dark' ? 'x-dark.png' : 'x-light.png'
                  }`}
                  width={16}
                />
              }
            >
              <Link
                href={urlcat('https://x.com/:username', {
                  username: group.x
                })}
                rel="noreferrer noopener"
                target="_blank"
              >
                {group.x}
              </Link>
            </MetaDetails>
          ) : null}
          {group.instagram ? (
            <MetaDetails
              icon={
                <img
                  alt="Instagram Logo"
                  className="size-4"
                  height={16}
                  src={`${STATIC_IMAGES_URL}/brands/instagram.png`}
                  width={16}
                />
              }
            >
              <Link
                href={urlcat('https://instagram.com/:username', {
                  username: group.instagram
                })}
                rel="noreferrer noopener"
                target="_blank"
              >
                {group.instagram}
              </Link>
            </MetaDetails>
          ) : null}
          {group.discord ? (
            <MetaDetails
              icon={
                <img
                  alt="Discord Logo"
                  className="size-4"
                  height={16}
                  src={`${STATIC_IMAGES_URL}/brands/discord.png`}
                  width={16}
                />
              }
            >
              <Link
                href={group.discord}
                rel="noreferrer noopener"
                target="_blank"
              >
                Discord
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<ClockIcon className="size-4" />}>
            {formatDate(group.createdAt)}
          </MetaDetails>
        </div>
      </div>
    </div>
  );
};

export default Details;
