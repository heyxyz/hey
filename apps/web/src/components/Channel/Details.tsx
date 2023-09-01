import Markup from '@components/Shared/Markup';
import Slug from '@components/Shared/Slug';
import { ClockIcon } from '@heroicons/react/outline';
import { FireIcon } from '@heroicons/react/solid';
import type { Channel } from '@lenster/types/lenster';
import { Image, LightBox, Tooltip } from '@lenster/ui';
import { formatDate } from '@lib/formatTime';
import { t } from '@lingui/macro';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';

interface DetailsProps {
  channel: Channel;
}

const Details: FC<DetailsProps> = ({ channel }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const MetaDetails = ({
    children,
    icon,
    dataTestId = ''
  }: {
    children: ReactNode;
    icon: ReactNode;
    dataTestId?: string;
  }) => (
    <div className="flex items-center gap-2" data-testid={dataTestId}>
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
        <div className="divider w-full" />
        <div className="space-y-2">
          <MetaDetails icon={<ClockIcon className="h-4 w-4" />}>
            {formatDate(new Date(channel.created_at))}
          </MetaDetails>
        </div>
      </div>
    </div>
  );
};

export default Details;
